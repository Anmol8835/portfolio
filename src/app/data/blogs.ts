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
