# Fleet Management System (FleeMan)

FleeMan is a robust, full-stack Fleet Management System designed to streamline vehicle rental operations. It provides a comprehensive solution for managing bookings, customers, vehicle fleets, locations (hubs/airports), and billing generation. The system is built with a modern technology stack featuring a **Spring Boot** backend and a **React (Vite)** frontend.

## 🚀 Features

### Core Modules
*   **User Management**: Role-based access control (Admin, Customer, Staff) using JWT authentication and Google OAuth.
*   **Fleet Management**: Manage cars, strictly categorized by car types, including maintenance of vehicle details.
*   **Booking System**: Complete booking lifecycle management including add-ons handling and availability checks.
*   **Location Management**: Manage operational hubs, airports, cities, and states for pickup/drop-off logistics.
*   **Customer Portal**: Interface for customers to register, view inventory, make bookings, and manage their profiles.
*   **Billing & Invoicing**: Automated invoice generation (PDF support indicated by dependencies) and billing calculation.
*   **Vendor Management**: Manage third-party vehicle vendors.
*   **Support System**: Customer support ticket/query handling.
*   **Internationalization**: Locale/Translation support.

## 🛠 Technology Stack

### Backend
*   **Framework**: Spring Boot 3.3.8
*   **Language**: Java 17
*   **Data Access**: Spring Data JPA, Hibernate
*   **Database**: MySQL
*   **Security**: Spring Security, JWT (Json Web Token), Google OAuth 2.0
*   **Tools**: Maven, Lombok, Spring Boot Actuator
*   **Utilities**: Apache POI (Excel), iText (PDF Generation), Java Mail Sender

### Frontend
*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, Radix UI (for accessible components)
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios
*   **Internationalization**: i18next

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
*   **Java Development Kit (JDK)**: Version 17 or higher.
*   **Node.js**: Version 18 or higher (with npm).
*   **MySQL Server**: Version 8.0+.
*   **Maven**: (Optional, as the project includes the mvnw wrapper).

## ⚙️ Installation and Setup

### 1. Database Setup
1.  Open your MySQL Workbench or CLI.
2.  Create a database named `testfleet`.
    ```sql
    CREATE DATABASE testfleet;
    ```
3.  The application uses `spring.jpa.hibernate.ddl-auto=update`, so tables will be automatically created upon the first run.

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd "Backend JAVA"
    ```
2.  **Configuration**: Open `src/main/resources/application-dev.properties` and verify your database credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/testfleet
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD
    ```
3.  **Run the Application**:
    ```bash
    ./mvnw spring-boot:run
    ```
    *   The backend server will start on **Port 9001**.
    *   Health Check URL: `http://localhost:9001/actuator/health`

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd React_Frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    *   The frontend server will start on **Port 3000** (or the port specified by Vite in the terminal).
    *   Access the Application: `http://localhost:3000`

## 📂 Project Structure

```
Fleet-Management-System/
├── Backend JAVA/               # Spring Boot Backend Code
│   ├── src/main/java/          # Java Source Files (Controllers, Services, Entities)
│   ├── src/main/resources/     # Configuration (application.properties) & Static Resources
│   └── pom.xml                 # Maven Project Object Model
│
├── React_Frontend/             # React Frontend Code
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/              # Application Pages (Admin, Auth, Client, Staff)
│   │   ├── services/           # API Handling Logic
│   │   └── App.jsx             # Main Application Component
│   ├── public/                 # Static Assets
│   ├── package.json            # Node Dependencies & Scripts
│   ├── tailwind.config.js      # Tailwind CSS Configuration
│   └── vite.config.js          # Vite Configuration
│
└── README.md                   # Project Documentation
```

## 🔌 API Endpoints (Overview)

The backend exposes RESTful APIs via the following main controllers:
*   `/admin/**`: Administrative actions.
*   `/auth/**`: Authentication and user registration.
*   `/bookings/**`: Booking creation and management.
*   `/cars/**`: Vehicle inventory management.
*   `/customers/**`: Customer profile management.
*   `/invoice/**`: Billing and invoice retrieval.

## 🤝 Contribution
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
