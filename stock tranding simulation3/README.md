# 📈 Smart Stock Trading Simulation Platform

A production-grade full-stack web application demonstrating clean architecture, OOP design patterns, and real-time trading simulation built with Next.js, TypeScript, Prisma, and PostgreSQL.

## 🏗️ Architecture

This project follows **clean architecture principles** with strict separation of concerns:

```
/app              → UI pages (Next.js App Router)
/components       → Reusable UI components
/lib              → Domain models (OOP classes)
/services         → Business logic (TradingEngine)
/repositories     → Database access (Prisma)
/prisma           → Database schema and migrations
/types            → TypeScript type definitions
```

## 🧠 OOP Design Patterns

### Domain Models (`/lib`)
- **User** - Entity class with encapsulated balance management
- **Stock** - Entity class with price simulation logic
- **Portfolio** - Aggregate root with holdings management
- **Order** - Abstract base class with BuyOrder and SellOrder implementations
- **Transaction** - Value object representing completed trades
- **TradingEngine** - Core business logic for order execution

### Design Patterns Used
- **Strategy Pattern** - Different order types (Buy/Sell)
- **Factory Pattern** - Transaction creation
- **Repository Pattern** - Database access abstraction
- **Domain-Driven Design** - Rich domain models with business logic

## 🚀 Features

### Core Trading Functionality
- ✅ **Real-time Price Simulation** - Stocks update prices based on volatility
- ✅ **Buy/Sell Orders** - Execute trades with balance validation
- ✅ **Portfolio Management** - Track holdings with P/L calculations
- ✅ **Transaction History** - Complete audit trail of all trades
- ✅ **Market Overview** - Live stock prices with change indicators

### Advanced Features
- ✅ **Intelligent Trading Engine** - Validates orders, updates portfolios, records transactions
- ✅ **Price History Tracking** - 30-day historical data for each stock
- ✅ **Real-time Updates** - Auto-refresh market data every 5 seconds
- ✅ **Professional UI** - Modern dashboard with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon DB compatible)
- **Architecture**: Clean Architecture, OOP Design Patterns, Repository Pattern

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon DB account)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd smart-stock-trading-platform
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your database URL
```

3. **Set up database**
```bash
npx prisma generate
npx prisma db push
```

4. **Seed the database with sample data**
```bash
npx prisma db seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the trading platform.

## 🗄️ Database Schema

### Core Entities
- **User** - Trader accounts with balance management
- **Stock** - Tradeable securities with volatility
- **Portfolio** - User's collection of holdings
- **Holding** - Individual stock positions
- **Transaction** - Completed buy/sell orders
- **PriceHistory** - Historical price data for charts

### Relationships
- Users → Portfolios (one-to-one)
- Portfolios → Holdings (one-to-many)
- Stocks → Holdings (one-to-many)
- Users → Transactions (one-to-many)
- Stocks → Transactions (one-to-many)

## 🎯 Trading Engine Logic

The TradingEngine implements sophisticated business rules:

1. **Order Validation** - Check balance for buys, holdings for sells
2. **Price Simulation** - Real-time price updates based on volatility
3. **Portfolio Updates** - Automatic position management
4. **Transaction Recording** - Complete audit trail
5. **Balance Management** - Real-time balance updates

### Price Simulation Algorithm
```typescript
price = price ± (price * volatility * randomFactor)
```

Each stock has a volatility percentage that determines price movement range.

## 🔌 API Endpoints

### POST `/api/trade`
Execute buy/sell orders with validation and portfolio updates.

**Request:**
```json
{
  "userId": "user_1",
  "stockId": "stock_1", 
  "type": "BUY",
  "quantity": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Buy order executed successfully",
  "updatedBalance": 85000,
  "portfolio": {...},
  "transaction": {...},
  "priceUpdate": {
    "stockId": "stock_1",
    "oldPrice": 175.43,
    "newPrice": 176.12,
    "changePercent": 0.39
  }
}
```

### GET `/api/stocks`
Returns all stocks with simulated price updates.

### GET `/api/portfolio?userId=xxx`
Returns user's portfolio with current holdings and P/L.

## 🎨 UI Components

### Dashboard Layout
- **Header** - User balance and account info
- **Market Overview** - Live stock prices with gainers/losers
- **Trading Panel** - Buy/sell interface with validation
- **Portfolio Summary** - Holdings with P/L breakdown
- **Transaction History** - Recent trades with details

### Real-time Features
- Auto-refresh market data every 5 seconds
- Instant portfolio updates after trades
- Live price change indicators
- Real-time balance updates

## 🧪 Sample Data

The seed script creates:

- **3 Users** - John Trader, Jane Investor, Bob Analyst
- **8 Stocks** - AAPL, TSLA, MSFT, AMZN, GOOGL, META, NVDA, JPM
- **3 Portfolios** - One per user with different strategies
- **Sample Holdings** - Diversified positions
- **30-Day Price History** - Historical data for each stock
- **Sample Transactions** - Buy and sell examples

### Stock Data Examples
- **AAPL**: $175.43 (2.5% volatility)
- **TSLA**: $245.67 (4.5% volatility) 
- **MSFT**: $378.85 (2.0% volatility)
- **NVDA**: $485.09 (5.5% volatility)

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect Vercel account
3. Set `DATABASE_URL` environment variable
4. Deploy automatically

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret (optional)

### Neon DB Setup (Recommended)
1. Create Neon account at https://neon.tech
2. Create new project
3. Copy connection string to `.env.local`
4. Run `npx prisma db push` to create schema
5. Run `npx prisma db seed` to populate data

## 📊 Trading Features

### Order Types
- **Buy Orders** - Purchase stocks with balance validation
- **Sell Orders** - Sell stocks with holding validation

### Portfolio Management
- **Holdings Tracking** - Quantity and average price
- **P/L Calculation** - Real-time profit/loss
- **Performance Metrics** - Total value, returns, percentages

### Market Simulation
- **Price Updates** - Volatility-based price changes
- **Historical Data** - 30-day price history
- **Market Summary** - Gainers, losers, total stocks

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open database browser
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma db seed   # Seed database with sample data

# Linting
npm run lint         # Run ESLint
```

## 🎯 Architecture Highlights

### Clean Architecture Benefits
- **Testability** - Easy to unit test domain logic
- **Maintainability** - Clear separation of concerns
- **Scalability** - Modular, extensible design
- **Flexibility** - Easy to modify business rules

### OOP Principles Applied
- **Encapsulation** - Private fields with public methods
- **Inheritance** - Order hierarchy (Buy/Sell)
- **Polymorphism** - Different order execution strategies
- **Abstraction** - TradingEngine interface

## 📈 Future Enhancements

- [ ] **User Authentication** - Login/registration system
- [ ] **Advanced Charts** - Candlestick charts with technical indicators
- [ ] **Order Types** - Limit orders, stop-loss, market orders
- [ ] **Watchlists** - Custom stock monitoring lists
- [ ] **Analytics** - Portfolio performance analytics
- [ ] **Real-time WebSocket** - Live price updates
- [ ] **Mobile App** - React Native trading app
- [ ] **API Documentation** - OpenAPI/Swagger documentation

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` in `.env.local`
   - Ensure database is running
   - Verify connection string format

2. **Prisma Client Not Found**
   - Run `npx prisma generate`
   - Check `@prisma/client` is installed

3. **TypeScript Errors**
   - Run `npm install` to install all dependencies
   - Check `tsconfig.json` configuration

4. **Seed Data Issues**
   - Clear database: `npx prisma db push --force-reset`
   - Re-run seed: `npx prisma db seed`

### Development Tips
- Use `npx prisma studio` to inspect database
- Check browser console for API errors
- Use React DevTools for component debugging
- Monitor network tab for API calls

## 📝 License

This project is for educational purposes demonstrating clean architecture and OOP design patterns in a full-stack trading application.

---

**Built with ❤️ using Next.js, TypeScript, and Clean Architecture principles**

### 🎉 Ready to Start Trading!

1. Install dependencies: `npm install`
2. Set up database: `npx prisma db push`
3. Seed data: `npx prisma db seed`
4. Start trading: `npm run dev`

The platform will be available at `http://localhost:3000` with sample users and stocks ready for trading!
