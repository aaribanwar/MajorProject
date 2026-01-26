
# Property Marketplace Web Application

A server-rendered property marketplace application focused on **correctness, security, and backend discipline** rather than premature scale optimization.

Live deployments:

* **Render**: [https://majorproject-o4m8.onrender.com](https://majorproject-o4m8.onrender.com)
* **Self-hosted**: [http://propertymarketplace.duckdns.org/listings](http://propertymarketplace.duckdns.org/listings)

Source code:

* [https://github.com/aaribanwar/PropertyMarketplace](https://github.com/aaribanwar/PropertyMarketplace)

---

## Overview

This project implements a full-stack property listing platform where users can:

* Register and authenticate
* Create, edit, and delete property listings
* Leave reviews on listings
* View listings on an interactive map

The core design goal is **defensive backend engineering**: the system assumes the client is untrusted and enforces authorization, validation, and data integrity at multiple layers.

---

## Key Design Decisions (Explicitly Intentional)

### 1. Server-Side Rendering (SSR)

* Uses **EJS templates** rendered on the server
* Avoids SPA complexity for a CRUD-heavy, auth-sensitive application
* Simplifies authentication, authorization, and SEO

**Trade-off:** Less client-side interactivity than a React/Vue SPA
**Rationale:** Correctness and security prioritized over UI dynamism

---

### 2. Authentication & Authorization

* **Session-based authentication**
* **Ownership-based authorization** enforced via middleware
* UI checks are treated as **advisory only**, never authoritative

Protected resources:

* Listings
* Reviews

Authorization rules:

* Only the creator of a listing can modify or delete it
* Only the creator of a review can delete it
* All mutation routes enforce ownership checks server-side

---

### 3. Multi-Layer Validation Strategy

The application deliberately validates data at **three independent layers**:

1. **Client-side constraints**
   Improves UX only — never trusted
2. **Joi validation schemas**
   Blocks malformed or malicious input at the request boundary
3. **Mongoose schema validation**
   Final safeguard before persistence

This redundancy is intentional to prevent:

* Schema poisoning
* Partial validation bypasses
* Inconsistent database state

---

### 4. Secure Geolocation & Maps

* Maps rendered using **Mapbox GL**
* **Client-supplied latitude/longitude is never trusted**
* Coordinates are derived **only via server-side geocoding**
* Invalid or ambiguous locations trigger controlled fallback flows

This prevents:

* Coordinate spoofing
* Broken map state
* Mismatch between address and geolocation data

---

### 5. Error Handling & Failure Modes

* Centralized error handling middleware
* SSR routes redirect gracefully on expected failures
* External service failures (e.g., geocoding) do not corrupt state
* Server crashes avoided by design, not try/catch sprawl

---

## Technology Stack

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Frontend**

* EJS (Server-Side Rendering)
* Bootstrap (styling)

**Authentication**

* Express Sessions
* Passport.js

**Validation**

* Joi
* Mongoose schemas

**Maps & Geolocation**

* Mapbox GL
* OpenStreetMap tiles

**Deployment**

* Render (managed hosting)
* Self-hosted deployment via DuckDNS

---

## Project Structure (High-Level)

```
PropertyMarketplace/
│
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── controllers/     # Route logic and business rules
├── middleware/      # Auth, authorization, validation
├── views/           # EJS templates
├── public/          # Static assets
├── utils/           # Helper utilities (geocoding, errors)
└── app.js           # Application entry point
```

---



## Running Locally

```bash
git clone https://github.com/aaribanwar/PropertyMarketplace
cd PropertyMarketplace
npm install
```

Set environment variables:

```
MONGO_URI=
MAPBOX_TOKEN=
SESSION_SECRET=
```

Start the server:

```bash
npm start
```

---

