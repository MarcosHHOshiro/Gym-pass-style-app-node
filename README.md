# 🏋️ GymPass Style App

RESTful API for managing gym check-ins, inspired by the GymPass business model. Built with Node.js, TypeScript, Fastify and Prisma ORM.

## 📋 About the Project

This application allows users to register, search for nearby gyms and check-in. Administrators can register gyms and validate user check-ins.

## ✨ Features

### Functional Requirements (FRs)
- ✅ Users should be able to register
- ✅ Users should be able to authenticate
- ✅ Users should be able to get their profile
- ✅ Users should be able to get the number of check-ins they have made
- ✅ Users should be able to get their check-in history
- ✅ Users should be able to search for nearby gyms (up to 10km)
- ✅ Users should be able to search for gyms by name
- ✅ Users should be able to check-in at a gym
- ✅ User check-ins should be validated
- ✅ Gyms should be registered

### Business Rules (BRs)
- ✅ Users cannot register with a duplicate email
- ✅ Users cannot check-in twice on the same day
- ✅ Users cannot check-in if they are not near (100m) the gym
- ✅ Check-ins can only be validated within 20 minutes after creation
- ✅ Check-ins can only be validated by administrators
- ✅ Gyms can only be registered by administrators

### Non-Functional Requirements (NFRs)
- ✅ User passwords must be encrypted
- ✅ Application data must be persisted in a PostgreSQL database
- ✅ All data lists must be paginated with 20 items per page
- ✅ Users must be identified by a JWT (JSON Web Token)

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **TypeScript** - JavaScript superset with static typing
- **Fastify** - Fast and low overhead web framework
- **Prisma ORM** - Modern ORM for Node.js and TypeScript
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **Bcrypt.js** - Password hashing
- **Zod** - Schema validation
- **Swagger/OpenAPI** - Interactive API documentation
- **Vitest** - Unit and E2E testing framework
- **Docker & Docker Compose** - Application containerization

## 📊 Data Model

### User
- `id`: UUID
- `name`: String
- `email`: String (unique)
- `password_hash`: String
- `role`: Enum (MEMBER | ADMIN)
- `created_at`: DateTime
- `updated_at`: DateTime

### Gym
- `id`: UUID
- `title`: String
- `description`: String (optional)
- `phone`: String (optional)
- `latitude`: Decimal
- `longitude`: Decimal

### CheckIn
- `id`: UUID
- `created_at`: DateTime
- `validated_at`: DateTime (optional)
- `user_id`: UUID (FK → User)
- `gym_id`: UUID (FK → Gym)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MarcosHHOshiro/Gym-pass-style-app-node.git
cd Gym-pass-style-app-node
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your settings:
```env
NODE_ENV=dev
PORT=3333
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://docker:docker@localhost:5435/apisolid?schema=public
```

### Running with Docker

1. Start the containers:
```bash
docker compose up -d --build
```

2. The API will be available at `http://localhost:3333`

3. To view logs:
```bash
docker compose logs -f api
```

4. To access the API container:
```bash
docker compose exec api sh
```

5. To stop the containers:
```bash
docker compose down
```

### Running Locally (without Docker)

1. Start the PostgreSQL database (via Docker):
```bash
docker compose up db -d
```

2. Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

3. Start the server in development mode:
```bash
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Start server in development mode with hot reload
- `npm run build` - Generate production build
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:watch` - Run E2E tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:ui` - Open Vitest visual interface

## 🧪 Testing

The project has unit and end-to-end test coverage using Vitest.

### Run unit tests:
```bash
npm test
```

### Run E2E tests:
```bash
npm run test:e2e
```

### Generate coverage report:
```bash
npm run test:coverage
```

## 🗂️ Project Structure

```
src/
├── @types/          # TypeScript type definitions
├── env/             # Environment variable configuration and validation
├── http/            # HTTP layer
│   ├── controllers/ # Route controllers
│   └── middleware/  # Middlewares (authentication, RBAC, etc.)
├── lib/             # Libraries and configurations (Prisma, etc.)
├── repositories/    # Data access layer
├── use-cases/       # Application business rules
├── utils/           # Utility functions
├── app.ts           # Fastify configuration
└── server.ts        # Server initialization
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Login through the authentication endpoint
2. Include the returned token in the request header:
```
Authorization: Bearer {your-token}
```

## 🔑 RBAC (Role-Based Access Control)

The system has two access levels:
- **MEMBER**: Standard user (can check-in, search gyms)
- **ADMIN**: Administrator (can register gyms, validate check-ins)

## 📦 Docker

The project is fully containerized with Docker:

- **db**: PostgreSQL 16 container
- **api**: Node.js application container

### Ports
- API: `3333`
- PostgreSQL: `5435` (mapped to 5432 internally)

## 📚 API Documentation (Swagger/OpenAPI)

The API has complete and interactive documentation automatically generated with Swagger/OpenAPI 3.0.

### Access Documentation

After starting the application, the documentation will be available at:

- **Swagger UI (Interactive Interface)**: http://localhost:3333/docs
- **OpenAPI Specification (JSON)**: http://localhost:3333/docs/json

### Documentation Features

- ✅ **Interactive Interface**: Test all endpoints directly from your browser
- ✅ **Integrated Authentication**: "Authorize" button to configure JWT token
- ✅ **Complete Schemas**: Detailed documentation of all requests and responses
- ✅ **Validations**: Description of all validations and business rules
- ✅ **Examples**: Usage examples for each endpoint
- ✅ **Status Codes**: Documentation of all possible return codes

### Documented Endpoints

#### 👤 Users
- `POST /users` - Register new user
- `POST /sessions` - Authenticate user (login)
- `PATCH /token/refresh` - Refresh JWT token
- `GET /me` - Get authenticated user profile

#### 🏋️ Gyms
- `GET /gyms/search` - Search gyms by name
- `GET /gyms/nearby` - Find nearby gyms (up to 10km)
- `POST /gyms` - Create new gym (requires ADMIN)

#### ✅ Check-ins
- `GET /check-ins/history` - User check-in history
- `GET /check-ins/metrics` - Total check-in metrics
- `POST /gyms/:gymId/check-ins` - Check-in at a gym
- `PATCH /check-ins/:checkInId/validate` - Validate check-in (requires ADMIN)

### How to Use Interactive Documentation

1. Access http://localhost:3333/docs
2. To test protected endpoints:
   - First, make a `POST /sessions` request to get the token
   - Click the **"Authorize"** button at the top of the page
   - Paste the JWT token in the `bearerAuth` field
   - Click "Authorize" and then "Close"
3. Now you can test all endpoints by clicking "Try it out"

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is under the ISC license.

## 👤 Author

Developed by [MarcosHHOshiro](https://github.com/MarcosHHOshiro)

## 🔗 Links

- [Repository](https://github.com/MarcosHHOshiro/Gym-pass-style-app-node)
- [Issues](https://github.com/MarcosHHOshiro/Gym-pass-style-app-node/issues)
