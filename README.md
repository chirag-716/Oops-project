# 📈 Smart Stock Trading Simulation Platform

A full-stack web application built for an **Object-Oriented Programming (OOP)** course. This platform demonstrates clean architecture, design patterns, and real-time trading simulation using Next.js and a custom JSON-based storage system.

---

## 🏗️ Project Architecture & Impact

This project follows **Clean Architecture** principles, ensuring a strict separation of concerns.

### 1. **Frontend (UI Layer)**
- **Files**: `/app`, `/components`, `/contexts`
- **Responsibility**: Handles the user interface, state management, and real-time updates.
- **Impact**: Provides a professional dashboard where users can view live stock prices, manage their portfolios, and execute trades instantly. It uses **React Hooks** and **Context API** for efficient data flow.

### 2. **Backend (Logic Layer)**
- **Files**: `/app/api`, `/services`, `/lib`
- **Responsibility**: Handles request processing, business rules, and simulation logic.
- **Impact**: The **Trading Engine** and **Domain Models** process every trade, validating balances and holdings before updates. This ensures the integrity of the simulation.

### 3. **Database (Storage Layer)**
- **Files**: `/data/db.json`, `/lib/JsonDb.ts`
- **Responsibility**: Persistent storage using a custom JSON-based database.
- **Impact**: Replaces complex database setups with a lightweight, high-performance local file system. It ensures that user data, transactions, and portfolio states are saved between sessions.

---

## 🧠 OOP Concepts Implemented

If the professor asks where OOP is used, here are the key areas:

### 1. **Classes and Objects**
Every entity in the system is represented by a class.
- **Example**: [Stock.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/lib/Stock.ts), [User.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/lib/User.ts).
- **Impact**: Data and behavior are bundled together into reusable objects.

### 2. **Encapsulation**
We protect data by using `private` properties and providing `public` getter/setter methods.
- **Example**: In [Stock.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/lib/Stock.ts), the `price` and `volatility` are private. You cannot change them directly; you must use methods like `updatePrice()` which includes validation logic.

### 3. **Inheritance**
We use a base class to share common logic between different types of objects.
- **Example**: [Order.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/lib/Order.ts) contains an `abstract class Order`. Both `BuyOrder` and `SellOrder` inherit from this base class.
- **Impact**: Reduces code duplication by sharing common properties like `userId`, `stock`, and `quantity`.

### 4. **Polymorphism**
Different classes can implement the same method in their own way.
- **Example**: The `execute()` method is defined in the base `Order` class but implemented differently in `BuyOrder` (checks balance) and `SellOrder` (checks holdings).
- **Impact**: The [TradingEngine.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/services/TradingEngine.ts) can call `.execute()` on any order without needing to know if it's a Buy or Sell order.

### 5. **Abstraction**
We hide complex implementation details behind simple interfaces.
- **Example**: The **Repository Pattern** (e.g., [StockRepository.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/repositories/StockRepository.ts)).
- **Impact**: The API routes don't know how data is saved (JSON, SQL, or Cloud). They just call `findAll()` or `updatePrice()`.

---

## 🛠️ Design Patterns Used

1. **Singleton Pattern**: The [JsonDb.ts](file:///c:/Users/chirag/OneDrive/Documents/stock%20tranding%20simulation3/lib/JsonDb.ts) uses a Singleton to ensure only one instance of the database connection exists, preventing file corruption.
2. **Repository Pattern**: Abstraction layer between the domain logic and the data storage.
3. **Strategy Pattern**: Different trading strategies (Buy/Sell) are encapsulated in Order objects.

---

## 🚀 How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see the platform.

---

## 📂 File Directory Breakdown

| Directory | Description |
| :--- | :--- |
| `/app` | Next.js routes and API endpoints (Backend Entry). |
| `/components` | UI building blocks (Dashboard, Charts, Tables). |
| `/lib` | **Core OOP Models** (User, Stock, Order, Portfolio). |
| `/repositories` | Data Access logic (JSON DB queries). |
| `/services` | Business Logic (Trading Engine simulation). |
| `/data` | Persistent JSON storage (`db.json`). |
| `/contexts` | Global state (Dark Mode, Toasts). |

---

**Developed for OOP Project Submission - 2026**
