# NoteFlow Backend Server

A TypeScript-based Express.js backend server for the NoteFlow note-taking application. This server provides RESTful API endpoints for managing notes with Clerk authentication and follows MVC architecture patterns.

## Features

- **RESTful API**: Clean, RESTful endpoints for notes management
- **Clerk Authentication**: Secure authentication using Clerk's networkless verification
- **MVC Architecture**: Model-View-Controller pattern for clean code organization
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **TypeScript**: Full TypeScript support for better development experience
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **Clerk**: Authentication and user management
- **Prisma**: Database ORM
- **PostgreSQL**: Database (via Supabase)
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware

## Prerequisites

Before running this server, you'll need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **PostgreSQL database** (or Supabase project)
4. **Clerk account** for authentication

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8080

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Configuration (optional, kept for reference)
JWT_SECRET=your_jwt_secret_here

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a new Supabase project
2. Get your database connection string
3. Update the `DATABASE_URL` in your `.env` file
4. Run database migrations:

```bash
npm run db:generate
npm run db:push
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Update the `DATABASE_URL` in your `.env` file
4. Run database migrations:

```bash
npm run db:generate
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The server will be available at `http://localhost:8080`

## API Endpoints

### Authentication Required
All API endpoints require valid Clerk authentication via the `Authorization` header:
```
Authorization: Bearer <your-clerk-session-token>
```

### Notes

#### GET /api/notes
Get all notes for the authenticated user.

**Response:**
```json
{
  "notes": [
    {
      "id": "note_id",
      "title": "Note Title",
      "content": "Note content...",
      "isArchived": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/notes
Create a new note.

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content..."
}
```

**Response:**
```json
{
  "note": {
    "id": "note_id",
    "title": "Note Title",
    "content": "Note content...",
    "isArchived": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/notes/:id
Get a specific note by ID.

#### PUT /api/notes/:id
Update a note by ID.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### DELETE /api/notes/:id
Delete a note by ID.

**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

#### PATCH /api/notes/:id/archive
Archive or unarchive a note.

**Request Body:**
```json
{
  "isArchived": true
}
```

### Health Check

#### GET /health
Server health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Schema

### Users
```sql
- id: String (Primary Key)
- clerkId: String (Unique, Clerk User ID)
- email: String (Unique)
- name: String
- imageUrl: String
- createdAt: DateTime
- updatedAt: DateTime
```

### Notes
```sql
- id: String (Primary Key)
- title: String
- content: String
- userId: String (Foreign Key to Users)
- isArchived: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio

# Linting
npm run lint         # Run ESLint
```

### Project Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   └── config.ts        # Server configuration
│   ├── controllers/         # MVC Controllers
│   │   └── NoteController.ts # Notes controller
│   ├── models/              # MVC Models
│   │   ├── Note.ts          # Note model interface
│   │   └── User.ts          # User model interface
│   ├── repositories/        # Data access layer
│   │   ├── PrismaNoteRepository.ts    # Note repository
│   │   └── PrismaUserRepository.ts    # User repository
│   ├── services/            # Business logic layer
│   │   ├── NoteService.ts   # Note service
│   │   └── UserService.ts   # User service
│   ├── lib/                 # Utility libraries
│   │   └── prisma.ts        # Prisma client
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # Clerk authentication middleware
│   ├── routes/              # API routes
│   │   └── notes.ts         # Notes API routes
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma schema file
├── dist/                    # Compiled JavaScript (after build)
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Authentication Flow

1. **Frontend**: User authenticates with Clerk
2. **Frontend**: Gets session token from Clerk
3. **Frontend**: Sends requests with session token in Authorization header
4. **Backend**: Validates session token using Clerk's networkless verification
5. **Backend**: Creates/updates user in database if needed
6. **Backend**: Processes request and returns response

## Error Handling

The server includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## CORS Configuration

CORS is enabled by default to allow frontend communication. You can customize the CORS settings in `src/app.ts`.

## Security Features

- **Clerk Authentication**: Secure session-based authentication with networkless verification
- **User Isolation**: Users can only access their own data
- **Input Validation**: Request data validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS Protection**: Controlled cross-origin access
- **Helmet Security**: Additional security headers

## Deployment

### Environment Variables

Make sure to set the following environment variables in production:

- `PORT`: Server port (default: 8080)
- `CLERK_SECRET_KEY`: Clerk secret key for authentication
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (production/development)

### Build and Start

```bash
npm run build
npm start
```

### Docker (Optional)

You can also containerize the application using Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation
- Review the API examples

---

**NoteFlow Backend Server** - A robust, scalable backend for modern note-taking applications.
