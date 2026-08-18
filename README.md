# Card Capture 2: The Second One

A simple web app for uploading business or contact card photos, extracting contact information using AI via [JamAI Base](https://www.jamaibase.com/), reviewing and correcting the results, and saving the final verified record.

## What It Does

1. **Upload** — Drag-and-drop or select a photo of a business card (JPG, PNG, or WEBP, up to 10 MB).
2. **Generate** — The image is sent to a JamAI Base table, which uses AI to extract fields like name, title, phone, email, company, address, and more.
3. **Review & Edit** — All generated fields are shown in editable form inputs so you can correct any mistakes.
4. **Submit** — Save the reviewed record back to JamAI Base.

Optionally, you can add **Milestone Moments** (context about when/where you received the card) and a **Remark** before generating.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) with TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| AI / Backend | [JamAI Base](https://www.jamaibase.com/) via the official `jamaibase` TS/JS SDK |
| Validation | [Zod](https://zod.dev/) |
| State Management | React local state |
| Hosting | [Vercel](https://vercel.com/) (recommended) |

## Setup

### Prerequisites

- Node.js 18+
- npm
- A JamAI Base account with an existing action table configured for business card extraction

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
JAMAI_API_KEY=your_api_key_here
JAMAI_PROJECT_ID=your_project_id_here
JAMAI_TABLE_ID=your_table_id_here
JAMAI_TABLE_TYPE=action
JAMAI_BASE_URL=https://api.jamaibase.com
MAX_IMAGE_SIZE_MB=10
```

> **Important:** Never commit `.env.local` or expose your API key in client-side code.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Project Structure

```
card-capture/
├── app/
│   ├── api/cards/
│   │   ├── generate/route.ts   # Upload image → JamAI Base → return generated fields
│   │   └── submit/route.ts     # Save reviewed/corrected fields back to JamAI Base
│   ├── globals.css             # Tailwind imports & colour theme
│   ├── layout.tsx              # Root layout with header
│   └── page.tsx                # Main page (upload → review → success flow)
├── components/
│   ├── CardUploadForm.tsx      # Upload step with image picker & text fields
│   ├── FileDropzone.tsx        # Drag-and-drop file input
│   ├── ImagePreview.tsx        # Card image preview with remove button
│   ├── ReviewForm.tsx          # Editable generated fields + submit
│   ├── StatusMessage.tsx       # Loading / error / success banners
│   └── ui/                     # Reusable Button, Input, Textarea components
├── lib/
│   ├── jamai.ts                # Server-side JamAI Base client
│   ├── constants.ts            # Colours, column mappings, file limits
│   ├── validation.ts           # Form & file validation helpers
│   └── errors.ts               # Safe error message mapping
├── types/
│   └── card.ts                 # Shared TypeScript types
└── .env.local                  # Environment variables (not committed)
```

### Key Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Deployment

1. Push the repo to GitHub.
2. Connect the repo to [Vercel](https://vercel.com/).
3. Add the environment variables (`JAMAI_API_KEY`, `JAMAI_PROJECT_ID`, `JAMAI_TABLE_ID`, `JAMAI_TABLE_TYPE`, `JAMAI_BASE_URL`) in the Vercel project settings.
4. Deploy.
