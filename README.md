This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Db schemas

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR UNIQUE NOT NULL,
password TEXT NOT NULL,
license_status VARCHAR,
db_id VARCHAR,
CONSTRAINT unique_username_dbid UNIQUE (username, db_id)
);

CREATE TABLE sessions (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
token TEXT NOT NULL,
token_type VARCHAR NOT NULL,
expires_at TIMESTAMP,
db_id VARCHAR,
CONSTRAINT unique_user_token_type UNIQUE (user_id, token_type)
);

CREATE TABLE customers (
id SERIAL PRIMARY KEY,
name VARCHAR NOT NULL,
phone VARCHAR,
address TEXT,
place VARCHAR,
db_id VARCHAR NOT NULL,
CONSTRAINT unique_dbid_name UNIQUE (db_id, name)
);

CREATE TABLE licenses (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
issued_at TIMESTAMP,
expires_at TIMESTAMP,
status VARCHAR,
approved_by VARCHAR,
db_id VARCHAR,
CONSTRAINT licenses_user_id_key UNIQUE (user_id)
);

CREATE TABLE admin_punch_records (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
customer_name VARCHAR,
date TIMESTAMP,
punch_in_time TIMESTAMP,
punch_out_time TIMESTAMP,
total_time_spent INTERVAL,
punch_location_in VARCHAR,
punch_location_out VARCHAR,
punch_image TEXT,
dress_off_customer TEXT,
db_id VARCHAR
);

CREATE TABLE api_users (
id SERIAL PRIMARY KEY,
name VARCHAR NOT NULL,
email VARCHAR UNIQUE NOT NULL,
password TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
db_id VARCHAR UNIQUE
);
