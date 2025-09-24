# CS Department Complaint Hub

An efficient, fully-responsive web-based system for Computer Science students to submit, track, and resolve their complaints. This application fosters better communication and a more responsive academic environment through dedicated interfaces for both students and administrators.

This project is a comprehensive frontend demonstration built with React and TypeScript, using mock data and browser `localStorage` to simulate a full-stack experience with data persistence.

---

## Programmer Information

- **Name:** Igboeche Johnfavour Ikenna
- **Email:** igboechejohn@gmail.com
- **Phone:** 08169849839

---

## Key Features

-   **Responsive Design:** Seamless experience across desktops, tablets, and mobile devices.
-   **Dual User Roles:** Separate, feature-rich dashboards for **Students** and **Administrators**.
-   **Student Dashboard:**
    -   Submit new complaints with an intuitive form.
    -   Attach supporting documents or images.
    -   View a comprehensive history of all submitted complaints.
    -   Track the real-time status of each complaint.
    -   View detailed timelines and administrator notes.
    -   Manage personal profile information, including profile picture.
-   **Administrator Dashboard:**
    -   View and manage all student complaints.
    -   Advanced filtering and sorting capabilities (by status, category, date).
    -   Search functionality to quickly find specific complaints or students.
    -   Update complaint status and set due dates.
    -   Add private, internal notes for administrative tracking.
    -   View detailed complaint history and student information.
-   **Analytics Dashboard:**
    -   Visual data representation with charts (Bar and Pie charts).
    -   Insights into complaint volume by category and status.
    -   Key performance indicators (KPIs) at a glance.
-   **State Persistence:** Utilizes browser `localStorage` to save all complaints and user data, ensuring data is not lost on page refresh.
-   **User-Friendly Notifications:** Interactive toast notifications to provide feedback on user actions.

---

## Technology Stack

-   **Framework/Library:** [**React 19**](https://react.dev/) with [**TypeScript**](https://www.typescriptlang.org/) for robust, type-safe components.
-   **Styling:** [**Tailwind CSS**](https://tailwindcss.com/) for a modern, utility-first CSS workflow and responsive design.
-   **State Management:** **React Context API** for managing global state (Authentication, Complaints, Notifications) in a clean and efficient manner.
-   **Data Visualization:** [**Recharts**](https://recharts.org/) for creating beautiful and interactive charts on the analytics dashboard.
-   **Data Persistence:** Browser **`localStorage` API** to simulate a database, providing a persistent experience across browser sessions.
-   **Icons:** Heroicons library for a consistent and clean UI.
-   **Environment:** No build step required. The application runs directly in the browser using modern features like ES Modules and `importmap`.

---

## Getting Started

This is a static, frontend-only application. You can run it in two simple ways:

### Method 1: Direct File Access (Simple)

1.  Clone or download this repository.
2.  Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, or Edge).

### Method 2: Using a Local Server (Recommended)

Running a local server prevents potential issues with browser security policies (like CORS) if you were to add more complex features.

1.  **Ensure you have Node.js installed.**
2.  Open your terminal in the project's root directory.
3.  Install a simple server package globally:
    ```bash
    npm install -g serve
    ```
4.  Start the server:
    ```bash
    serve .
    ```
5.  Open your browser and navigate to the URL provided by the server (usually `http://localhost:3000`).

---

## Login Credentials

You can log in using one of the following roles:

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

## Project Structure

The project is organized into a modular and maintainable structure:

```
/
├── components/           # Reusable React components that form the UI
│   ├── AdminDashboard.tsx      # Main view for administrators
│   ├── ComplaintCard.tsx       # Component to display a single complaint summary
│   ├── ComplaintDetailModal.tsx # Modal for viewing and managing complaint details
│   ├── ComplaintFormModal.tsx  # Modal for submitting a new complaint
│   ├── Footer.tsx              # Application footer
│   ├── Header.tsx              # Application header with user info
│   ├── icons.tsx               # SVG icons used throughout the app
│   ├── LandingPage.tsx         # Login page for students and admins
│   ├── Notification.tsx        # Toast notification component
│   ├── ProfileView.tsx         # User profile display and edit component
│   └── StudentDashboard.tsx    # Main view for students
├── contexts/             # React Context providers for global state management
│   ├── AuthContext.tsx         # Manages user authentication state
│   ├── ComplaintContext.tsx    # Manages the list of complaints
│   └── NotificationContext.tsx # Manages system-wide notifications
├── utils/                # Utility functions and mock data
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

## Author

This project was developed by **Igboeche Johnfavour Ikenna**.