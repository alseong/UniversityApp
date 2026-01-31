# Development Guidelines for Claude

> **About this file (v1.0.0):** Development guidelines for UniversityApp - a platform making university admissions transparent for high school students.
>
> **Architecture:**
> - **CLAUDE.md** (this file): Core philosophy + tech stack patterns
> - Tech stack specifics integrated throughout
> - Project context: Admission transparency platform using Next.js 14 + Supabase

## Core Philosophy

**TEST-DRIVEN DEVELOPMENT IS NON-NEGOTIABLE.** Every single line of production code must be written in response to a failing test. No exceptions. This is not a suggestion or a preference - it is the fundamental practice that enables all other principles in this document.

I follow Test-Driven Development (TDD) with a strong emphasis on behavior-driven testing and functional programming principles. All work should be done in small, incremental changes that maintain a working state throughout development.

## Tech Stack

- **Framework**: Next.js 14 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Database/Auth**: Supabase (PostgreSQL + Auth with SSR)
- **Styling**: Tailwind CSS (CSS variables for theming)
- **UI Components**: Shadcn/ui (Radix UI primitives + Tailwind)
- **Testing**: Jest/Vitest + React Testing Library
- **State**: React hooks (useState, useEffect, useMemo)
- **Forms**: Next.js Server Actions
- **Deployment**: Vercel

## Quick Reference

**Key Principles:**

- Write tests first (TDD non-negotiable)
- Test behavior, not implementation
- No `any` types or type assertions
- Immutable data only
- Small, pure functions
- TypeScript strict mode always
- Server-first architecture (default to Server Components)
- Use semantic Tailwind colors (support dark mode)
- Accessibility first (keyboard navigation, ARIA)

**Preferred Tools:**

- **Language**: TypeScript (strict mode)
- **Testing**: Vitest + React Testing Library
- **State Management**: React hooks with immutable patterns
- **Data Fetching**: Supabase clients (server/client based on component type)
- **Forms**: Server Actions with FormData
- **Styling**: Tailwind CSS utilities + Shadcn components

## Testing Principles

**Core principle**: Test behavior, not implementation. 100% coverage through business behavior.

**Quick reference:**
- Write tests first (TDD non-negotiable)
- Test through public API exclusively
- Use factory functions for test data (no `let`/`beforeEach`)
- Tests must document expected business behavior
- No 1:1 mapping between test files and implementation files

**Next.js/React Testing Patterns:**
- Server Components: Test data fetching and rendering outcomes
- Client Components: Use React Testing Library, test user interactions
- Server Actions: Test as functions with FormData inputs
- Integration tests: Test complete user flows through UI

```tsx
// ✅ Good - Tests behavior
describe("University filter", () => {
  it("shows only selected university records when filter applied", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByText("University of Toronto"));
    expect(screen.queryByText("McGill")).not.toBeInTheDocument();
  });
});

// ❌ Bad - Tests implementation
it("calls setFilter with correct value", () => {
  const setFilter = jest.fn();
  render(<Filter setFilter={setFilter} />);
  // Testing internal implementation details
});
```

## TypeScript Guidelines

**Core principle**: Strict mode always. Schema-first at trust boundaries, types for internal logic.

**Quick reference:**
- No `any` types - ever (use `unknown` if type truly unknown)
- No type assertions without justification
- Prefer `type` over `interface` for data structures
- Reserve `interface` for behavior contracts only
- Use auto-generated Supabase types for database operations
- Define domain types explicitly

```tsx
// ✅ Good - Explicit types
interface AdmissionRecord {
  Status: string;
  Average: number | null;
  School: string[];
  Program: string[];
}

export function filterRecords(
  records: AdmissionRecord[],
  filters: FilterState
): AdmissionRecord[] {
  return records.filter(record => /* logic */);
}

// ❌ Bad - Using any
function filterRecords(records: any, filters: any): any {
  return records.filter((r: any) => /* logic */);
}
```

## Code Style

**Core principle**: Functional programming with immutable data. Self-documenting code.

**Quick reference:**
- No data mutation - immutable data structures only
- Pure functions wherever possible
- No nested if/else - use early returns or composition
- No comments - code should be self-documenting
- Prefer options objects over positional parameters
- Use array methods (`map`, `filter`, `reduce`) over loops

```tsx
// ✅ Good - Immutable, pure
const updateFilters = (filters: FilterState, school: string): FilterState => {
  return { ...filters, school };
};

const filteredRecords = records.filter(r => r.School.includes(school));

// ❌ Bad - Mutation, impure
filters.school = school;
for (let i = 0; i < records.length; i++) {
  if (records[i].School.includes(school)) {
    filtered.push(records[i]);
  }
}
```

## Development Workflow

**Core principle**: RED-GREEN-REFACTOR in small, known-good increments. TDD is the fundamental practice.

**Quick reference:**

1. **RED**: Write failing test first (NO production code without failing test)
2. **GREEN**: Write MINIMUM code to pass test
3. **REFACTOR**: Assess improvement opportunities (only refactor if adds value)
4. **Commit**: Wait for approval before every commit
5. Each increment leaves codebase in working state
6. Capture learnings as they occur

**Example TDD Flow:**

```tsx
// 1. RED - Write failing test
describe("filterBySchool", () => {
  it("returns only records matching school", () => {
    const records = [
      { School: ["UofT"], Average: 90 },
      { School: ["McGill"], Average: 85 },
    ];
    expect(filterBySchool(records, "UofT")).toHaveLength(1);
  });
});

// 2. GREEN - Minimum code to pass
export const filterBySchool = (records: AdmissionRecord[], school: string) => {
  return records.filter(r => r.School.includes(school));
};

// 3. REFACTOR - Assess if improvements add value
// (Only refactor if there's clear benefit)
```

## Architecture Patterns

### Server-First Architecture

**Default to Server Components.** Only use `"use client"` when you need browser APIs, event handlers, or React hooks.

```tsx
// ✅ Server Component (default)
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('admissions').select();
  return <Dashboard data={data} />;
}

// ✅ Client Component (when needed)
"use client";
export function InteractiveFilter() {
  const [value, setValue] = useState("");
  return <input onChange={(e) => setValue(e.target.value)} />;
}
```

### Data Fetching with Supabase

**Server Components:**
```tsx
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("table").select();
  if (error) throw error;
  return <DataView data={data} />;
}
```

**Client Components:**
```tsx
"use client";
import { createClient } from "@/utils/supabase/client";

export function ClientData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("table").select();
      setData(data || []);
    };
    fetchData();
  }, []);

  return <DataView data={data} />;
}
```

### Form Handling with Server Actions

```tsx
// app/actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";

export async function signUpAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return encodedRedirect("error", "/sign-up", "All fields required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return encodedRedirect("error", "/sign-up", error.message);
  return encodedRedirect("success", "/sign-up", "Check your email");
}

// In component
<form action={signUpAction}>
  <Input name="email" type="email" required />
  <Input name="password" type="password" required />
  <SubmitButton pendingText="Signing up...">Sign up</SubmitButton>
</form>
```

### Styling with Tailwind

**Use semantic colors for theme support:**

```tsx
// ✅ Good - Semantic colors (supports dark mode)
<div className="bg-card text-card-foreground border-border">

// ❌ Bad - Hardcoded colors (breaks dark mode)
<div className="bg-white text-black border-gray-200">
```

**Color System:**
```
--background / --foreground       # Page bg/text
--card / --card-foreground        # Card surfaces
--primary / --primary-foreground  # Primary actions
--muted / --muted-foreground      # Muted/disabled
--destructive                     # Errors
--border                          # Borders
```

### Component Patterns

**Shadcn/ui Pattern:**
```tsx
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground", className)}
      {...props}
    />
  )
);
```

**Keep components focused:**
```tsx
// ✅ Good - Single responsibility
<FilterPanel filters={filters} onChange={setFilters} />
<DataTable data={filteredData} />

// ❌ Bad - Mixed concerns
<DataTableWithFiltersAndExport />
```

## Working with Claude

**Core principle**: Think deeply, follow TDD strictly, capture learnings while context is fresh.

**Quick reference:**
- ALWAYS FOLLOW TDD - no production code without failing test
- Assess refactoring after every green (but only if adds value)
- Update CLAUDE.md when introducing meaningful changes
- Ask "What do I wish I'd known at the start?" after significant changes
- Document gotchas, patterns, decisions, edge cases while context is fresh

**Before Committing:**
- All tests pass
- TypeScript has no errors (`npm run build`)
- Manual testing in dev environment
- Dark mode still works
- Keyboard navigation works

## Common Patterns

### Protected Routes
```tsx
export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return <ProtectedContent user={user} />;
}
```

### Performance Optimization
```tsx
const filteredRecords = useMemo(() => {
  return allRecords.filter(record =>
    filters.school ? record.School.includes(filters.school) : true
  );
}, [allRecords, filters]);
```

### Error Handling
```tsx
try {
  const { data, error } = await supabase.from("table").select();
  if (error) throw error;
  setData(data);
} catch (error) {
  console.error("Failed:", error);
  toast({
    title: "Error",
    description: "Failed to load data",
    variant: "destructive",
  });
}
```

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── (auth)/            # Route group
│   ├── actions.ts         # Server actions
│   └── page.tsx           # Pages
├── components/
│   ├── ui/                # Shadcn components
│   └── *.tsx              # Feature components
├── lib/utils.ts           # cn() utility
├── utils/                 # Domain utilities
├── types/                 # TypeScript types
└── middleware.ts          # Auth middleware
```

## Security

- Prefix client-side env vars with `NEXT_PUBLIC_`
- Never commit `.env.local`
- Rely on Supabase RLS policies, not client-side checks
- Use Server Actions for mutations
- Validate all inputs server-side

## Resources and References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Summary

The key is to write clean, testable, functional code that evolves through small, safe increments. **Every change must be driven by a test that describes the desired behavior**, and the implementation should be the simplest thing that makes that test pass. When in doubt, favor simplicity and readability over cleverness.

**Remember**: Test first. Server-first. Type-safe. Accessible. Immutable. Keep it simple.
