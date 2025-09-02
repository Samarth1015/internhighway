# NoteFlow - Modern Note Taking Application

A modern, full-stack note-taking application with clean UI and secure authentication. Built with Next.js 15, Clerk authentication, and Express.js backend with MVC architecture.

## Features

### 🔐 Authentication
- **Clerk Integration**: Secure authentication with email/password and Google OAuth
- **Session Management**: Protected routes and user-specific data
- **User Management**: Automatic user creation and profile management

### 📝 Note Management
- **Create & Edit**: Rich text notes with titles and content
- **Search & Filter**: Find notes quickly with real-time search
- **CRUD Operations**: Full create, read, update, and delete functionality
- **User Isolation**: Each user can only access their own notes
- **Archive System**: Archive and unarchive notes

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first, desktop-optimized interface
- **Tailwind CSS**: Beautiful, consistent styling
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns
- **Clean Interface**: Minimalist design focused on productivity

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation
- **Radix UI**: Accessible component primitives
- **Clerk**: Authentication and user management

### Backend
- **Express.js**: Web application framework
- **TypeScript**: Type-safe development
- **MVC Architecture**: Model-View-Controller pattern
- **Prisma ORM**: Type-safe database operations
- **Clerk Backend**: Server-side authentication
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware

### Database
- **PostgreSQL**: Robust, scalable database (via Supabase)
- **Prisma Schema**: Type-safe database schema
- **User Relations**: Secure data isolation

## Prerequisites

Before running this application, you'll need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Supabase** account and project
4. **Clerk** account and application
5. **OpenAI API key** (optional, for enhanced AI features)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database URL (for Prisma)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret (optional, kept for reference)
JWT_SECRET=your_jwt_secret_here
```

### 4. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a new Supabase project
2. Get your database connection string
3. Update the `DATABASE_URL` in your `.env.local`
4. Run database migrations:

```bash
npm run db:generate
npm run db:push
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Update the `DATABASE_URL` in your `.env.local`
4. Run database migrations:

```bash
npm run db:generate
npm run db:push
```

### 5. Clerk Setup

1. Create a new Clerk application
2. Configure authentication methods (email/password, Google OAuth)
3. Add your Clerk keys to `.env.local`
4. Configure redirect URLs in Clerk dashboard

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Authentication

- **Sign Up**: Create an account using email/password or Google OAuth
- **Sign In**: Access your account with secure authentication
- **User Profile**: Manage your account settings and preferences

### 2. Notes

- **Create Notes**: Click "New Note" to create a new note
- **Edit Notes**: Click the edit button on any note
- **Delete Notes**: Remove notes you no longer need
- **Search Notes**: Use the search bar to find specific notes
- **Archive Notes**: Archive notes to keep them organized

## API Endpoints

### Backend API (Express.js Server)
The frontend communicates with a separate Express.js backend server running on port 8080.

### Notes
- `GET http://localhost:8080/api/notes` - Fetch user's notes
- `POST http://localhost:8080/api/notes` - Create a new note
- `PUT http://localhost:8080/api/notes/:id` - Update a note
- `DELETE http://localhost:8080/api/notes/:id` - Delete a note
- `PATCH http://localhost:8080/api/notes/:id/archive` - Archive/unarchive a note

### Health Check
- `GET http://localhost:8080/health` - Server health check

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
npm run dev          # Start development server
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
my-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── dashboard/      # Dashboard page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── middleware.ts   # Clerk middleware
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── NoteCard.tsx    # Note display component
│   │   └── NoteForm.tsx    # Note form component
│   └── lib/                # Utility libraries
│       └── supabase.ts     # Supabase client
├── public/                 # Static assets
├── .env.local             # Environment variables
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables
3. Deploy the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation
- Review the code examples

## Architecture

This application follows a clean separation of concerns:

- **Frontend (my-app/)**: Next.js 15 application with React 19, Tailwind CSS, and Clerk authentication
- **Backend (server/)**: Express.js server with MVC architecture, Prisma ORM, and Clerk backend authentication
- **Database**: PostgreSQL via Supabase with Prisma schema management

## Roadmap

- [ ] Enhanced note organization with folders and tags
- [ ] Real-time collaboration features
- [ ] Advanced search and filtering
- [ ] Mobile app development
- [ ] Export and backup functionality
- [ ] Rich text editor integration
- [ ] Note sharing capabilities
- [ ] Offline support

---

**NoteFlow** - A modern, clean note-taking experience with secure authentication and organized workflow.
