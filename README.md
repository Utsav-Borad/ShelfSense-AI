# ShelfSense AI

An AI-powered inventory decision-support platform for small retail shops.
Shop owners upload the CSV reports their billing software already exports, and
the platform tells them what to reorder, what to discount, and where capital is
stuck — rather than just showing them what happened.

- **Backend** — Django + Django REST Framework, JWT auth, scikit-learn
- **Frontend** — React + Vite

---

## Setting up on a new machine

Clone the repository, then follow both halves. You need **Python 3.11+** and
**Node 18+** installed.

> `node_modules/`, `db.sqlite3` and `.env` are deliberately not in the
> repository. The first is rebuilt by `npm install`, the second by `migrate`,
> and the third is copied from the `.env.example` next to it. This is normal —
> every one of them is machine-specific.

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

`.env` is optional: every setting has a working development default. Copy
`backend/.env.example` to `backend/.env` only if you want to change the
frontend URL, the allowed CORS origins, or send real email over SMTP.

### 2. Load the sample data

The database starts empty. The importers link everything to the business whose
owner has **id 1**, so that account has to exist first:

```bash
python manage.py shell -c "from authentication.models import User; u,_=User.objects.get_or_create(id=1, defaults={'email':'owner@shelfsense.ai','full_name':'Shop Owner'}); u.set_password('ChangeMe123'); u.save()"
```

Then import the CSVs **in this order** — each one depends on the one before it:

```bash
python manage.py import_business
python manage.py import_categories
python manage.py import_suppliers
python manage.py import_products
python manage.py import_inventory
python manage.py import_sales
```

Every importer matches rows on `id` and updates in place, so re-running them is
safe and never deletes anything. Each also accepts `--file path/to/file.csv` if
you want to load your own export instead of the generated dataset.

### 3. Run the backend

```bash
python manage.py runserver 8000
```

### 4. Frontend

In a second terminal:

```bash
cd frontend
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
npm install
npm run dev
```

Open the URL Vite prints (usually <http://localhost:5173>) and sign in with
`owner@shelfsense.ai` and the password you set above.

---

## Troubleshooting

**"We could not reach the server."**
`frontend/.env` is missing, so the app does not know where the API is. Copy
`.env.example` to `.env` and restart `npm run dev` — Vite only reads `.env` at
startup.

**Login says "Invalid email or password."**
The account does not exist in *your* database. Each machine has its own
`db.sqlite3`. Register a new account, or create the seed user in step 2.

**The dashboard is all zeros.**
You are signed in as an account whose business has no imported data. Every
figure is scoped to the signed-in owner's business. Sign in as the seed owner,
or run the imports in step 2.

**`ModuleNotFoundError: No module named 'dotenv'`**
`pip install -r requirements.txt` has not been run in the environment you are
using.

---

## Project layout

```
backend/
  authentication/  business/  categories/  suppliers/
  products/  inventory/  sales/            core data + CRUD APIs
  analytics/                               AI pipeline and analytics endpoints
    ml/                                    forecasting engine, trained model
    services/                              repository, preprocessing, adapter
    recommendation/  notification/         advisory engines
  reports/  notifications/  uploads/       API layer over the analytics engines
  config/                                  settings and root URLs

frontend/src/
  pages/         one folder per module
  components/    per-module components, each with a fromApi.js mapper
  services/      axios client and one service per backend area
  context/       auth, theme, sidebar
```

Each module's `fromApi.js` is where API responses are translated into the shape
its components render — start there when tracing where a number comes from.

## API

All endpoints are under `/api/v1/` and return `{ status, message, data }`.
Authentication is JWT: send `Authorization: Bearer <access token>`. Access
tokens last 30 minutes and are refreshed automatically by the frontend through
`POST /api/v1/auth/token/refresh/`.

See `documentation/05_API_Design.md` for the full endpoint list.
