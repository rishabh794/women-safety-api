# Women Safety App - Backend API

This repository contains the backend service for the Women Safety App, a full-stack application designed to provide real-time safety features. This server is built with Node.js and Express, and it provides a secure RESTful API and a real-time WebSocket connection to the frontend client.

**Live API URL:** [https://women-safety-api.onrender.com/](https://women-safety-api.onrender.com/)

## Key Features

* **Secure User Authentication:** Implements a complete JWT (JSON Web Token) based authentication system with securely hashed passwords (`bcrypt`).
* **Real-time Location Broadcasting:** Utilizes a `socket.io` server to manage private rooms for each alert, relaying live GPS coordinates from the user to their guardians.
* **Guardian & Alert Management:** Provides full CRUD (Create, Read, Update, Delete) API endpoints for managing users, their trusted guardians, and emergency alert history.
* **Role-Based Access Control (RBAC):** Includes a secure admin role with dedicated endpoints for system-wide monitoring of users and alerts.
* **Third-Party Service Integration:** Connects to the Twilio API to send real-time SMS notifications to guardians when an alert is triggered.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (hosted on Neon)
* **ORM:** Drizzle ORM for type-safe, modern database querying.
* **Real-time Communication:** `socket.io` for managing live WebSocket connections.
* **Authentication:** `jsonwebtoken` for creating and verifying JWTs, `bcryptjs` for password hashing.
* **Validation:** Zod for robust, schema-based validation of environment variables and incoming API requests.
* **Deployment:** Hosted as a Web Service on Render.

## API Endpoints

A brief overview of the main API endpoints. All routes are prefixed with `/api`.

* `POST /user/create`: Register a new user.
* `POST /user/login`: Log in and receive a JWT.
* `GET /user/me`: (Protected) Get the logged-in user's profile.
* `GET /guardians`: (Protected) Get the logged-in user's list of guardians.
* `POST /alerts`: (Protected) Create a new emergency alert.
* ...and more for CRUD operations on users, guardians, and alerts.

## Setup & Installation

To run this project locally:

1.  Clone the repository:
    `git clone https://github.com/rishabh794/women-safety-api.git`
2.  Install dependencies:
    `pnpm install`
3.  Create a `.env` file and provide the necessary environment variables (see `.env.example`).
4.  Generate the database migrations:
    `pnpm run generate`
5.  Run the database migrations:
    `pnpm run migrate`
6.  Start the development server:
    `pnpm run dev`
