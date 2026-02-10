# 🐳 Fleet Management System - Docker Guide

This project supports running with **Java (Spring Boot)**, **.NET (ASP.NET Core)**, or **Both** backends simultaneously using Docker Compose Profiles.

## 🚀 How to Run

First, ensure you are inside this `docker/` directory:
```bash
cd docker
```

### 1. Run with Java Backend Only
If you want to test the Spring Boot implementation:
```bash
docker-compose --profile java up --build
```
*   **Frontend:** http://localhost:3000
*   **Java Backend:** http://localhost:5087
*   **Database:** localhost:3306

### 2. Run with .NET Backend Only
If you want to test the ASP.NET Core implementation:
```bash
docker-compose --profile dotnet up --build
```
*   **Frontend:** http://localhost:3000
*   **.NET Backend:** http://localhost:5086
*   **Database:** localhost:3306

### 3. Run Everything (Dual Backend)
If you want to test the failover/migration features:
```bash
docker-compose --profile all up --build
```

## 🛑 How to Stop
To stop all running containers:
```bash
docker-compose down
```

## 📂 Project Structure
*   **Frontend:** React + Vite + NGINX
*   **Backend 1:** Java 21 + Spring Boot 3
*   **Backend 2:** .NET 9 + Entity Framework
*   **Database:** MySQL 8.0 (Auto-initialized with `testfleet.sql`)
