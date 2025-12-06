# Xeno FDE Internship Assignment

## Overview
This is a multi-tenant Shopify Data Ingestion & Insights Service built with React (Frontend) and Node.js (Backend). It simulates data ingestion from Shopify and provides a dashboard to visualize the data.

## Features
- **Multi-tenancy**: Data is isolated by tenant ID (simulated via `x-shop-domain` header).
- **Data Ingestion**: APIs to ingest Products, Orders, and Customers.
- **Insights Dashboard**: Visualizes key metrics and order trends.
- **Tech Stack**: React, TailwindCSS, Recharts, Node.js, Express, Prisma, SQLite (Dev).

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd xeno-fde-assignment
    ```

2.  **Install Dependencies**
    ```bash
    # Install Server Dependencies
    cd server
    npm install
    
    # Install Client Dependencies
    cd ../client
    npm install
    ```

3.  **Database Setup**
    ```bash
    cd server
    npx prisma migrate dev --name init
    node seed.js # Populate with dummy data
    ```

4.  **Run Locally**
    - **Backend**:
      ```bash
      cd server
      npm start
      # Runs on http://localhost:3000
      ```
    - **Frontend**:
      ```bash
      cd client
      npm run dev
      # Runs on http://localhost:5173
      ```

## API Endpoints
- `POST /api/ingest`: Ingest data (body: `{ type: 'orders', data: [...] }`)
- `GET /api/dashboard/stats`: Get aggregated stats.
- `GET /api/dashboard/orders-trend`: Get order trend data.

## Deployment (Vercel)
The project is configured for Vercel deployment using `vercel.json`.
**Note**: The SQLite database is ephemeral on Vercel. For production, configure a remote database (e.g., Vercel Postgres, PlanetScale) and update `DATABASE_URL` in Vercel environment variables.

## Architecture
- **Frontend**: Single Page Application (SPA) using React.
- **Backend**: REST API using Express.js.
- **Database**: Relational database (SQLite/MySQL) managed by Prisma ORM.
