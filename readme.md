
# CS Department Complaint Hub

A sophisticated, fully-responsive, and feature-rich web application designed to streamline the complaint submission and resolution process for a university's Computer Science department. This project provides a transparent and efficient communication channel between students and administrators through dedicated, role-based dashboards.

This is a comprehensive frontend-only demonstration built with **React** and **TypeScript**. It simulates a full-stack experience by using mock data and leveraging the browser's `localStorage` to ensure data persistence across sessions.

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
- [Login Credentials](#login-credentials)
- [Programmer Information](#programmer-information)

---

## About The Project

In any academic institution, timely and effective communication is key to student satisfaction and operational excellence. The **CS Department Complaint Hub** addresses the common challenge of managing student grievances, which can often be lost in emails, paperwork, or informal channels.

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
-   **AI-Powered Assistant:** An integrated Gemini AI assistant helps students draft clear, formal, and comprehensive complaint descriptions from simple keywords.
-   **File Attachments:** Option to upload supporting documents, screenshots, or other files (up to 5MB) with a drag-and-drop interface.
-   **Live Voice Support:** A real-time voice chat feature powered by the Gemini Live API allows students to speak directly with an AI support agent for immediate assistance.
-   **Real-time Tracking:** A clean dashboard lists all submitted complaints, with color-coded statuses for easy tracking (`Submitted`, `In Progress`, `Resolved`, `Closed`).
-   **Detailed History View:** Students can expand each complaint to view its full history, including status changes, timestamps, and any notes added by the administrator.
-   **Profile Management:** Students can view and edit their personal information and upload a custom profile picture.
-   **Search Functionality:** Quickly find past complaints by searching for keywords, ID, category, or status.

### For Administrators

-   **Comprehensive Dashboard:** A central hub to view all student complaints, with clear indicators for unread submissions and overdue tasks.
-   **KPI Analytics:** An "At a Glance" section displays key performance indicators: Total Open Complaints, New Submissions, Overdue Complaints, and Average Resolution Time.
--  **Advanced Filtering & Sorting:** Complaints can be filtered by status (e.g., `In Progress`) and category (`Academic`, `Facilities`, etc.) and sorted by date or status.
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

-   **Framework/Library:** [**React 19**](https://react.dev/) with [**TypeScript**](https://www.typescriptlang.org/) for building a scalable, type-safe, and component-based user interface.
-   **AI Integration:** [**Google Gemini API (@google/genai)**](https://ai.google.dev/docs) for the AI Complaint Assistant and the real-time Live Voice Chat support.
-   **Styling:** [**Tailwind CSS**](https://tailwindcss.com/) for a modern, utility-first CSS workflow that enables rapid and responsive UI development.
-   **State Management:** **React Context API** is used to manage global application state (Authentication, Complaints, Notifications) in a clean and efficient manner, avoiding the need for external state management libraries.
-   **Data Persistence:** Browser **`localStorage` API** acts as a lightweight client-side database, providing a persistent user experience across browser sessions.
-   **Icons:** A custom-built icon library using SVG components for a consistent and clean UI.
-   **Environment:** Zero-config setup. The application runs directly in the browser using ES Modules and `importmap`, requiring no build step.

---

## Project Structure

The project is organized into a modular and maintainable structure:

```
/
├── components/           # Reusable React components that form the UI
│   ├── AdminDashboard.tsx      # Main view for administrators
│   ├── AIComplaintAssistant.tsx# Modal for AI-powered text generation
│   ├── ComplaintCard.tsx       # Component to display a single complaint summary
│   ├── ComplaintDetailModal.tsx # Modal for viewing and managing complaint details
│   ├── ComplaintFormModal.tsx  # Modal for submitting a new complaint
│   ├── Footer.tsx              # Application footer
│   ├── Header.tsx              # Application header with user info
│   ├── icons.tsx               # SVG icons used throughout the app
│   ├── LandingPage.tsx         # Login page for students and admins
│   ├── LiveChatModal.tsx       # Modal for real-time voice chat with AI
│   ├── Notification.tsx        # Toast notification component
│   ├── ProfileView.tsx         # User profile display and edit component
│   ├── ReportsView.tsx         # View for generating and exporting reports
│   ├── StatCard.tsx            # Reusable card for displaying KPIs
│   └── StudentDashboard.tsx    # Main view for students
├── contexts/             # React Context providers for global state management
│   ├── AuthContext.tsx         # Manages user authentication state
│   ├── ComplaintContext.tsx    # Manages the list of complaints
│   └── NotificationContext.tsx # Manages system-wide notifications
├── utils/                # Utility functions, helpers, and mock data
│   ├── audioUtils.ts         # Helper functions for encoding/decoding audio
│   ├── mockData.ts           # Initial set of mock complaints
│   └── userData.ts           # Mock student and admin user data
├── App.tsx               # Main application component, handles routing
├── index.html            # The main HTML entry point for the application
├── index.tsx             # React application root/entry point
├── metadata.json         # Application metadata
├── package.json          # Project metadata and dependencies
├── readme.md             # This file
└── types.ts              # Shared TypeScript types and enums
```

---

## Getting Started

This is a static, frontend-only application that runs entirely in the browser.

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    ```
2.  **Open the HTML File**
    -   Navigate to the project directory.
    -   Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, or Edge).

Alternatively, you can use a simple local server for a more robust experience:

1.  **Install `serve` (if you don't have it):**
    ```bash
    npm install -g serve
    ```
2.  **Run the Server:**
    -   From the project's root directory, run:
    ```bash
    serve .
    ```
    -   Open your browser and go to the local URL provided (usually `http://localhost:3000`).

---

## Login Credentials

Use the following credentials to access the different dashboards:

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
