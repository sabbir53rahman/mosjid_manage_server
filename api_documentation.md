# 🕌 Mosque Management System — Full API & System Guide

Base URL: `http://localhost:5000/api/v1`

> [!IMPORTANT]
> **First-time setup:** Update `.env` `DATABASE_URL` with your real PostgreSQL URL, then run `npx prisma migrate dev --name init` and `npm run dev` to start the server.

---

## 🗺️ System Overview

```mermaid
graph TD
    SA[SUPER_ADMIN] -->|creates| M[Mosque]
    SA -->|registers| MA[MOSQUE_ADMIN]
    MA -->|adds| MU[Musulli / Worshipers]
    MA -->|sets| PT[Prayer Times]
    MA -->|collects| FE[Monthly Fees]
    FE -->|auto-creates| MF[MonthlyFee Record]
    FE -->|auto-creates| TR[Transaction Record]
```

---

## 🔐 Step 1: Authentication

### 1.1 — Register an Admin
> **Used when:** A new Mosque Admin needs an account.

**`POST /auth/register`**
```json
{
  "name": "Abdur Rahman",
  "email": "rahman@mosque.com",
  "password": "securepass123",
  "mosqueId": "clx123abc..."
}
```

### 1.2 — Login
**`POST /auth/login`**
```json
{
  "email": "rahman@mosque.com",
  "password": "securepass123"
}
```

> [!TIP]
> All protected routes require `Authorization: Bearer <accessToken>` header OR an `accessToken` cookie (auto-set by server).

---

## 🕌 Step 2: Mosque Management

> [!NOTE]
> Only `SUPER_ADMIN` can create a mosque. The seed script auto-creates a Super Admin using `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from your `.env`.

### 2.1 — Create a Mosque *(SUPER_ADMIN only)*
**`POST /mosques`**
```json
{
  "name": "Baitul Mukarram",
  "slug": "baitul-mukarram",
  "address": "Paltan, Dhaka",
  "phone": "01711000000",
  "email": "info@baitul.com",
  "logo": "https://cdn.example.com/logo.png"
}
```
Save the returned `id` — you need it to register admins for this mosque.

### 2.2 — View My Mosque Details
**`GET /mosques/my-mosque`** *(auto-scoped to logged-in admin's mosque)*
```json
{
  "name": "Baitul Mukarram",
  "prayerTime": { "fajr": "5:00 AM", "zuhr": "1:00 PM" },
  "_count": { "musullis": 120, "admins": 3 }
}
```

### 2.3 — Set / Update Prayer Times
**`PUT /mosques/prayer-times`**
```json
{
  "fajr": "5:00 AM",
  "zuhr": "1:15 PM",
  "asr": "4:30 PM",
  "maghrib": "6:45 PM",
  "isha": "8:00 PM",
  "jummah": "1:00 PM"
}
```
> Creates prayer times if they don't exist, updates them if they do.

---

## 👥 Step 3: Musulli (Worshiper) Management

### 3.1 — Add a New Musulli
**`POST /musullis`**
```json
{
  "name": "Mohammad Ali",
  "phone": "01811000000",
  "monthlyFee": 200,
  "startMonth": 1,
  "startYear": 2025,
  "paidTillMonth": 3,
  "paidTillYear": 2025,
  "paymentDue": 0
}
```

### 3.2 — Get All Musullis
**`GET /musullis`** → Returns all musullis for your mosque with their `paymentDue` balance.

### 3.3 — Get Single Musulli (Full Details)
**`GET /musullis/:id`** → Returns full profile including:
- All `monthlyFees` (which months are paid, partial, or due)
- Last 10 `transactions` (who paid when and how much)

### 3.4 — Update a Musulli
**`PUT /musullis/:id`**
```json
{
  "name": "Updated Name",
  "phone": "01911000000",
  "isActive": false
}
```

---

## 💰 Step 4: Fee Collection — The Core Feature

**`POST /transactions/collect`**
```json
{
  "musulliId": "clu789xyz...",
  "month": 4,
  "year": 2026,
  "amount": 200,
  "paymentDate": "2026-04-15",
  "note": "Paid in full"
}
```

**What happens automatically:**
| Step | Action |
|------|--------|
| 1 | Finds or creates `MonthlyFee` for that `musulli + month + year` |
| 2 | Adds `amount` to `paidAmount` |
| 3 | Recalculates `dueAmount = expected - paid` |
| 4 | Creates a `Transaction` receipt (date, collector name, note) |
| 5 | Decrements overall `Musulli.paymentDue` |

**Partial payment example:**
```
1st payment: 100 BDT → paidAmount=100, dueAmount=100
2nd payment: 100 BDT → paidAmount=200, dueAmount=0 ✅ Fully Paid
```

### 4.2 — View All Transactions
**`GET /transactions`** → Returns all collections in your mosque (newest first), including musulli name and monthly fee details.

---

## 👤 Step 5: My Profile
**`GET /users/me`** → Returns logged-in admin's profile.

---

## 🔄 Complete Workflow

| Step | Who | Action | Endpoint |
|------|-----|--------|----------|
| 1 | Super Admin | Create mosque | `POST /mosques` |
| 2 | Super Admin | Register mosque admin | `POST /auth/register` |
| 3 | Mosque Admin | Login | `POST /auth/login` |
| 4 | Mosque Admin | Set prayer times | `PUT /mosques/prayer-times` |
| 5 | Mosque Admin | Add musullis | `POST /musullis` |
| 6 | Mosque Admin / Staff | Collect monthly fee | `POST /transactions/collect` |
| 7 | Mosque Admin | Check defaulters | `GET /musullis` → filter `paymentDue > 0` |
| 8 | Mosque Admin | View one musulli's history | `GET /musullis/:id` |
| 9 | Mosque Admin | View all today's collections | `GET /transactions` |

---

## ⚙️ Role Permissions

| Permission | SUPER_ADMIN | MOSQUE_ADMIN | STAFF |
|-----------|:-----------:|:------------:|:-----:|
| Create Mosque | ✅ | ❌ | ❌ |
| Register Admin | ✅ | ❌ | ❌ |
| View Mosque Info | ✅ | ✅ | ✅ |
| Set Prayer Times | ❌ | ✅ | ✅ |
| Add / Update Musulli | ❌ | ✅ | ✅ |
| Collect Fees | ❌ | ✅ | ✅ |
| View Transactions | ❌ | ✅ | ✅ |

---

## 🚀 How to Start the Server

```bash
# Step 1: Set your real PostgreSQL connection in .env
DATABASE_URL="postgresql://user:password@host:5432/mosque_db"

# Step 2: Create all database tables
npx prisma migrate dev --name init

# Step 3: Start the dev server
npm run dev

# ✅ Server is live at http://localhost:5000
```

> [!TIP]
> On first start, the seed script auto-creates a **Super Admin** using your `.env` credentials and assigns them to a **"Default Mosque"**. Use those credentials to log in as Super Admin and start creating real mosques.
