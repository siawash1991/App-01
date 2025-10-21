# Productivity App

A comprehensive productivity application built with Next.js 14, designed to help users track their exercises, reading progress, and share their personal achievements with a community.

## Features

### 1. Exercise Tracking
- Log various types of workouts (cardio, strength, yoga, running, cycling, swimming, etc.)
- Track duration, calories burned, distance, sets, reps, and weights
- View exercise history with detailed statistics
- Monitor weekly progress and total calories burned

### 2. Book Reading Tracker
- Add books with author, total pages, and current progress
- Track reading sessions with page progress
- Monitor reading percentage and completion status
- Update progress with session notes
- View all books with visual progress bars

### 3. Progress Posts (Social Feed)
- Share achievements and progress updates
- Create posts in different categories (exercise, book, general, achievement)
- Like and comment on posts
- Public/private visibility options
- Real-time feed of activities

### 4. User Profile
- Personal profile with bio and avatar
- Statistics dashboard showing total activities
- Edit profile information
- View account details and member since date

### 5. Dashboard Overview
- Quick stats for all activities
- Recent exercises and books
- Total calories burned and pages read
- Weekly exercise count

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **Database**: Prisma ORM with SQLite (easily configurable to PostgreSQL)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Password Hashing**: bcryptjs

## Project Structure

```
productivity-app/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── register/             # User registration
│   │   ├── exercises/            # Exercise endpoints
│   │   ├── books/                # Book tracking endpoints
│   │   ├── posts/                # Social posts endpoints
│   │   ├── users/                # User profile endpoints
│   │   └── stats/                # Statistics endpoint
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── exercises/            # Exercise tracking page
│   │   ├── books/                # Book tracking page
│   │   ├── posts/                # Social feed page
│   │   ├── profile/              # User profile page
│   │   └── page.tsx              # Dashboard home
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI components
│   │   └── Card.tsx              # Card components
│   ├── providers/                # Context providers
│   │   └── AuthProvider.tsx     # Authentication provider
│   └── Navigation.tsx            # Main navigation
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
├── types/
│   └── next-auth.d.ts            # TypeScript definitions
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
└── next.config.js                # Next.js configuration
```

## Database Schema

### Models:
- **User**: User accounts with authentication
- **Exercise**: Workout tracking with various metrics
- **Book**: Reading tracking with progress
- **ReadingSession**: Individual reading sessions
- **Post**: Social posts and updates
- **Comment**: Comments on posts
- **Like**: Post likes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd productivity-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NODE_ENV="development"
```

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Usage Guide

### First Steps

1. **Create an Account**: Navigate to `/register` and create your account
2. **Login**: Use your credentials to login at `/login`
3. **Explore Dashboard**: View your personalized dashboard at `/dashboard`

### Tracking Exercises

1. Navigate to "Exercises" from the dashboard
2. Click "Add Exercise"
3. Fill in the workout details (title, type, duration, etc.)
4. Submit to log your workout
5. View your exercise history and statistics

### Tracking Books

1. Navigate to "Books" from the dashboard
2. Click "Add Book"
3. Enter book details (title, author, total pages)
4. Update progress as you read by clicking "Update Progress"
5. Track completion percentage and reading sessions

### Creating Posts

1. Navigate to "Posts" from the dashboard
2. Click "Create Post"
3. Write your title and content
4. Select a category (exercise, book, achievement, general)
5. Publish to share with the community
6. Like and comment on others' posts

### Managing Profile

1. Navigate to "Profile" from the dashboard
2. Click "Edit Profile"
3. Update your name and bio
4. View your activity statistics

## API Documentation

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Exercises

- `GET /api/exercises?limit=10` - Get user's exercises
- `POST /api/exercises` - Create new exercise

### Books

- `GET /api/books?status=reading` - Get user's books
- `POST /api/books` - Create new book
- `POST /api/books/[id]/progress` - Update reading progress

### Posts

- `GET /api/posts?userId=xxx&limit=20` - Get posts
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Toggle like on post
- `POST /api/posts/[id]/comments` - Add comment to post

### Users

- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update user profile

### Statistics

- `GET /api/stats` - Get user statistics

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-secure-secret"
NODE_ENV="production"
```

### Database Migration

For production, consider using PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

## Security Considerations

- Passwords are hashed using bcryptjs
- Authentication is handled by NextAuth.js
- API routes are protected with session validation
- Environment variables are used for sensitive data
- CSRF protection is enabled by default

## Future Enhancements

- [ ] Add data visualization and charts
- [ ] Implement workout plans and routines
- [ ] Add book recommendations
- [ ] Enable file uploads for avatars and images
- [ ] Add friend system and following
- [ ] Implement notifications
- [ ] Add export functionality (CSV, PDF)
- [ ] Mobile app (React Native)
- [ ] Dark mode support
- [ ] Email notifications
- [ ] Social login (Google, GitHub)
- [ ] Progress streaks and achievements
- [ ] Leaderboards and challenges

## Troubleshooting

### Database Issues

If you encounter database errors:
```bash
rm prisma/dev.db
npm run prisma:push
```

### Build Errors

Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

### Authentication Issues

Ensure `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your domain.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma for the excellent ORM
- The open-source community

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
