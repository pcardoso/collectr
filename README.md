# Collectr

> Keep your receipts and invoices organised by month, then email them straight to your accountant.

## Features

- 📁 **Drag & drop** receipts (PDF, email `.eml`, images) onto a month slot
- 🔁 **Recurring categories** – Hosting, Services, Communications, Rent — new slots appear every month automatically
- 📅 **Organised by month** – navigate backwards and forwards through months
- ✉️ **Email composer** – one click to compose a summary email with all receipts listed, ready to send to your accountant
- ☁️ **Optional S3 backend** – when running the backend your files are uploaded to AWS S3; without it they are stored as data-URLs locally in the browser

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Wouter, Zustand |
| Backend  | Node.js, Express, TypeScript, Multer, AWS SDK v3 |

---

## Getting started

### 1. Install dependencies

```bash
# From the repo root
npm install --workspace=frontend
npm install --workspace=backend
```

### 2. Configure the backend (optional)

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your AWS credentials and S3 bucket name
```

### 3. Start the development servers

**Frontend only** (files stored as data-URLs in browser):

```bash
cd frontend
npm run dev
```

**Frontend + backend** (files uploaded to S3):

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

The frontend dev-server proxies `/api` requests to `http://localhost:3001`.

### 4. Build for production

```bash
cd frontend && npm run build   # outputs to frontend/dist
cd backend  && npm run build   # outputs to backend/dist
```

---

## S3 bucket policy

Your S3 bucket should allow `s3:PutObject` for the IAM user whose credentials you configured.
A minimal policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

---

## Project structure

```
collectr/
├── frontend/          # React app (Vite)
│   └── src/
│       ├── components/    # UI components
│       ├── store/         # Zustand store
│       ├── types/         # Shared TypeScript types
│       └── hooks/         # API helpers
└── backend/           # Express API
    └── src/
        ├── routes/        # /api/upload
        └── config/        # S3 client setup
```
