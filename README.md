# saloneBaskit

An e-commerce platform for Salone Baskit, built with a Node.js backend and a modern frontend.

## Overview

This repository contains the source code for the saloneBaskit application, organized as a monorepo.

-   `/frontend`: Contains the web client (e.g., React, Vue, Angular).
-   `/backend`: Contains the server-side logic and API (e.g., Node.js, Python, Go).

## Prerequisites

-   Node.js (v20.x or later)
-   A running PostgreSQL instance for local development.

## Getting Started

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/mohamedkonneh/salone_baskit.git
    cd saloneBaskit
    ```
2.  **Install dependencies:**
    Run `npm install` from the root directory. This will install dependencies for both the frontend and backend workspaces.
    ```sh
    npm install
    ```
3.  **Configure environment variables:**
    Copy the example environment files in both the `backend` and `frontend` directories to new `.env` files and fill in your local secrets.
    ```sh
    # For the backend
    cp backend/.env.example backend/.env

    # For the frontend (if you need to override the default localhost URL)
    cp frontend/.env.example frontend/.env
    ```
4.  **Run the application:**
    Run the `dev` script from the root directory to start both the frontend and backend servers concurrently.
    ```sh
    npm run dev
    ```