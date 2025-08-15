# Hindalco C-PSMS MVP: System Design & Architecture

This document provides a comprehensive overview of the Hindalco Centralized Permit & Safety Management System (C-PSMS) MVP. It details the system architecture, technology stack, and functionality of its core components.

## 1. Core Features

The C-PSMS MVP is a digital permit-to-work system designed to enhance safety and efficiency at an industrial plant. Its primary features include:

-   **Dual Authentication System**: Separate, secure login flows for both employees and visitors. Employees use their official code and date of birth, while visitors use a pre-issued ID, ensuring that access is segregated and appropriate for each user type.
-   **Role-Based Access Control (RBAC)**: The user interface and available actions adapt based on the employee's department (e.g., Security, Safety), providing relevant tools and information. For instance, the Security department can request visitor passes, while the Safety department gets a prioritized view of high-risk permits needing review.
-   **Digital Permit Creation**: A streamlined form for creating work permits. This form captures essential details like work description and required Personal Protective Equipment (PPE).
-   **Risk Assessment**: Automated risk analysis of permit descriptions to assess the risk level (Low, Medium, High). This provides an instant, consistent, and unbiased initial safety assessment, flagging potentially dangerous tasks for human review.
-   **Interactive Plant Map**: A live map (using Leaflet) that visualizes the real-time locations of active work permits and visitors. Permits are displayed as color-coded pins based on risk level, and visitors are shown as glowing dots, providing immediate situational awareness for all personnel.
-   **QR Code Generation**: Secure QR codes are generated for approved permits and visitor passes for quick validation. This eliminates paperwork and allows security personnel to instantly verify the status and details of any permit or visitor on-site.
-   **Visitor Pass Management**: A dedicated workflow for the Security department to request and manage visitor passes. The system captures visitor details and the purpose of their visit, which can then be routed for approval.

## 2. System Architecture

The application is built as a modern, monolithic web application using the Next.js App Router. This architecture integrates the frontend and backend into a single, cohesive codebase, simplifying development and deployment for the MVP.

```
+----------------+
| User (Browser) |
+----------------+
       |
       v (HTTPS)
+-----------------------------------------------------------+
|             Next.js Application (on Node.js)              |
|-----------------------------------------------------------|
|                                                           |
| [ Frontend: React Components, UI/UX (ShadCN, Tailwind) ]  |
|         (Client-side Interactivity, Rendering)            |
|                                                           |
|                      ^          |                         |
| (Rendered HTML/CSS)  |          v (Calls Server Actions)  |
|                      |                                    |
| [ Backend: Server Logic & Data Fetching (`'use server'`) ]|
|   (Handles mutations, business logic, auth checks)        |
|         |                  |                   |          |
+---------|------------------|-------------------|----------+
          | (Server-side)    | (Server-side)     | (Server-side)
          v                  v                   v
+-----------------+  +-----------------+ +-------------------+
| Backend API     |  | Mock Database   | | External Services |
| (Risk Analysis) |  | (`/lib/*.ts`)   | |-------------------|
+-----------------+  +-----------------+ | - Leaflet Tiles   |
          |                              | - QR Server API   |
          v (Processing)                 +-------------------+
+-----------------+
| Risk Assessment |
| Logic           |
+-----------------+
```

-   **Frontend**: Built with **React** and **Next.js**, utilizing the App Router for routing and layout management. The UI is composed of **Server Components** by default for improved performance (as they render on the server and send minimal JavaScript to the client) and **Client Components** (`'use client'`) for pages or components requiring interactivity (e.g., forms, maps).
-   **Backend**: The backend is powered by **Node.js** and is fully integrated within Next.js. We use **Server Actions** to handle all data mutations (e.g., creating permits, requesting visitor passes) securely on the server without needing to write separate API endpoints. This code lives in files marked with `'use server';`.
-   **Risk Assessment**: Risk assessment capabilities are handled by backend logic. The risk assessment function analyzes permit data and returns a structured risk assessment based on predefined rules and criteria. This logic runs server-side, ensuring security and performance.
-   **Styling**: A combination of **Tailwind CSS** for utility-first styling and **ShadCN UI** for a pre-built, accessible, and themeable component library. The theme is customized to match Hindalco's branding guidelines.
-   **State Management**: Global user authentication and session state are managed using **React Context API** (`UserProvider`). This context wraps the application and provides user data to all components through a React Context. For complex form state, we use **React Hook Form** with **Zod** for robust schema validation.
-   **Database (Mocked)**: In this MVP, the database is simulated using mock data arrays stored in the `src/lib/` directory. These files export `async` functions that mimic database queries, making it easy to swap them out for a real database connection in the future.

### MVP vs. Production Architecture

It is important to note the distinction between the current prototype architecture and the proposed architecture for a full-scale production deployment.

-   **Current MVP Architecture**: The application uses a **monolithic Next.js structure**. The backend logic (Server Actions) is tightly coupled with the frontend framework. This is highly efficient for rapid prototyping and development, as it reduces boilerplate and simplifies the data-fetching model.
-   **Proposed Production Architecture**: For a production model, a more scalable, decoupled architecture is recommended. This would involve:
    -   A dedicated **backend service** built with **Node.js and Express.js**. This service would handle all business logic, database interactions, and authentication.
    -   A **PostgreSQL** database managed with the **Prisma ORM**. PostgreSQL provides robust relational data integrity, and Prisma offers a type-safe and intuitive way to interact with the database.
    -   The Next.js frontend would communicate with the backend via a secure **REST or GraphQL API**.
    This separation of concerns provides better scalability (frontend and backend can be scaled independently), maintainability (teams can work on different services without conflict), and allows for independent development and deployment of the frontend and backend services.

## 3. Technology Stack

| Category      | Technology                                    | Purpose                                                                          |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| **Framework**   | [Next.js](https://nextjs.org/) (App Router)   | Full-stack React framework for frontend, backend (Node.js), and routing.         |
| **Language**    | [TypeScript](https://www.typescriptlang.org/) | Adds static typing to JavaScript for improved code quality and maintainability.  |
| **UI Library**  | [React](https://react.dev/)                   | Core library for building the user interface.                                    |
| **Styling**     | [Tailwind CSS](https://tailwindcss.com/)      | A utility-first CSS framework for rapid UI development.                            |
| **Components**  | [ShadCN UI](https://ui.shadcn.com/)           | A collection of accessible, re-usable, and beautifully designed UI components.   |
| **Mapping**     | [Leaflet](https://leafletjs.com/)             | An open-source JavaScript library for interactive maps.                            |
| **Validation**  | [Zod](https://zod.dev/)                       | TypeScript-first schema validation for forms and API responses.                  |
| **Forms**       | [React Hook Form](https://react-hook-form.com/) | Performant and flexible library for managing form state and validation.          |

**Note on Production Stack:** The technology choices above reflect the current prototype. As detailed in the architecture section, a production version of this application would evolve to use a dedicated **Node.js + Express.js backend** with a **PostgreSQL** database and **Prisma ORM**, separating it from the Next.js frontend.

---

## 4. Project Structure & Component Breakdown

The project follows a standard Next.js App Router structure.

```
src
├── app/
│   ├── (dashboard)/                  # Route group for pages with the main layout.
│   │   ├── page.tsx                  # Main dashboard.
│   │   ├── map/page.tsx              # Live plant map view.
│   │   ├── permits/page.tsx          # Page to view all permits.
│   │   └── scan/page.tsx             # QR code scanning interface.
│   ├── login/page.tsx                # Employee login page.
│   ├── visitor/page.tsx              # Dedicated dashboard for a logged-in visitor.
│   └── layout.tsx                    # Root layout for the entire application.
├── components/
│   ├── ui/                           # ShadCN UI components.
│   ├── app-wrapper.tsx               # Handles auth redirects and layout switching.
│   ├── hindalco-header.tsx           # Main application header and navigation.
│   ├── map-view.tsx                  # The interactive Leaflet map component.
│   ├── permit-form.tsx               # Dialog for creating a new work permit.
│   └── visitor-request-form.tsx      # Dialog for requesting a visitor pass.
├── context/
│   └── user-context.tsx              # React Context for managing user session.
├── lib/
│   ├── actions.ts                    # Server Actions (backend logic for mutations).
│   ├── data.ts                       # Mock database for permits.
│   ├── employee-data.ts              # Mock database for employees.
│   ├── visitor-data.ts               # Mock database for visitors.
│   └── types.ts                      # Central TypeScript type definitions.
└── ...
```

### Key Component Functionality

-   **`user-context.tsx`**: Manages the global authentication state. It handles login/logout logic, persists the user session to `localStorage` for session continuity, and provides user data (like name, department, etc.) to all components through a React Context. This avoids prop-drilling and provides a single source of truth for the logged-in user.
-   **`app-wrapper.tsx`**: A critical client component that wraps all pages. It reads the user state from `UserContext` and performs necessary redirects. For example, it sends unauthenticated users to the login page and ensures that visitors cannot access employee-only dashboards. It's the gatekeeper for the application's routes.
-   **Login Pages (`app/login/**`)**: Client components that handle user input for authentication. They capture credentials, call the respective `login` or `loginVisitor` functions from `UserContext`, and display success or error feedback to the user using toast notifications.
-   **Dashboard (`app/page.tsx`)**: The central hub for employees. It uses **Role-Based Access Control (RBAC)** to conditionally render components based on the logged-in user's department.
    -   **Safety Dept**: Sees a "High-Risk Permits for Review" card to draw immediate attention to critical tasks.
    -   **Security Dept**: Sees a "Request Visitor Pass" button, providing a shortcut to a common task for that role.
-   **`permit-form.tsx`**: A dialog containing a form managed by `react-hook-form` for performance and `zod` for validation. On submission, it doesn't send a typical API request. Instead, it directly calls the `createPermit` Server Action, passing the form data. This provides a seamless, type-safe connection between the frontend form and the backend logic.
-   **`actions.ts`**: Contains the core backend logic. The `createPermit` function validates input using Zod, calls the `assessPermitRisk` AI flow, generates a unique ID and QR code URL, and simulates saving a new permit to the database. This file runs **only on the server**, protecting business logic and secrets.
-   **`map-view.tsx`**: A client component that dynamically imports and renders a Leaflet map to avoid bloating the initial page load. It receives permit and visitor data as props and is responsible for rendering custom markers (color-coded pins for permits, glowing dots for visitors). It also handles user interactions like clicking on a marker to view its details.
-   **`visitor-page.tsx`**: A dedicated view for a logged-in visitor, displaying their digital pass with a unique QR code. It continuously tracks their location in the background (while the tab is open) by calling the `updateUserLocation` function in the `UserContext`, allowing their position to be updated on the main plant map.

## 5. Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Environment Variables

You will need a Google AI API key to run the AI risk assessment feature.

1.  Create a file named `.env` in the root of the project.
2.  Add your API key to the file:
    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

### Installation & Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    The application runs on `http://localhost:9003`.
    ```bash
    npm run dev
    ```

## 6. Future Improvements

-   **Production Backend & Database Integration**: Transition from the integrated Next.js backend to a dedicated **Node.js + Express.js** service. Replace the mock data files in `src/lib/` with a real database connection to **PostgreSQL**, managed by the **Prisma ORM**. This is the most critical step for moving to production.
-   **Real-time Notifications**: Implement a real-time notification system (e.g., using WebSockets or Server-Sent Events) for permit approvals and visitor requests. This would provide instant feedback to users instead of them needing to refresh the page.
-   **Full Visitor Approval Workflow**: Build the UI for department heads to approve or reject visitor pass requests that are submitted by the Security department. This would involve creating a new page and updating the backend to handle the change in status.
-   **QR Code Scanning Logic**: Implement the client-side logic in `scan/page.tsx` to use the camera feed to read QR codes. This would involve adding a QR code decoding library and then using the decoded data to fetch permit/visitor details from the backend for validation.
-   **Background Location on Mobile**: For true background location tracking (even when the app isn't open), the application would need to be built as a native mobile app (e.g., using React Native), as web browsers have strict limitations on background processes to conserve battery and protect user privacy.
-   **Testing and QA**: Add a comprehensive testing suite, including unit tests for components and server actions, and end-to-end tests to simulate user flows.
-   **CI/CD Pipeline**: Set up a Continuous Integration/Continuous Deployment pipeline (e.g., using GitHub Actions) to automate testing and deployment processes.
-   **I want to commit this on GitHub**
Of course! Setting up the project for local testing is a great next step. I've already ensured the `README.md` file contains all the necessary instructions. Here is a summary of the steps you'll need to follow once you download and unzip the project code:

**1. Create the Environment File**

*   In the root directory of the project, create a new file named `.env`.
*   Inside this file, add your Google AI API key like this:
    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```
    This is necessary for the AI-powered risk assessment feature to work.

**2. Install Dependencies**

*   Open your terminal, navigate to the project's root folder, and run the following command. This will download all the necessary packages for the project.
    ```bash
    npm install
    ```

**3. Run the Development Server**

*   Once the installation is complete, run this command to start the application:
    ```bash
    npm run dev
    ```

The application will then be available for you to test at **`http://localhost:9003`** in your web browser.

Let me know if you have any other questions
```

## 7. Committing to GitHub
To commit the whole project to GitHub, follow these steps:
### Step 1: Download Your Project
Download the project files from this development environment. There should be an "Export" or "Download Code" option available in the IDE's menu that will package all the files into a `.zip` archive for you.

### Step 2: Set Up a New Repository on GitHub
Go to GitHub.com and log in.
Click the + icon in the top-right corner and select New repository.
Give your repository a name (e.g., hindalco-cpsms-app) and an optional description.
Choose whether to make it public or private.
Click Create repository.
### Step 3: Upload Your Code
After you've created the repository, GitHub will give you instructions. Since you're uploading an existing project, you'll want to follow the steps for "…or push an existing repository from the command line".

First, unzip the project you downloaded onto your local machine. Then, open a terminal or command prompt, navigate into the project's root folder, and run the following commands:

```bash
# Initialize a Git repository in your project folder
git init -b main

# Add all the files to be tracked by Git
git add .

# Create your first commit
git commit -m "Initial commit of Hindalco C-PSMS MVP"

# Connect your local repository to the one you created on GitHub
# (Replace with your own repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Push your code to GitHub
git push -u origin main
```
## 8. I want to download this for local testing
I've already ensured the `README.md` file contains all the necessary instructions. Here is a summary of the steps you'll need to follow once you download and unzip the project code:

### 1. Create the Environment File

In the root directory of the project, create a new file named `.env`.
Inside this file, add your Google AI API key like this:
GOOGLE_API_KEY=your_google_ai_api_key_here
This is necessary for the AI-powered risk assessment feature to work.
### 2. Install Dependencies

Open your terminal, navigate to the project's root folder, and run the following command. This will download all the necessary packages for the project.
`npm install`
### 3. Run the Development Server

Once the installation is complete, run this command to start the application:
`npm run dev`
The application will then be available for you to test at `http://localhost:9003` in your web browser.

Let me know if you have any other questions!
