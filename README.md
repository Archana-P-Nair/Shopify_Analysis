# Xeno FDE Internship Assignment

## Overview
This is a multi-tenant Shopify Data Ingestion & Insights Service built with React (Frontend) and Node.js (Backend). It simulates data ingestion from Shopify and provides a dashboard to visualize the data.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Archana-P-Nair/Shopify_Analysis
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

