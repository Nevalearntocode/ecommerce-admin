# Full Stack Airbnb Clone with Next.js 14, React, TailwindCSS, Prisma, PostgreSQL, NextAuth, Shadcn/UI

Demos below:
- [Authentication](https://youtu.be/6uORlMD71Ro)
- [Navigate users](https://youtu.be/Ebqf4f2WLk8)
- [List a property](https://youtu.be/-C3pOLcC3sg)
- [Manage your related](https://youtu.be/xgdxA3PRTU0)
- [Search functionalities](https://youtu.be/iuMfDX36xNg)
- [Dark mode and responsiveness](https://youtu.be/YPbablL1-L4)

Current features:
- Authentication with NextAuth includes: credential, GitHub, and Google. (UX: When a user is created by the credential method, automatically log them in afterward.)
- Handling authentication errors with Sonner: Providing informative feedback to users
- Using middleware to navigate both authenticated and unauthenticated user.
- Login modal will pop up everytime unauthenticated users try to favorite or reserve a booking.
- List your home for rent and manage your favorites, properties, and reservations (including reservations from other guests on your properties).
- Create a slug every time a user lists or modifies their properties, in the back-end making sure there is no same slug in the database. 
    - if 3 properties all share the same title: "cool title", then their slugs will be cool-title, cool-title-1, cool-title-2 and you can go directly to booking page by using these slugs (/listings/{slug})
- Fully responsiveness design, light/dark mode using TailwindCSS and Shadcn/UI
- Image upload using uploadthing
- Form management and validation using react-hook-form + zod
- Server error handling using sonner
- Calendars with react-date-range
- Handling empty state for every page
- Handling reservation errors: Date conflicts with existing bookings
- Pricing calculation
- Advanced search algorithm by category, date range, map location, number of guests, rooms and bathrooms, all using search params to manage, this means you can share your search result with them.
- Favorites system (you can't favorite your properties, but can manage them through properties route)
- Query the database and select only the necessary columns to improve performance.

Planned features:
- Allow users to modify their profile, password, etc...
- Add search function for specific place includes title, region, flag...
- Add footer link to social accounts
- More info about property owners and customers for easier communications.

### Prerequisites

**Node latest LTS version**

### Cloning the repository

```shell
git clone https://github.com/Nevalearntocode/airbnb.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
DATABASE_URL=
NEXTAUTH_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

### Setup Prisma

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |