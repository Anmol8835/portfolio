export interface Blog {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
}

export const blogs: Blog[] = [
  {
    title: "Docker Sandboxing for Untrusted Code Execution",
    slug: "docker-sandboxing-untrusted-code-execution",
    excerpt: "Running user-submitted code safely is a hard problem. Here's how to use Docker containers as secure sandboxes — covering resource limits, seccomp profiles, network isolation, and the pitfalls that most tutorials skip.",
    date: "2026-07-15",
    tags: ["Docker", "Security", "Backend", "Sandboxing"],
    content: `Running untrusted code is one of those problems that looks deceptively simple until you're the one responsible for keeping a server from getting pwned. When I built the AlgoUniversity Online Judge — a platform where users submit arbitrary code in multiple languages that gets compiled and executed server-side — sandboxing wasn't optional. It was the entire product.

Here's what I learned about using Docker as a security boundary for executing untrusted code, and why the defaults are nowhere near enough.

## The Threat Model

Before reaching for tools, you need to know what you're defending against. Untrusted code execution opens several attack surfaces:

- **Resource exhaustion** — fork bombs, memory leaks, infinite loops that peg the CPU, or writing a 50 GB file to fill the disk
- **Network abuse** — using your server as a jump host to scan internal networks, hit external APIs, or exfiltrate data
- **Filesystem tampering** — reading sensitive files like \`/etc/shadow\`, environment variables, or the source code of other submissions
- **Container escape** — exploiting kernel vulnerabilities to break out of the container and gain host access
- **Privilege escalation** — abusing capabilities or misconfigured mounts to escalate to root on the host

A vanilla \`docker run python:3.12 python3 user_code.py\` protects you from exactly none of this. Let's fix that layer by layer.

## Layer 1: Resource Limits

The first and easiest win. Docker exposes cgroup controls that let you cap CPU, memory, and process counts directly:

- \`--cpus=1\` limits the container to one CPU core. Without this, an infinite loop saturates all available cores and your server grinds to a halt.
- \`--memory=256m\` caps RAM usage. When the container exceeds it, the OOM killer terminates the process rather than letting the host swap itself to death. Always set this — a single runaway allocation can take down services far beyond the container.
- \`--pids-limit=64\` prevents fork bombs. A classic \`:(){ :|:& };:\` in bash will spawn processes until the pid limit kicks in and the kernel refuses further forks.
- \`--storage-opt size=500m\` restricts the writable layer size. Without this, a \`while(true) { fs.writeFileSync(\`/tmp/\${i++}\`, Buffer.alloc(10*1024*1024))\` will fill your host disk.

These are table stakes — set them on every container that runs untrusted code, no exceptions.

## Layer 2: Network Isolation

User code has no business talking to the network. A submission calculating Fibonacci numbers doesn't need to call home. The simplest defense:

- \`--network none\` disables all networking inside the container. No outbound connections, no listening ports, nothing. This kills data exfiltration, reverse shells, SSRF attacks hitting your cloud metadata endpoint, and crypto miners phoning home.

If you absolutely need network access (say, to install packages before running), use a two-phase approach: a build container with network access to install dependencies, then an execution container with \`--network none\` to run the actual code.

## Layer 3: Filesystem Hardening

By default, the container runs as root — not host root, but root inside the container's user namespace, which is still too powerful. Several things to lock down:

- \`--read-only\` mounts the root filesystem as read-only. Now the code can't modify \`/etc\`, drop a cron job, or overwrite system binaries. Combine this with a small \`tmpfs\` mount for \`/tmp\` if the code needs a scratch space.
- \`--user 1000:1000\` runs the process as a non-root user inside the container. If the code exploits something, it's limited to what uid 1000 can do — which on a read-only filesystem isn't much.
- \`--tmpfs /tmp:size=100m,noexec,nosuid\` mounts \`/tmp\` as an in-memory filesystem with execution and setuid bits disabled. Many languages (Python, Node, Java) need \`/tmp\` for temp files, but they don't need to execute binaries from it.

The combination of read-only root, non-root user, and noexec tmpfs makes it dramatically harder for malicious code to persist or escalate.

## Layer 4: Seccomp Profiles

This is where things get serious. Seccomp (secure computing mode) lets you define exactly which system calls a process can make. Docker's default seccomp profile blocks around 44 out of 300+ syscalls — it's a reasonable baseline but doesn't go far enough for truly untrusted code.

For a code execution sandbox, consider explicitly denying:

- \`ptrace\` — prevents one process from attaching to and manipulating another. In a sandbox, nothing should need this.
- \`mount\` and \`umount2\` — if the root filesystem is read-only and you've mounted everything you need at container start, these serve no purpose and are pure attack surface.
- \`kexec_load\` and \`reboot\` — nobody's user-submitted code needs to load a new kernel or reboot anything.
- \`add_key\` and \`request_key\` — kernel keyring operations unrelated to running user code.
- \`clock_settime\` — user code can read the clock. It shouldn't set it.

Define the profile as a JSON file and pass it with \`--security-opt seccomp=/path/to/profile.json\`. A whitelist approach (explicitly allowing only the syscalls your language runtime needs) is safer than a blacklist, but harder to maintain across runtime versions.

## Layer 5: The Execution Wrapper

Docker's settings are the perimeter fence, but you also want a process-level guard inside the container. Write a thin wrapper script that:

- Sets a \`ulimit\` on CPU time (\`ulimit -t 10\`) as a second layer of timeout enforcement. Docker's \`--ulimit cpu=10\` does soft/hard limits, but a \`setrlimit\` inside the process is belt-and-suspenders.
- Writes the exit code, stdout, and stderr to well-known files in \`/tmp\` so your host can read results without ever entering the container after execution.
- Enforces a maximum output size — truncate stdout beyond 10 MB so a \`while(true) print("x")\` doesn't fill your disk.

This wrapper is the inner guard — it catches what the outer Docker configuration might miss.

## The Full Command

Putting it all together, a reasonably hardened execution looks something like:

\`docker run --rm --cpus=1 --memory=256m --pids-limit=64 --storage-opt size=500m --network none --read-only --tmpfs /tmp:size=100m,noexec,nosuid --user 1000:1000 --security-opt seccomp=seccomp.json --ulimit cpu=10 sandbox-image timeout 5s python3 /code/submission.py\`

Every flag here has a specific purpose. None are optional when the code you're running is untrusted.

## What This Doesn't Protect Against

Be honest about the gaps. Docker is process-level isolation, not a hypervisor. The container shares the host kernel, so a kernel exploit (CVE-2022-0492, CVE-2024-21626, pick your favorite) can still mean container escape. For truly adversarial workloads — think a public-facing code execution service where anyone on the internet can submit — you should consider:

- Running each execution in a **fresh micro-VM** with Firecracker (what AWS Lambda and Fly.io use) or gVisor (what Google Cloud Run uses). These give you a dedicated kernel or a userspace kernel reimplementation, which is a far stronger isolation boundary.
- **Dedicating worker nodes** to code execution, cordoned off from your primary infrastructure, so a breakout is contained.
- **Expiring and recycling** execution hosts frequently — if a container does escape, limit the dwell time.

## The Takeaway

Docker sandboxing sits on a spectrum. Stock \`docker run\` is convenience, not security. With cgroup limits, network isolation, read-only filesystems, non-root users, seccomp profiles, and an execution wrapper, you get to a level that is practical and safe enough for most use cases — coding platforms, CI pipelines, internal tools. But know where your threat model ends and where stronger primitives like Firecracker or gVisor need to take over.

The best sandbox is the one whose boundaries you've thought through deliberately, not the one that happened by default.`
  },
  {
    title: "Building Modern Web Applications with Next.js",
    slug: "building-modern-web-apps-nextjs",
    excerpt: "Exploring the power of Next.js for building fast, scalable, and SEO-friendly web applications. Learn about server components, app router, and modern React patterns.",
    date: "2026-06-20",
    tags: ["Next.js", "React", "Web Development"],
    content: `Next.js has revolutionized the way we build web applications. With features like server components, app router, and built-in optimization, it's easier than ever to create performant web apps.

## Why Next.js?

Next.js provides several advantages:

- **Server-side rendering** for better SEO
- **File-based routing** for intuitive project structure
- **API routes** for backend functionality
- **Image optimization** out of the box
- **TypeScript support** for type safety

## Getting Started

The new app directory in Next.js 13+ introduces a more powerful and flexible way to build applications. Server components allow you to fetch data directly in your components without client-side JavaScript overhead.

## Conclusion

Whether you're building a personal blog, e-commerce site, or complex web application, Next.js provides the tools and performance you need to succeed.`
  },
  {
    title: "The Art of Clean Code",
    slug: "art-of-clean-code",
    excerpt: "Writing maintainable, readable code is a skill that separates good developers from great ones. Here are principles and practices for writing clean code.",
    date: "2026-06-15",
    tags: ["Programming", "Best Practices", "Clean Code"],
    content: `Clean code is code that is easy to understand, easy to modify, and easy to maintain. It's not just about making code work—it's about making it work well for the long term.

## Key Principles

### 1. Meaningful Names
Use descriptive names for variables, functions, and classes. The name should reveal intent.

### 2. Single Responsibility
Each function should do one thing and do it well. This makes code easier to test and maintain.

### 3. Don't Repeat Yourself (DRY)
Avoid code duplication. Extract common functionality into reusable functions or modules.

### 4. Keep It Simple
Simplicity is the ultimate sophistication. Don't overcomplicate solutions.

## Practical Tips

- Write comments that explain *why*, not *what*
- Keep functions small and focused
- Use consistent formatting and style
- Write tests for your code
- Refactor regularly

## Conclusion

Clean code is an investment in your future self and your team. It takes discipline and practice, but the benefits are worth it.`
  },
  {
    title: "Understanding TypeScript Generics",
    slug: "understanding-typescript-generics",
    excerpt: "TypeScript generics can seem intimidating at first, but they're powerful tools for writing reusable, type-safe code. Let's demystify them.",
    date: "2026-06-10",
    tags: ["TypeScript", "Programming", "Type Safety"],
    content: `Generics are one of TypeScript's most powerful features, allowing you to write flexible, reusable code while maintaining type safety.

## What Are Generics?

Generics allow you to create components that can work with multiple types rather than a single one. Think of them as variables for types.

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`

In this example, \`T\` is a type parameter that gets replaced with the actual type when you call the function.

## Why Use Generics?

1. **Type Safety**: Catch errors at compile time
2. **Reusability**: Write code that works with multiple types
3. **Flexibility**: Create adaptable components and functions

## Common Use Cases

- Array operations
- API response handling
- Component props in React
- Utility types and functions

## Best Practices

- Use meaningful type parameter names
- Don't overuse generics—sometimes a simple type is better
- Constrain your generics when necessary

Generics might seem complex initially, but once you understand them, they become an indispensable tool in your TypeScript toolkit.`
  }
];
