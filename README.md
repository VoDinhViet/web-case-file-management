# Case Management System

A modern, full-featured case management application built with Next.js 15, TypeScript, and shadcn/ui. This application follows industry best practices for code organization, performance, and user experience.

## 🚀 Features

- **Dashboard**: Comprehensive overview of cases with real-time statistics
- **Case Management**: Create, view, update, and delete cases
- **Analytics**: Insights and metrics visualization
- **Settings**: User preferences and notifications
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Type Safety**: Full TypeScript support
- **Modern UI**: Built with shadcn/ui components

## 📋 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod validation
- **Themes**: next-themes
- **Code Quality**: Biome (linting & formatting)

## 🏗️ Project Structure

```
fe-case-managerment-app/
├── app/                          # Next.js app router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── analytics/           # Analytics page
│   │   ├── cases/              # Cases pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── settings/           # Settings page
│   │   ├── layout.tsx          # Dashboard layout
│   │   └── error.tsx           # Dashboard error boundary
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Landing page
│   ├── error.tsx              # Global error boundary
│   ├── not-found.tsx          # 404 page
│   └── globals.css            # Global styles
├── components/
│   ├── features/              # Feature-specific components
│   │   ├── dashboard/         # Dashboard components
│   │   └── cases/            # Case components
│   ├── layout/               # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── theme-toggle.tsx
│   │   └── dashboard-layout.tsx
│   ├── providers/            # Context providers
│   │   └── theme-provider.tsx
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
│   ├── use-local-storage.ts
│   ├── use-media-query.ts
│   ├── use-debounce.ts
│   └── index.ts
├── lib/                      # Utility functions
│   └── utils.ts
├── types/                    # TypeScript types
│   └── index.ts
├── config/                   # Configuration files
│   ├── site.ts
│   └── constants.ts
└── public/                   # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fe-case-managerment-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## 🎨 Best Practices Implemented

### Code Organization
- **Feature-based structure**: Components organized by feature/domain
- **Shared components**: Reusable UI components in `components/ui`
- **Custom hooks**: Extracted reusable logic in `hooks/`
- **Type safety**: Centralized types in `types/`
- **Configuration**: Centralized config in `config/`

### Next.js Best Practices
- **App Router**: Using Next.js 15 App Router
- **Route Groups**: Organized routes with layout groups
- **Server Components**: Default to server components
- **Client Components**: Marked with "use client" only when needed
- **Error Boundaries**: Proper error handling with error.tsx
- **Loading States**: Suspense boundaries for better UX
- **Metadata**: SEO-friendly metadata configuration

### Performance
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Using Next.js Image component
- **Font Optimization**: Using next/font
- **Lazy Loading**: Suspense for code splitting
- **Turbopack**: Faster builds and HMR

### UI/UX
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection
- **Accessibility**: Semantic HTML and ARIA labels
- **Loading States**: Skeleton loaders
- **Error States**: User-friendly error messages
- **Toast Notifications**: Using Sonner

### Code Quality
- **TypeScript**: Full type safety
- **Biome**: Modern linting and formatting
- **Consistent Naming**: Clear naming conventions
- **Component Composition**: Small, reusable components
- **Custom Hooks**: Extracted reusable logic

## 🎯 Key Components

### Layout Components
- **Header**: Top navigation with notifications and user menu
- **Sidebar**: Main navigation menu (desktop)
- **MobileNav**: Responsive mobile navigation
- **DashboardLayout**: Wrapper layout for dashboard pages

### Feature Components
- **DashboardStats**: Statistics cards
- **RecentCases**: Recent case activities
- **CasesTable**: Full case list with actions
- **ThemeToggle**: Theme switcher

### Custom Hooks
- **useLocalStorage**: Persist state to localStorage
- **useMediaQuery**: Responsive breakpoint detection
- **useDebounce**: Debounce input values

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### shadcn/ui Configuration
Components are configured in `components.json`:
- Style: New York
- Color: Neutral
- CSS Variables: Enabled
- Icon Library: Lucide React

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Theming

The application supports:
- Light mode
- Dark mode
- System preference

Themes are configured in `app/globals.css` using CSS variables.

## 🔐 Future Enhancements

- [ ] Authentication & Authorization
- [ ] Real-time updates with WebSockets
- [ ] File upload functionality
- [ ] Advanced filtering and search
- [ ] Export to PDF/Excel
- [ ] Email notifications
- [ ] Role-based access control
- [ ] API integration
- [ ] Database integration
- [ ] Automated testing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and shadcn/ui
