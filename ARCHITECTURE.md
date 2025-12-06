# Architecture

## High-Level Diagram

```mermaid
graph TD
    User[User] -->|Access Dashboard| Client[React Client]
    Client -->|API Requests| Server[Node.js Express Server]
    
    subgraph "Backend Layer"
        Server -->|Auth/Tenant Check| Middleware
        Middleware -->|Read/Write| DB[(Database)]
        Server -->|Ingest Data| DB
    end
    
    subgraph "External Systems"
        Shopify[Shopify Store] -->|Webhooks (Simulated)| Server
    end
```

## Data Flow
1.  **Ingestion**: Shopify sends data (Products, Orders) to `/api/ingest`.
2.  **Processing**: Server identifies the tenant based on the request (Header/Token).
3.  **Storage**: Data is upserted into the Database using Prisma.
4.  **Visualization**: Client requests stats from `/api/dashboard/*`. Server aggregates data from DB and returns JSON.

## Multi-Tenancy Strategy
- **Database Level**: All tables (`Product`, `Order`, `Customer`) have a `tenantId` column.
- **Application Level**: Middleware extracts `tenantId` from the request and attaches it to the context. All DB queries are filtered by `tenantId`.
