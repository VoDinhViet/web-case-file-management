# Setup Instructions

## Quick Start

```bash
# 1. Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Start development server
npm run dev
# or
pnpm dev

# 4. Check console for base URL confirmation
# You should see: [API Client] Base URL: http://localhost:3001
```

---

## Environment Variables

### Step 1: Create `.env.local` file

Create a `.env.local` file in the project root (same level as `package.json`):

```bash
# Create the file
touch .env.local
```

### Step 2: Add configuration

Add the following content to `.env.local`:

```env
# API Configuration
# IMPORTANT: Must start with NEXT_PUBLIC_ to be accessible in the browser
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important Notes:**
- The variable **MUST** start with `NEXT_PUBLIC_` to work in Next.js
- Replace `http://localhost:3001` with your actual backend API URL
- Do NOT include trailing slash
- Do NOT commit `.env.local` to git (it's in .gitignore)

### For Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Verify Configuration

After creating `.env.local`, restart your dev server and check the console. You should see:

```
[API Client] Base URL: http://localhost:3001
```

If you see `(empty - using relative paths)`, the environment variable is not being loaded.

## API Endpoints

All API endpoints now use the `/api/v1/` prefix:

- **List Templates**: `GET /api/v1/templates?page=1&limit=10`
- **Get Template**: `GET /api/v1/templates/:id`
- **Create Template**: `POST /api/v1/templates`
- **Update Template**: `PUT /api/v1/templates/:id`
- **Delete Template**: `DELETE /api/v1/templates/:id`

## Backend Requirements

Make sure your backend server:

1. Is running on the URL specified in `NEXT_PUBLIC_API_URL`
2. Implements the endpoints listed above
3. Accepts Bearer token authentication via the `Authorization` header
4. Returns responses in the expected format

### Expected Response Format

**List Templates:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Single Template:**
```json
{
  "id": "...",
  "title": "...",
  "description": "...",
  "groups": [...],
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Development Setup

1. Copy `.env.example` to `.env.local` (if it exists)
2. Update `NEXT_PUBLIC_API_URL` with your backend URL
3. Run `npm install` or `pnpm install`
4. Run `npm run dev` or `pnpm dev`
5. Open http://localhost:3000

## Troubleshooting

### 404 Error: Cannot GET /api/v1/templates

**Possible Causes:**

1. **Environment variable not set**
   - Check if `.env.local` exists in project root
   - Verify the variable starts with `NEXT_PUBLIC_`
   - Check console for: `[API Client] Base URL: ...`

2. **Dev server not restarted**
   - Environment variables only load on server start
   - Stop the server (Ctrl+C)
   - Run `npm run dev` or `pnpm dev` again

3. **Backend server not running**
   - Check if backend is running on the configured URL
   - Try accessing it directly: `curl http://localhost:3001/api/v1/templates`

4. **Wrong backend URL**
   - Verify the URL in `.env.local` is correct
   - Check if backend is using a different port
   - Ensure no trailing slash in the URL

### Debugging Steps

1. **Check environment variable:**
```bash
# In your dev server terminal, you should see:
[API Client] Base URL: http://localhost:3001
```

2. **Check API calls:**
```bash
# Every API call will log in development:
[API] GET http://localhost:3001/api/v1/templates?page=1&limit=10
```

3. **Test backend directly:**
```bash
# Test if backend is accessible
curl http://localhost:3001/api/v1/templates

# If you get HTML response or 404, your backend might not have these endpoints
```

4. **Check Next.js environment:**
```javascript
// Add this temporarily to any page to debug:
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
```

### Common Mistakes

❌ **Wrong:** `API_URL=http://localhost:3001`
✅ **Correct:** `NEXT_PUBLIC_API_URL=http://localhost:3001`

❌ **Wrong:** `NEXT_PUBLIC_API_URL=http://localhost:3001/`
✅ **Correct:** `NEXT_PUBLIC_API_URL=http://localhost:3001`

❌ **Wrong:** `.env` file (will be committed to git)
✅ **Correct:** `.env.local` file (git ignored)

### Still Not Working?

1. Delete `.next` folder: `rm -rf .next`
2. Restart dev server
3. Check browser console for errors
4. Check Network tab in browser DevTools to see actual request URLs

