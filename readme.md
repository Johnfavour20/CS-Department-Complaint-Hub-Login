# STUDENT'S COMPLAINTS MANAGEMENT SYSTEM

A sophisticated, fully-responsive, and feature-rich full-stack web application designed to streamline the complaint submission and resolution process for a university's Computer Science department. This project provides a transparent and efficient communication channel between students and administrators through dedicated, role-based dashboards.

The frontend is a comprehensive demonstration built with **React** and **TypeScript**, simulating a full-stack experience by using mock data and leveraging the browser's `localStorage` for data persistence. The backend architecture is designed with **Node.js**, **Express**, and **Prisma** to provide a robust and scalable foundation for future development.

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
  - [For Students](#for-students)
  - [For Administrators](#for-administrators)
  - [General Features](#general-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup (Conceptual)](#backend-setup-conceptual)
- [Login Credentials](#login-credentials)
- [Programmer Information](#programmer-information)

---

## About The Project

In any academic institution, timely and effective communication is key to student satisfaction and operational excellence. The **STUDENT'S COMPLAINTS MANAGEMENT SYSTEM** addresses the common challenge of managing student grievances, which can often be lost in emails, paperwork, or informal channels.

This application provides a centralized, digital platform where students can formally submit complaints regarding academics, facilities, administration, and more. Each submission is tracked with a unique ID, and its lifecycle is visible to both the student and the administration, ensuring transparency and accountability.

The goal is to create a more responsive academic environment by:
-   **Empowering Students:** Giving them a clear and simple tool to voice their concerns.
-   **Equipping Administrators:** Providing powerful tools to manage, prioritize, and resolve issues efficiently.
-   **Improving Transparency:** Allowing both parties to track the status of a complaint from submission to resolution.
-   **Leveraging Data:** Offering analytics to help the department identify recurring issues and improve services.

---

## Key Features

### For Students

-   **Intuitive Complaint Submission:** A user-friendly modal form to submit complaints, complete with category selection and a detailed description field.
-   **File Attachments:** Option to upload supporting documents, screenshots, or other files (up to 5MB) with a drag-and-drop interface.
-   **Real-time Tracking:** A clean dashboard lists all submitted complaints, with color-coded statuses for easy tracking (`Submitted`, `In Progress`, `Resolved`, `Closed`).
-   **Detailed History View:** Students can expand each complaint to view its full history, including status changes, timestamps, and any notes added by the administrator.
-   **Profile Management:** Students can view and edit their personal information and upload a custom profile picture.
-   **Search Functionality:** Quickly find past complaints by searching for keywords, ID, category, or status.

### For Administrators

-   **Comprehensive Dashboard:** A central hub to view all student complaints, with clear indicators for unread submissions and overdue tasks.
-   **KPI Analytics:** An "At a Glance" section displays key performance indicators: Total Open Complaints, New Submissions, Overdue Complaints, and Average Resolution Time.
-   **Advanced Filtering & Sorting:** Complaints can be filtered by status (e.g., `In Progress`) and category (`Academic`, `Facilities`, etc.) and sorted by date or status.
-   **Powerful Search:** Search across all complaints by student name, ID, or keywords in the description.
-   **Detailed Management Modal:** A dedicated modal for each complaint shows full student details, complaint history, and attached files.
-   **Status & Due Date Management:** Easily update a complaint's status and set a due date to prioritize and track resolution timelines.
-   **Internal Notes:** Add private, admin-only notes to a complaint for internal record-keeping and collaboration.
-   **Reporting & Analytics:** A dedicated reports view to generate, preview, and export complaint data based on custom date ranges and filters.
-   **Data Export:** Export generated reports to **CSV** for offline analysis or record-keeping, and a **Print** view for hard copies.

### General Features

-   **Responsive Design:** The UI is fully responsive and optimized for a seamless experience on desktops, tablets, and mobile devices.
-   **Role-Based Access Control:** Separate login portals and dashboards for Students and Administrators.
-   **State Persistence:** All user data, complaints, and updates are saved to the browser's `localStorage`, ensuring no data is lost between sessions.
-   **Toast Notifications:** Non-intrusive notifications provide immediate feedback for actions like submitting a complaint or updating a profile.

---

## Technology Stack

### Frontend
-   **Framework/Library:** [**React 19**](https://react.dev/) with [**TypeScript**](https://www.typescriptlang.org/) for building a scalable, type-safe, and component-based user interface.
-   **Styling:** [**Tailwind CSS**](https://tailwindcss.com/) for a modern, utility-first CSS workflow that enables rapid and responsive UI development.
-   **State Management:** **React Context API** is used to manage global application state (Authentication, Complaints, Notifications).
-   **Data Persistence:** Browser **`localStorage` API** acts as a lightweight client-side database for the frontend-only demo.
-   **Icons:** A custom-built icon library using SVG components.
-   **Environment:** Zero-config setup. The application runs directly in the browser using ES Modules and `importmap`, requiring no build step.

### Backend (Conceptual)
-   **Runtime:** [**Node.js**](https://nodejs.org/) - A JavaScript runtime for building fast and scalable server-side applications.
-   **Framework:** [**Express.js**](https://expressjs.com/) - A minimal and flexible Node.js web application framework.
-   **Language:** [**TypeScript**](https://www.typescriptlang.org/) - For type safety and improved developer experience on the server.
-   **Database:** [**PostgreSQL**](https://www.postgresql.org/) - A powerful, open-source object-relational database system.
-   **ORM:** [**Prisma**](https://www.prisma.io/) - A next-generation ORM for Node.js and TypeScript that simplifies database access.
-   **Authentication:** JWT (JSON Web Tokens) for securing API endpoints.

---

## Project Structure

The project is structured as a monorepo with a clear separation between the `client` and `server` directories.

```
/
├── client/                 # Contains the entire React frontend application
│   ├── components/         # Reusable React components
│   │   ├── AdminDashboard.tsx
│   │   ├── ComplaintCard.tsx
│   │   └── ...
│   ├── contexts/           # React Context providers for global state
│   │   ├── AuthContext.tsx
│   │   └── ...
│   ├── utils/              # Utility functions and mock data
│   │   ├── mockData.ts
│   │   └── ...
│   ├── App.tsx             # Main application component
│   ├── index.html          # HTML entry point for the client
│   ├── index.tsx           # React application root
│   ├── package.json
│   └── tsconfig.json
│
├── server/                 # Contains the conceptual Node.js backend
│   ├── prisma/             # Prisma schema and migration files
│   │   └── schema.prisma
│   ├── src/                # Backend source code
│   │   ├── api/            # API routes (e.g., v1)
│   │   ├── config/         # Environment variables, db config
│   │   ├── controllers/    # Request handling logic
│   │   ├── middleware/     # Custom middleware (auth, error handling)
│   │   ├── models/         # (Alternative to Prisma) or data structures
│   │   ├── services/       # Business logic layer
│   │   └── server.ts       # Express server entry point
│   ├── .env.example        # Example environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── readme.md               # This file
```

---

## Getting Started

### Frontend Setup

The frontend is a static application that runs entirely in the browser.

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the Client Directory**
    ```bash
    cd client
    ```
3.  **Open the HTML File**
    -   Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, or Edge).

Alternatively, you can use a simple local server:

1.  **Install `serve` (if you don't have it):**
    ```bash
    npm install -g serve
    ```
2.  **Run the Server:**
    -   From the `client` directory, run:
    ```bash
    serve .
    ```
    -   Open your browser and go to the local URL provided (usually `http://localhost:3000`).

### Backend Setup (Conceptual)

The following steps outline how to run the backend if it were implemented according to the project structure.

1.  **Navigate to the Server Directory**
    ```bash
    cd server
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Set Up Environment Variables**
    -   Create a `.env` file by copying `.env.example`.
    -   Fill in the required variables, such as `DATABASE_URL` and `JWT_SECRET`.
4.  **Run Database Migrations**
    -   This command will set up the database schema based on `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```
5.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    -   The backend API would then be available at `http://localhost:5000` (or the configured port).

---

## Login Credentials

Use the following credentials to access the different dashboards on the frontend demo:

#### **Student Login**

Use any of the pre-configured student IDs, or any ID matching the format `U<year>/<7-digits>`.

-   **Examples:**
    -   `U2021/5570009` (Ada Okoro)
    -   `U2020/5512345` (Bolanle Adeyemi)
    -   `U2022/5598765` (Chukwudi Eze)

#### **Administrator Login**

-   **Username:** `admin`
-   **Password:** `password`

---

## Programmer Information

-   **Name:** Igboeche Johnfavour Ikenna
-   **Email:** igboechejohn@gmail.com
-   **Phone:** 08169849839