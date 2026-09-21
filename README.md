# RocketInvoice

RocketInvoice is an invoice management application for creating and managing invoices, clients, products, tax rates, and businesses in one place.

## Features

- Dashboard with invoice summaries, recent activity, and quick actions
- Create and manage invoices with downloadable PDF output
- Manage clients, products, product families, and tax rates
- Support for multiple businesses
- User registration, sign-in, password management, and account settings
- Admin tools for managing users and businesses
- Responsive light and dark themes
- Form validation and server-side authorization

## Preview

![RocketInvoice Dashboard](/public/preview2.png)

![RocketInvoice Invoice](/public/preview3.png)

![RocketInvoice Home](/public/preview1.png)

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS v4
- shadcn/ui with Base UI primitives
- Prisma 7 with SQLite and the libSQL adapter
- Better Auth
- Zod and React Hook Form
- React PDF Renderer for invoice PDFs
- Bun as the primary package manager and runtime

## Project Structure

```text
rocketInvoice/
├── prisma/                 # Prisma schema, migrations, and seed data
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── (public)/       # Public pages
│   │   ├── (private)/      # Authenticated application pages
│   │   ├── api/            # API route handlers
│   │   └── auth/           # Authentication routes
│   ├── components/         # Application and shadcn components
│   ├── hooks/              # Reusable React hooks
│   ├── lib/                # Auth, database, environment, and utilities
│   └── server/             # Server actions grouped by domain
├── generated/              # Generated Prisma client output
├── next.config.ts
├── prisma.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 24 or newer
- Bun

### Installation

```bash
git clone https://github.com/sohan-sadhukhan/rocketInvoice.git
cd rocketInvoice
bun install
```

Create a local environment file:

```bash
cp .env.example .env
```

Set the required values in `.env`:

```env
DATABASE_URL=file:./prisma/dev.db
CHECKPOINT_DISABLE=1
BETTER_AUTH_SECRET=replace-with-a-secret-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000
```

Generate the Prisma client and apply the database migrations:

```bash
bun migrate
```

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Create an account and sign in.
2. Create or select a business.
3. Add clients, products, product families, and tax rates.
4. Create invoices and add the required line items.
5. Review invoices from the dashboard and download PDF copies when needed.

## Development

| Command         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `bun dev`       | Start the development server                             |
| `bun lint`      | Run ESLint                                               |
| `bun run build` | Generate Prisma and create a production build            |
| `bun start`     | Start the production server                              |
| `bun migrate`   | Create/apply Prisma migrations and regenerate the client |
| `bun studio`    | Open Prisma Studio                                       |
| `bun seed`      | Seed the database                                        |

Keep secrets in `.env`; do not commit them. Database schema changes should be made through Prisma migrations.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

[Sohan Sadhukhan](https://github.com/sohan-sadhukhan)
