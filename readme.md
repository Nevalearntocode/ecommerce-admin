# CMS Ecommerce Admin Dashboard: NEXT.js 14, TypeScript, TailwindCSS, Shadcn/ui, Auth.js (NextAuth.js v5), PostgreSQL, Prisma.

## Key Features
- Multiple store types: Product attributes are specific to the store type (e.g., clothing: color, size; tech: model, type).
- Employee Management: Add employees to your store through an invite link.
- Basic Employee Role: Each added employee has a basic role that allows them to create, read, update, and delete products, as well as read and mark orders as paid.
- Role-Based System:
    - Owner: Assigned when creating a store, with the ability to delete the store.
    - Admin: Can manage employees.
    - Manager: Can change store name, slug, and image.
    - Categories Manager: Has full access to categories.
    - Billboards Manager: Has full access to managing billboards.
    - Products Manager: Default role with basic product management capabilities.


## Other Features

- Authentication: Supports credentials and Google login using Auth.js. (Credentials auth used for testing only, aware of security risks like brute-force attacks. Google login recommended for production.)
- Responsive Design and Dark Mode: Built with Tailwind CSS and Shadon/UI.
- CRUD Operations: Create, update, and delete stores, categories, billboards, products, product attributes, and cancel orders (depending on user role).
- Search Functionality: Available across all routes that support searching.
- Custom API Routes: Support search by filters through product attributes.
- Custom Middleware: Facilitates easier user navigation.
- Validations: Both frontend and backend validations ensure proper server actions and API calls.

### Prerequisites

**Latest LTS node version**
**PostgreSQL Database (I'm using localhost for development and neon for production)**


### Cloning the repository

```shell
git clone https://github.com/Nevalearntocode/ecommerce-admin.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
ALLOWED_FRONTEND_ORIGIN=
AUTH_TRUST_HOST=

```
### Setup Prisma

Add PostgreSQL Database (Neon or local)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                                                |
| :------ | :--------------------------------------------------------  |
| `dev`   | Starts a development instance of the app                   |
| `build` | Creates an optimized production build of the application   |
| `start` | Starts the production server (after running npm run build) |

**Uploadthing Callbacks in Production**
**Uploadthing callbacks require your application to be accessible over the internet. Ensure your production app is publicly reachable and not running on localhost.**