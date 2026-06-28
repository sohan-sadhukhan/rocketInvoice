
# This is NOT the Next.js you know

- This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Heed deprecation notices.

- Never expose internal database errors to users.

## Form Patterns

- Schemas in src/lib/zodSchema.ts — export both schema and type X = z.infer<typeof  xSchema>.

- Components use "use client", react-hook-form + @hookform/resolvers/zod, and shadcn primitives:

```typescript
const  { handleSubmit, control,  formState:  { isSubmitting }  }  =  useForm({
resolver: zodResolver(mySchema),
defaultValues:  {  ...  },
mode:  "all",
});
```
- Each field goes through Controller:
```typescript
<Controller
name="fieldName"
control={control}
render={({  field,  fieldState  }) => (
<Field data-invalid={fieldState.invalid}>
<FieldLabel htmlFor={field.name}>Label</FieldLabel>
<Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..."  />
{fieldState.invalid  && <FieldError  errors={[fieldState.error]} />}
</Field>
)}
/>
```
- Submit: <form  onSubmit={handleSubmit(handler)}  noValidate>. Button disabled while submitting with icon toggle.

## Agent behavior

- Ask questions. When ambiguous, when there are real implementation choices with tradeoffs, or before destructive actions, use the question tool. Prefer one batched question over back-and-forth guessing.
- Remember new learning. When you discover a gotcha, convention, or command not documented here, add it back. Keep entries concise; delete stale ones.
- Use skills. Before writing code for a task matching a listed skill (shadcn, prisma-_, better-auth-_, etc.), load it with the skill tool.

## Stack at a glance

- Next.js 16.2 + React 19.2 (App Router, Turbopack default, React Compiler on, typedRoutes: true)
- Prisma 7 with `@prisma/adapter-libsql` (SQLite, file-backed)
- Better Auth 1.6 with the admin + nextCookies plugins; Argon2 password hashing via @node-rs/argon2
- S3-compatible object storage @aws-sdk/client-s3; sharp for image processing
- Tailwind CSS v4 (CSS-only config in globals.css; no tailwind.config.ts)
- shadcn/ui (style preset base-rhea) with primitives from @base-ui/react (not Radix)
- next-themes (default dark, enableSystem={false}), react-toastify, react-hook-form + @hookform/resolvers/zod
- @t3-oss/env-nextjs + Zod v4 for env validation
- Zod v4 throughout (zod), compatible with z.infer, .min(), .refine(), etc.
- next.config.ts sets serverActions.bodySizeLimit: "5mb"

## Verification

- Lint: bun lint — ESLint with eslint-config-next core-web-vitals + typescript.
- Type gate: bun run build — runs prisma generate && next build. No separate typecheck script and no test framework TypeScript errors surface only during build.
- Full prod: bun prod — prisma generate && eslint && next build && next start. Run before schema or env changes.
- Format: prettier --write . (runs prettier-plugin-tailwindcss). Config: singleAttributePerLine, bracketSameLine, experimentalTernaries.
- No CI workflows. .github/dependabot.yml is the only thing under .github/ (daily npm updates).

## Prisma (Prisma 7, custom output)

- Generator: `provider = "prisma-client"`, `output = "../generated/prisma"`. This is the Prisma 7 generator, **not**  `prisma-client-js`.
- Import the client as `import { PrismaClient } from "@generated/prisma/client"`. There is no `@prisma/client` import surface in this repo.
- Always import the Prisma client from src/lib/database/dbClient.ts, Never instantiate `new PrismaClient()` anywhere else.
-  `prisma/schema.prisma` has **no**  `datasource.url` line. The URL comes from `prisma.config.ts` via `env("DATABASE_URL")` (loaded with `dotenv/config`). Do not add it back inline.
-  `src/lib/database/dbClient.ts` is a `globalThis` singleton (HMR-safe) wired to `PrismaLibSql`. Do not instantiate `PrismaClient` elsewhere; import from this file.
-  `serverEnv.DATABASE_URL` is Zod-validated to start with `file:./` (`src/lib/env/serverEnv.ts`). A non-`file:./` URL throws at boot.
- No migrations exist yet — `bun migrate` (`prisma migrate dev && prisma generate`) creates `prisma/migrations/`. Schema edits go through that command, not `prisma db push`.
-  `bun studio` runs headless (`--browser none`); open the printed URL in a browser manually.
-  `generated/**` is gitignored and excluded from ESLint. Do not hand-edit generated files.
-  `build` and `prod` scripts prepend `prisma generate` — running raw `next build` will fail with missing types if the client is stale.

### Money

- Always use Prisma Decimal for currency.
- Never use float or number for prices, totals, GST or payments.

## Env validation (T3 env)

- src/lib/env/clientEnv.ts and src/lib/env/serverEnv.ts define Zod schemas via @t3-oss/env-nextjs.

## Auth (Better Auth)

- Server instance: src/lib/auth.ts. Client instance: src/lib/auth-client.ts (uses inferAdditionalFields<typeof  auth> + adminClient).
- Route handler: src/app/api/auth/[...all]/route.ts — single line, toNextJsHandler(auth) exports GET/POST.
- Password hashing is custom (@node-rs/argon2 with BETTER_AUTH_SECRET as the pepper, see src/lib/argon2.ts). Do not call argon2 directly elsewhere — go through hashPasswordFunction / verifyPasswordFunction.
- Auth config: cookie prefix rocketinvoice, nextCookies() plugin, custom per-route rate limits (/sign-in/_, /sign-up/_, /reset-password/\*, /get-session). sendResetPassword currently console.logs — no email service wired yet.
- Session reads on the server use auth.api.getSession({ headers: await headers() }) (Next 16 async headers).

## Authorization

- Every mutation and private query must ensure the authenticated user owns the resource being accessed.
- Never trust IDs received from the client.
- Always scope database queries using the authenticated user's Business.

### Good

```typescript
where:  {
id,
businessId:  session.user.business.id
}
```

### Bad

```typescript
where:  {
id
}
```

## App layout & route groups

- src/app/(public)/ — unauthenticated pages (Home, About, Download, login/register/forgot/reset). Layout wraps in mx-auto max-w-7xl.
- src/app/(private)/ — layout.tsx redirects to /login if no session. Any page that requires auth must live under (private)/.
- typedRoutes: true is on — dynamic href strings (e.g. `/product/${slug}`) require as unknown as never cast. Seen throughout the codebase; do not "fix" by removing the cast.

## Server actions (src/server/)

- Layout: src/server/<domain>/<actionName>.ts (domains: admin, invoice, customer, user, product). One action per file, each starts with "use server".
- Mutations (create, update, delete, toggle) return { success: boolean; data?: T; error?: string } — matching ApiResponse<T> in src/lib/types.ts. Throw only for exceptional cases; surface user-facing problems via error.
- Read-only queries (getProducts, getCustomers, getInvoices, etc.) return domain types directly (PaginatedResponse<T>, Products[], etc.) — no success/error envelope.
- Auth gating: mutations and private queries gate with auth.api.getSession(...).
- Mutations call revalidatePath(...) on affected routes after writes.
- Every server action that accepts user input must validate it using the corresponding schema from src/lib/zodSchema.ts before performing any database operations.

## Styling

- Tailwind v4: all config lives in src/app/globals.css via @theme inline and @custom-variant. PostCSS plugin is @tailwindcss/postcss. There is no tailwind.config.ts — do not create one.
- globals.css imports shadcn/tailwind.css and tw-animate-css; removing either breaks the Base Rhea tokens or animations

## shadcn / Base UI

- components.json sets style: "base-rhea", ui → @/components/shadcnui (not the default @/components/ui), hooks → @/hooks. Add components with bunx shadcn add ...; they land in src/components/shadcnui/.
- Primitives come from @base-ui/react (e.g. Button as ButtonPrimitive from @base-ui/react/button). Do not introduce Radix or react-aria primitives — they don't share Base Rhea styling.
- App components live under src/components/<Domain>/<Name>.tsx (PascalCase folders and files). Only shadcnui primitives use kebab-case filenames.

## Code style

- Arrow functions for app code. const name = (...args) => ... for top-level functions, callbacks, and React components. No function declarations/expressions.
- shadcn-generated files (src/components/ui/, src/lib/utils.ts) use function declarations — don't rewrite them.

## File Picker Standard

- When implementing image upload functionality in this project, always use the useFilePicker hook from use-file-picker.

### Requirements

- Use readAs: "DataURL" for image preview.
- Accept only image files using:
- accept: "image/\*"
- Allow only a single file:
- multiple: false
- Enforce a maximum file size of 5 MB using FileSizeValidator.
- Maintain an isFile state to determine whether an image has been selected.
- Set isFile to true in onFilesSuccessfullySelected.
- Set isFile to false in onClear.

## UI Behavior

- Before a file is selected, display the placeholder image (/static/placeholder.svg).
- After selection, preview the selected image using filesContent.
- Display a validation error if the selected file exceeds the 5 MB limit.
- Provide a "Choose Image" button that triggers openFilePicker.
- If the selected image is removed, call clear() and revert to the placeholder.

## Standard Configuration

```typescript
const  [isFile, setIsFile]  =  useState(false);
const  { openFilePicker, filesContent, plainFiles, errors, clear }  =
useFilePicker({
readAs:  "DataURL",
accept:  "image/*",
multiple:  false,
validators: [new  FileSizeValidator({  maxFileSize:  5  *  1024  *  1024  })],
onFilesSuccessfullySelected:  ()  =>  setIsFile(true),
onClear:  ()  =>  setIsFile(false),
});
```

### Notes

- Keep image previews responsive using object-cover.
- Never use a native <input  type="file"> directly unless there is a specific reason to bypass useFilePicker.
- Reuse this pattern across all image upload components (business logo, customer avatar, product image, profile image, etc.) to maintain a consistent user experience.

## Delete Policy

- Users, Customers, and Products are soft deleted using `deletedAt`.
- Businesses can only be soft deleted by `SUPER_ADMIN`.
- Invoices are never deleted. Use `InvoiceStatus.CANCELLED` instead.

## Notable dependencies

- date-fns (v4) —date formatting in invoice detail and other components. Import named functions: import { format, formatDistanceToNow } from "date-fns".
- lucide-react — icon library used throughout.

## Useful libraries & utilities

- cn(...) in src/lib/utils.ts. Use it; don't reinvent.
- LayoutChildrenProps and ApiResponse<T> in src/lib/types.ts.

## Package manager

- bun.lock is committed; Bun is the primary workflow (bun install, bun <script>, bunx shadcn ...). npm works (node >=22, npm >=11  in engines) but configs are written around Bun. prisma db seed shells out to bun prisma/seed.ts.

### Misc

- ESLint ignores: .next/**, out/**, build/**, next-env.d.ts, generated/**. Uses flat config format (eslint.config.mjs).
- .env is gitignored; .env.example is the committed template. Do not commit secrets.