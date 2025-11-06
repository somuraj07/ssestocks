# SSE Stocks Management System

A web application designed for managing and monitoring stocks. Users can view available stock items, while administrators have full control to add, update, and track inventory. The system includes **role-based authentication** using **JWT** and supports uploading stock data through **Excel files**.

---

## Core Features

- **User Access:** View available stocks and search for items.
- **Admin Access:** Add, edit, delete stocks and manage the entire system.
- **Role-Based Authentication:** JWT ensures secure access levels for users and admins.
- **Excel Upload for Inventory:** Quickly add or update stock records in bulk.
- **Clean UI:** Built using Next.js, React, and Tailwind CSS.

---

## User Roles

| Role | Permissions |
|------|-------------|
| **User** | View stock list & stock status |
| **Admin** | Full control: Add, edit, delete, upload Excel & manage users |

---

## Tech Overview

- **Frontend:** Next.js + React + Tailwind CSS
- **Authentication:** NextAuth with JWT
- **Admin Tools:** Excel import support for adding/updating stock

---

## Stock Upload (Excel Format)

The Excel file should contain columns like:

```
Item Name | Category | Quantity | Price | Description
```

---

## Workflow Summary

1. User logs in.
2. Authentication determines if the user is **admin** or **stock viewer**.
3. Admin can upload Excel sheets or manually add inventory.
4. Users can browse, search, and check stock availability.

---

## Purpose

This system provides a simple, scalable solution for managing stocks in an organization, store, or warehouse with straightforward UI and secure access control.

---

## License

Open and free to use for educational and development purposes.
