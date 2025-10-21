# Contributing to Productivity App

Thank you for your interest in contributing to the Productivity App! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes following our coding standards

4. Test your changes thoroughly

5. Commit with clear, descriptive messages:
   ```bash
   git commit -m "Add: New exercise filtering feature"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/videos for UI changes
   - Test results

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/productivity-app.git
   cd productivity-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   ```

4. Initialize database:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names

### React/Next.js

- Use functional components with hooks
- Follow Next.js App Router conventions
- Keep components focused and reusable
- Use proper error boundaries

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use the existing design system

### File Organization

```
app/
  - Place pages in appropriate directories
  - Use route groups when needed

components/
  - Create reusable components
  - Organize by feature or type

lib/
  - Utility functions and helpers
  - Shared business logic
```

### Naming Conventions

- **Files**: PascalCase for components (`UserProfile.tsx`)
- **Variables**: camelCase (`userData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- **Components**: PascalCase (`function UserCard()`)
- **Functions**: camelCase (`function fetchUserData()`)

### Comments

- Write clear, concise comments
- Document complex logic
- Use JSDoc for functions:
  ```typescript
  /**
   * Calculates reading progress percentage
   * @param current - Current page number
   * @param total - Total pages in book
   * @returns Percentage as integer (0-100)
   */
  function calculateProgress(current: number, total: number): number {
    return Math.round((current / total) * 100);
  }
  ```

## Testing

- Test all new features
- Ensure existing tests pass
- Add tests for bug fixes
- Test on different browsers
- Test responsive design

## Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(exercises): add exercise filtering by type
fix(books): correct progress calculation bug
docs(readme): update installation instructions
style(dashboard): improve card spacing
refactor(api): optimize database queries
```

## API Development

### Creating New Endpoints

1. Create route in `app/api/`
2. Add proper authentication checks
3. Validate input data
4. Handle errors gracefully
5. Return consistent response format

Example:
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Your logic here

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

## Database Changes

### Schema Modifications

1. Update `prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name description_of_change
   ```
3. Update TypeScript types
4. Update relevant API endpoints
5. Test thoroughly

### Seeding Data

Add seed scripts to `prisma/seed.ts` if needed.

## Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation
- Create user guides if needed
- Keep CHANGELOG.md updated

## Review Process

1. All PRs require review
2. Address review comments
3. Keep PR focused and small
4. Ensure CI/CD passes
5. Update documentation

## Getting Help

- Open an issue for questions
- Join discussions
- Check existing documentation
- Review closed issues for solutions

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to make this project better!
