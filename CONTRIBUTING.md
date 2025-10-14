# Contributing to Case Management System

Thank you for your interest in contributing to our project! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/case-management.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start the development server: `npm run dev`

## 📋 Development Workflow

### Code Style

We use Biome for linting and formatting. Before committing:

```bash
npm run lint    # Check for linting errors
npm run format  # Format code
```

### Commit Messages

Follow conventional commits format:

- `feat: add new feature`
- `fix: bug fix`
- `docs: documentation changes`
- `style: formatting, missing semi-colons, etc`
- `refactor: code refactoring`
- `test: adding tests`
- `chore: updating build tasks, package manager configs, etc`

Examples:
```
feat: add case filtering functionality
fix: resolve login redirect issue
docs: update README with API documentation
```

### Branch Naming

Use descriptive branch names:

- `feature/case-filtering`
- `bugfix/login-redirect`
- `docs/api-documentation`
- `refactor/component-structure`

## 🏗️ Project Structure

### Adding New Features

1. Create feature components in `components/features/[feature-name]/`
2. Add pages in `app/(dashboard)/[feature-name]/`
3. Define types in `types/index.ts`
4. Add utilities in `lib/`
5. Create custom hooks in `hooks/`

### Component Guidelines

- Use TypeScript for all components
- Follow the existing naming conventions
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use shadcn/ui components where possible

Example component structure:
```tsx
"use client"; // Only if needed

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
}
```

### File Organization

```
feature-name/
├── components/          # Feature components
│   ├── feature-list.tsx
│   ├── feature-detail.tsx
│   └── feature-form.tsx
├── hooks/              # Feature-specific hooks
│   └── use-feature.ts
└── types.ts           # Feature types (if complex)
```

## ✅ Testing

Before submitting a PR:

1. Test your changes locally
2. Ensure no TypeScript errors: `npm run build`
3. Check for linting issues: `npm run lint`
4. Test in both light and dark mode
5. Test responsive design (mobile, tablet, desktop)

## 📝 Pull Request Process

1. Update the README.md or relevant documentation
2. Ensure all tests pass and code is linted
3. Update the CHANGELOG.md if applicable
4. Create a pull request with a clear description
5. Link related issues in the PR description
6. Wait for code review

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. Clear description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (OS, browser, etc.)

## 💡 Feature Requests

For feature requests:

1. Describe the feature clearly
2. Explain the use case
3. Provide examples if possible
4. Discuss potential implementation

## 🎨 UI/UX Guidelines

- Follow the existing design system
- Use shadcn/ui components
- Maintain consistent spacing and typography
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test color contrast for readability

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## 📞 Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in pull request comments
- Contact maintainers

Thank you for contributing! 🎉

