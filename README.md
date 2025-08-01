# Wallet Backend API Documentation

A robust REST API for managing personal wallet transactions with rate limiting, database persistence, and automated health monitoring.

## 🚀 Features

- **Transaction Management**: Create, read, and delete wallet transactions
- **Financial Analytics**: Get balance, income, and expense summaries
- **Rate Limiting**: Built-in protection against API abuse
- **Database Persistence**: PostgreSQL with Neon serverless
- **Health Monitoring**: Automated health checks every 14 minutes
- **CORS Support**: Cross-origin resource sharing enabled

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Rate Limiting](#rate-limiting)
- [Health Monitoring](#health-monitoring)
- [Development](#development)
- [Deployment](#deployment)

## 🔧 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Neon recommended)
- Upstash Redis account (for rate limiting)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/regis-mugisha/expo-wallet-api.git
   cd expo-wallet-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database(from neon console)

# Server Configuration
PORT=5001
NODE_ENV=development

# API Configuration
API_URL=https://expo-wallet-api.onrender.com/api/health

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## 🗄️ Database Schema

The API uses a PostgreSQL database with the following schema:

### Transactions Table

| Column     | Type          | Constraints       | Description                   |
| ---------- | ------------- | ----------------- | ----------------------------- |
| id         | SERIAL        | PRIMARY KEY       | Unique transaction identifier |
| user_id    | VARCHAR(255)  | NOT NULL          | User identifier               |
| title      | VARCHAR(255)  | NOT NULL          | Transaction description       |
| amount     | DECIMAL(10,2) | NOT NULL          | Transaction amount            |
| category   | VARCHAR(50)   | NOT NULL          | Transaction category          |
| created_at | DATE          | NOT NULL, DEFAULT | Transaction creation date     |

## 🔌 API Endpoints

### Base URL

```
http://localhost:5001/api
```

### Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok"
}
```

### Transactions

#### Get User Transactions

```http
GET /api/transactions/:userId
```

**Parameters:**

- `userId` (path): User identifier

**Response:**

```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Grocery Shopping",
    "amount": -50.0,
    "category": "Food",
    "created_at": "2024-01-15"
  }
]
```

#### Create Transaction

```http
POST /api/transactions
```

**Request Body:**

```json
{
  "user_id": "user123",
  "title": "Salary",
  "amount": 2000.0,
  "category": "Income"
}
```

**Response:**

```json
{
  "id": 2,
  "user_id": "user123",
  "title": "Salary",
  "amount": 2000.0,
  "category": "Income",
  "created_at": "2024-01-15"
}
```

#### Delete Transaction

```http
DELETE /api/transactions/:id
```

**Parameters:**

- `id` (path): Transaction identifier

**Response:**

```json
{
  "message": "Transaction deleted successfully."
}
```

#### Get User Transaction Summary

```http
GET /api/transactions/summary/:userId
```

**Parameters:**

- `userId` (path): User identifier

**Response:**

```json
{
  "balance": 1500.0,
  "income": 3000.0,
  "expenses": -1500.0
}
```

## 🛡️ Rate Limiting

The API implements rate limiting using Upstash Redis:

- **Limit**: 100 requests per minute per IP address
- **Window**: Sliding window algorithm
- **Response**: 429 Too Many Requests when limit exceeded

## 📊 Health Monitoring

The API includes automated health monitoring:

- **Schedule**: Every 14 minutes
- **Endpoint**: `/api/health`
- **Purpose**: Keep the server active and monitor availability
- **Production Only**: Runs only in production environment

## 🛠️ Development

### Project Structure

```
src/
├── config/
│   ├── cron.js          # Health monitoring scheduler
│   ├── db.js            # Database connection
│   └── upstash.js       # Rate limiting configuration
├── controllers/
│   └── transactionsController.js  # Business logic
├── middleware/
│   └── rateLimiter.js   # Rate limiting middleware
├── routes/
│   └── transactionsRoute.js      # API routes
└── server.js            # Main application file
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start
```

### Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Missing required fields
- **404 Not Found**: Transaction not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side errors

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Ensure all required environment variables are set
2. **Database**: Use a production-ready PostgreSQL instance
3. **Rate Limiting**: Configure Upstash Redis for production
4. **Health Monitoring**: The cron job will automatically start in production

### Deployment Platforms

The API can be deployed on various platforms:

- **Vercel**: Serverless deployment
- **Railway**: Easy PostgreSQL integration
- **Heroku**: Traditional hosting
- **DigitalOcean**: VPS deployment

### Environment Setup

For production deployment, ensure:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
API_URL=https://your-production-domain.com/api/health
```

## 📝 API Usage Examples

### Using cURL

```bash
# Get user transactions
curl -X GET "http://localhost:5001/api/transactions/user123"

# Create a transaction
curl -X POST "http://localhost:5001/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "title": "Coffee",
    "amount": -5.50,
    "category": "Food"
  }'

# Get transaction summary
curl -X GET "http://localhost:5001/api/transactions/summary/user123"
```

### Using JavaScript/Fetch

```javascript
// Get transactions
const response = await fetch("/api/transactions/user123");
const transactions = await response.json();

// Create transaction
const newTransaction = await fetch("/api/transactions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: "user123",
    title: "Salary",
    amount: 2000.0,
    category: "Income",
  }),
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible

2. **Rate Limiting Issues**

   - Check Upstash Redis configuration
   - Verify environment variables

3. **Health Check Failures**
   - Ensure `API_URL` is set correctly
   - Check server logs for errors

### Logs

The API provides detailed logging:

- Transaction operations
- Error messages
- Rate limiting events
- Health check status

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Version**: 1.0.0  
**Last Updated**: July 2025
