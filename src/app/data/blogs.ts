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
    title: "Cost-Aware LLM Routing — Cheap by Default, Smart Only When It Has to Be",
    slug: "cost-aware-llm-routing-cheap-by-default",
    excerpt: "A 20–70x price gap separates budget from frontier models, but most traffic doesn't need the expensive one. How a classify-then-route gateway keeps costs low — and how I stop the savings number from lying to me.",
    date: "2026-09-07",
    tags: ["LLM", "Routing", "Cost Optimization", "Backend", "API Gateway"],
    content: `If you're routing every request to a frontier model, you're paying 20-70x more than you need to for most of your traffic. \`claude-opus\` costs $5/$25 per million tokens; \`deepseek-v4-flash\` costs $0.22/$0.66. A "hi, can you summarize this?" prompt doesn't care which one answers it. The problem is that users won't pick the right model per request — and asking them to try is the fastest way to lose them.

So the gateway does it for them. Every request is classified first, then routed to the cheapest model that can actually do the job well. This post is about how that routing decision gets made, and how I keep it honest.

## The Core Bet: Most Requests Are Cheap

Real traffic is a long tail. Summaries, translations, fact lookups, "rewrite this email", boilerplate CRUD code — these are the majority, and a budget model handles them fine. The expensive work — hard debugging, formal math, multi-step research, safety-sensitive reasoning — is a minority, but it's the part that genuinely needs a reasoning-tier model.

The routing principle follows directly: **cheap by default, escalate only when the request clearly needs it.** The default routing mode is \`cheap\`. A request has to earn a more expensive model.

## What the Classifier Hands the Router

Before routing, a hybrid classifier labels the request. Three free signals run in parallel — deterministic rules, an embedding matcher, and structural profile checks — and their votes are fused. Only when fused confidence drops below a threshold does an LLM fallback fire. The router only cares about a few of these outputs:

- **\`primary_task\`** — what the user is actually doing (code_generation, summarization, mathematics, …)
- **\`complexity\`** — low / medium / high
- **\`routing.model_type\`** — the tier the task wants: general_model, reasoning_model, coding_model, fast_model…
- **\`risk\`** — including a \`restricted\` tier for legal/medical/safety-sensitive asks
- **\`latency_preference\`** — fast / normal / quality_first

\`routing.model_type\` is the strongest signal, and \`complexity\` is the cost-sensitivity knob. Everything else nudges around the edges.

## Hard Filters Come First

Before any scoring, the router drops models that can't do the job:

- **Context window** — a request that won't fit (90% threshold) can't go to that model, full stop.
- **Capabilities** — tool-calling, vision, audio are hard requirements, not preferences.
- **Restricted content** — a \`restricted\` request only goes to a safety-oriented model.
- **The reasoning-tier filter** — a request classified as \`reasoning_model\` can never be served by a fast-tier model, even in cheap mode. This is the rule that makes "cheap by default" safe: cost pressure can't downgrade a hard reasoning task.

The filters shrink the candidate set to "models that could actually succeed." Only then does cost enter.

## The Scoring Model

Each surviving candidate gets a score:

\`score = qualityWeight * qualityScore + costWeight * costTierScore\`

- **\`qualityScore\`** — how well the model matches the request: model-type match (45%), task affinity (35%), complexity match (20%).
- **\`costTierScore\`** — how well the model's price tier (budget / low / standard / premium) matches the request's cost sensitivity. A low-complexity request strongly prefers budget models; a high-complexity one prefers standard/premium.

The weights shift with routing mode — set per-request via an \`X-Routing-Mode\` header, defaulting to \`cheap\`:

- **cheap** — quality 0.35 / cost 0.65
- **balanced** — 0.60 / 0.40
- **quality** — 0.85 / 0.15

Then two small corrections. A latency bonus/penalty for \`fast\` vs \`quality_first\` preferences. And a **cost-efficiency boost** — \`1 / (inputPrice + outputPrice)\` — so that when two models tie on quality, the cheaper one wins. In \`cheap\` mode that boost is 0.12, enough to break ties but not enough to flip a bad quality match.

## Escalation Is the Exception

The classifier can force an upgrade even in \`cheap\` mode:

- \`latency_preference = quality_first\` or a \`human_review_recommended\` flag jumps the mode to \`quality\`.
- \`risk = restricted\` already filtered the field to safety models.
- \`complexity = high\` moves the cost-sensitivity tier up, so standard/premium models score far better than budget ones.

That's the whole trick. Cheap is the default; the classifier, not the user, decides when a request stops being cheap. And because escalation is a small, well-defined set of triggers rather than a magic threshold, it's easy to reason about and audit.

## Keeping the Savings Honest

Two places this can quietly lie, and how I guard against them.

**The classifier isn't free.** When the free signals are uncertain, the classifier falls back to calling a real LLM (\`deepseek-chat\`), and those tokens are billed. So "savings" can't be "provider spend only" — the metrics store adds classifier cost into the total: \`totalCost = providerCost + classifierCost\`. The dashboard then compares that total against a fixed-model baseline — what the same traffic would have cost if every request went to one model. That's the honest number.

- Average saved vs. routing everything through \`claude-sonnet\`: **[SAVED_PCT]**%
- Average saved vs. routing everything through \`claude-opus\`: **[SAVED_PCT_OPUS]**%
- Classifier overhead as a share of total spend: **[CLASSIFIER_OVERHEAD_PCT]**%

**Mis-routing is the other leak.** If a hard task gets pushed to a budget model, the "savings" show up on the dashboard but the user eats a bad answer or re-sends the prompt. I don't have a clean automated metric for this yet — right now it's the reasoning-tier filter plus manual spot-checks of \`primary_task\` vs the selected model in the recent-requests feed. Mis-route rate: **[MISROUTE_RATE]** (still hand-measured).

## Where It Still Bites

- The embedding and rule classifiers are cheap but brittle — out-of-vocabulary prompts can mislabel complexity, and a mislabeled "high" complexity on a trivial prompt sends it to an expensive model. Over-escalation is safer than under-escalation, but it quietly inflates the bill.
- \`restricted\` detection is conservative on purpose; a false positive routes ordinary asks to the most expensive safety model.
- The savings number is only as good as the baseline you compare against — "cheaper than opus" is a low bar, and I have to keep reminding myself of that when the dashboard looks flattering.

## The Takeaway

Cost-aware routing isn't a model-selection feature — it's a classification problem with a budget attached. If your classifier is good at separating "a budget model can do this" from "only a reasoning model should do this," the routing almost writes itself: cheap by default, escalate on a small set of explicit triggers, and count the classifier's own tokens before you claim you saved anything.

The pricing gap isn't going away. The teams that win on cost won't be the ones with a cleverer prompt — they'll be the ones who stopped sending every request to the most expensive model by default.`
  },
  {
    title: "Distributed Caching — Why It's Harder Than It Looks",
    slug: "distributed-caching-harder-than-it-looks",
    excerpt: "Caching feels simple until you have more than one server. Here's what breaks when you move from a single-node cache to a distributed one — cache stampedes, inconsistency windows, hot-key saturation, and why Redis Cluster alone doesn't save you.",
    date: "2026-07-22",
    tags: ["Distributed Systems", "Caching", "Redis", "Backend"],
    content: `If you've ever added \`@cacheable\` to a function and called it a day, this post is about everything that happens after that stops working. Caching is deceptively easy on a single machine — a hashmap in memory, a TTL, done. But the moment you have multiple application instances, that hashmap becomes a liability. Different instances hold different versions of the truth, and suddenly your users see stale data, your database melts under coordinated misses, or your cache keys clump together and saturate one node.

I ran into these problems building the LLM API gateway — a service that sits between client applications and multiple AI providers, handling request routing, rate limiting, and cost tracking. Caching was unavoidable: provider capabilities don't change often, token prices update infrequently, and re-fetching API key validation results on every request is wasteful. But with multiple gateway instances running behind a load balancer, a local cache wasn't going to cut it.

Here's what I learned about distributed caching, the failure modes that only appear at scale, and the patterns that actually work.

## Why Not Just Redis?

The obvious answer is "put Redis in the middle and move on," and for many cases that's correct. Redis (or Redis Cluster) gives you a shared, network-accessible cache that all your instances can read from — no more per-instance inconsistency. But Redis brings its own set of problems:

- **Network latency on every cache access.** A local hashmap lookup is measured in nanoseconds. A Redis call is measured in microseconds to milliseconds. If you're not thoughtful about what you cache and when you fetch it, you can easily make your service *slower* with a distributed cache than it was without one.
- **Single-node Redis is still a single point of failure.** Redis Cluster fixes this with sharding and replication, but cluster-aware clients, split-brain during partitions, and resharding operations are non-trivial operational concerns.
- **Redis doesn't solve cache coherence.** It gives you a shared store, but it doesn't tell you *when* to write, *how* to invalidate, or *who* is responsible for keeping data fresh. Those are still application-level decisions, and they're the hard part.

The rest of this post assumes you've chosen Redis (or something like it) as your shared cache store. The interesting problems are what you build on top.

## Cache Stampede — When Protection Becomes a Mob

The most famous distributed caching failure mode. Picture this: you have a cache key that's expensive to compute — say, an aggregated cost report spanning thousands of usage records. It has a 5-minute TTL. At minute 5, the key expires. Before any single instance can recompute and repopulate it, 200 concurrent requests arrive, all find the cache empty, and all 200 instances simultaneously hammer your database with the same expensive query. Congratulations, your cache just *amplified* your load instead of reducing it.

The classic fix is **probabilistic early recomputation**. Instead of letting the key expire at exactly TTL, each read checks: "is this key within X% of its expiry?" If yes, there's a probability the reader will choose to recompute it *before* it expires, while still serving the stale value to everyone else. XPERF, used inside Meta's cache infrastructure, calls this "early expiration with a recompute probability curve." The key insight: you never want zero readers holding a valid value.

Another approach is **per-key locking** — when a cache miss occurs, acquire a distributed lock (Redlock or a simpler SETNX) before recomputing. Only the lock holder queries the database; everyone else either waits on the lock or serves a stale fallback. The downside is complexity: now you have lock TTLs, deadlock recovery, and lock contention to think about.

For our gateway, we use a simpler variant: **background refresh with stale serving**. A single background goroutine refreshes expensive keys on a timer, and application code *always* reads from cache without triggering recomputation. If the cache key is missing (cold start or Redis restart), we serve a default config baked into the binary. The data might be up to N minutes stale, but the system is never thundering.

## The Inconsistency Window

Even with a shared cache, inconsistency creeps in. Consider this sequence:

1. Instance A updates the database (new token price: \$0.02 per 1K tokens)
2. Instance A writes the new value to the cache
3. Instance B reads the cache — gets the new value. Good.
4. Instance C reads the cache a millisecond before A's write lands — gets the old value. It now holds stale data until the key expires or is overwritten.

Between steps 1 and 2, there's a window where the database and cache disagree. If A crashes between steps 1 and 2, the cache is stale indefinitely. This is the fundamental tension: you cannot have perfect consistency, availability, and partition tolerance all at once. The question is which tradeoff you make.

**Cache-aside** (the most common pattern): application code manages the cache explicitly. On read, check cache → miss → fetch from DB → populate cache. On write, update DB → invalidate cache key. The write path is critical: if you update the cache instead of invalidating it, and two writes race, the cache can end up with the *older* value (write A → write B to DB, but write B → write A to cache). Invalidation avoids this — the next read just repopulates with whatever is in the DB. But it doesn't eliminate the window between DB write and cache invalidate.

**Write-through**: the cache sits in front of the database, and every write goes to both. The cache is always consistent with the DB by construction. The cost? Every write now has the latency of cache + DB, and the cache holds every write whether it's read again or not — your cache becomes a mirror, not a filter.

**Write-behind**: writes go to the cache first and are asynchronously flushed to the DB. This is fast (write to Redis, return, DB updated later) but risky — if Redis loses data before the flush, you've lost writes permanently. Only acceptable when durability isn't critical or when Redis is configured with AOF persistence and you're comfortable with the window of potential loss.

For the gateway, we use cache-aside with invalidation for most data, and a write-through pattern for rate-limit counters where consistency matters more than write latency.

## Hot Keys and the Single-Node Bottleneck

Not all keys are created equal. A cache key holding the default pricing tier is read on every single request. If a particular user's API key is used by a high-traffic tenant, that key's validation result becomes a hot key — requested hundreds or thousands of times per second.

In a sharded Redis Cluster, a hot key lives on exactly one shard. That shard's CPU and network bandwidth become the bottleneck, even if the other shards are idle. The cluster's total capacity is irrelevant — you can only go as fast as the one node holding the hot key.

Fixes, in increasing order of complexity:

- **Local caching with a short TTL.** Cache the hot key in each instance's process memory with a TTL of a few seconds. You'll serve N instances × 1 Redis fetch per TTL window instead of N instances × every request. This is the cheapest win and solves 80% of hot-key problems.
- **Key replication.** Store the hot key under multiple Redis keys (\`hotkey:0\`, \`hotkey:1\`, \`hotkey:2\`) and pick one randomly on read. Each replica lands on a different shard, distributing the load. On write, update all replicas. This works but adds write amplification.
- **Client-side sharding with consistent hashing.** Skip Redis and hash requests across a set of local caches, using a deterministic ring so all instances agree which instance "owns" which key. Request lands on instance A, instance A checks if it's the owner — if not, forward to the owner instance. This is basically building a distributed hash table yourself, and you probably shouldn't. But it's an option when Redis is the bottleneck and you need sub-millisecond latency.

## TTL Design — The Art of Picking a Number

TTLs feel trivial. They're not. The wrong TTL causes either cache stampedes (too short) or staleness bugs (too long). A few rules of thumb:

- **Hierarchical TTLs for composed data.** If a user's rate-limit status depends on their subscription tier and their usage count, don't give the final computed value one TTL. Give each layer its own: subscription tier cached for 5 minutes, usage count for 30 seconds, and the derived status computed on read. This way the freshest data dominates the parts that change fast, without invalidating the whole tree.
- **TTL jitter.** Never set the exact same TTL for keys that were populated together. If 10,000 keys were loaded during a cache warm and all expire at T+3600 seconds, you've just scheduled a stampede. Add ±10-20% random jitter to every TTL so expirations smear across time.
- **Negative caching.** When a lookup returns "not found" (invalid API key, missing resource), cache that negative result too — with a *much shorter* TTL than a positive hit. Otherwise, a malicious client can spam random keys and force a DB lookup on every request.
- **TTL as a contract, not a guess.** Document what staleness your application tolerates and derive TTLs from that, not from intuition. If the product says "token prices can lag by up to 2 minutes," your TTL is 120 seconds. If it says "rate limits must be accurate within 5 seconds," your TTL is 5. The number falls out of the requirement.

## Eviction — When Memory Runs Out

Sooner or later, your cache will be full. What happens next depends on your eviction policy:

- **LRU (Least Recently Used):** the default, and usually correct. Evicts keys that haven't been accessed in the longest time. Works well for most workloads because recency is a strong proxy for future access.
- **LFU (Least Frequently Used):** evicts keys with the lowest access count. Better when you have a small set of super-hot keys and a long tail of one-off accesses — LRU would eventually evict the hot keys during a brief lull, while LFU preserves them. The downside: LFU is slow to adapt when access patterns shift, because frequency counters take time to decay.
- **TTL-only:** Redis's \`volatile-ttl\` evicts keys closest to expiry first. Useful when all keys have TTLs and you'd rather lose a key that was about to expire anyway than one with a long remaining life.
- **No-eviction:** Redis returns an error on writes when full. Only appropriate when the cache is a strict subset of the database and every key is mandatory — lose writes rather than silently drop reads.

Redis's default is \`noeviction\`, which is almost certainly wrong for a cache. Switch it to \`allkeys-lru\` unless you have a specific reason not to.

For the gateway, we run \`allkeys-lru\` with a maxmemory cap and monitor eviction rates. If evictions spike, we either increase memory or revisit what we're caching. Caching everything is not a strategy — it's a lack of one.

## Observability — You Can't Fix What You Can't See

A cache that silently returns stale data or has a 30% miss rate is broken in ways no error log will surface. You need metrics:

- **Hit rate** (by key family, not just globally). A 95% global hit rate can hide a 10% hit rate on the one key family that powers your most expensive query. Break it down.
- **Staleness lag:** how far behind the source of truth is the cached value right now? Requires the cache value to carry a timestamp and the reader to compare it against the DB. Expensive to measure continuously, but invaluable during incidents.
- **Eviction rate:** keys evicted per second. A sudden spike means your working set just exceeded your memory budget.
- **Fill latency:** how long does it take to recompute and populate a cache miss? If this spikes, your backend is struggling and a stampede is imminent.
- **Hot-key saturation:** requests per second per key, bucketed. The 99th percentile key should not be handling 80% of the traffic.

Prometheus + Grafana with Redis's built-in metrics (\`INFO stats\`, \`INFO keyspace\`) covers most of this. The key-familiy hit rate requires application-level instrumentation — tag each cache read with a \`key_family\` label in your metrics library.

## What We Actually Run

For the LLM gateway, the caching strategy ended up as three tiers:

1. **Process-local cache (in-memory, no network).** Holds provider capability metadata and API key validation results. TTL: 30 seconds. Eliminates ~90% of Redis reads for hot keys. Implemented as a simple \`Map\` with a background sweep goroutine — no need for a library.

2. **Redis for shared state.** Rate-limit counters (write-through), user subscription tiers (cache-aside with invalidation), and aggregated usage reports (background refresh, stale serving). \`allkeys-lru\`, 2 GB maxmemory, TTL jitter of ±15%.

3. **Local defaults compiled into the binary.** When both the local cache and Redis are empty (cold start, Redis outage), every lookup falls back to a conservative default — the highest token price, the strictest rate limit, the minimal set of capabilities. The system degrades to "safe and slow" rather than "broken."

None of this is novel. It's just deliberate.

## The Takeaway

Distributed caching is not a technology problem — Redis, Memcached, and friends are mature and well-understood. It's a design problem. Every cache decision is a bet about what will be requested next and how stale the answer can be. The hard parts are:

- Recognizing that cache stampedes, inconsistency windows, and hot keys are not edge cases — they're *eventualities* at scale.
- Picking TTLs from requirements, not intuition.
- Instrumenting cache behavior so you know when your bets are wrong.
- Accepting that the cache *will* be empty sometimes and designing fallbacks that don't require it.

If you take one thing from this post, make it this: **design your system to work (degraded) without the cache, then add the cache to make it fast.** If your system breaks when the cache is empty, you don't have a cache — you have a single point of failure with a fancier name.`
  },
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
