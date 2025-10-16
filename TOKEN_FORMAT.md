# 🔄 Token Format - Frontend & Backend Contract

## 📋 Overview

Document này mô tả format dữ liệu token giữa Backend (NestJS) và Frontend (Next.js).

---

## 🎯 Backend Implementation

### Token Creation (NestJS)

```typescript
private async createToken(data: {
  id: string;
  sessionId: string;
  role: RoleEnum;
  hash: string;
}): Promise<Token> {
  // Config: "15m", "1h", "30m", etc.
  const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
    infer: true,
  });
  
  // ✅ CRITICAL: tokenExpires phải là TIMESTAMP (milliseconds)
  const tokenExpires = Date.now() + ms(tokenExpiresIn);
  
  console.log('tokenExpiresIn', tokenExpiresIn, 'tokenExpires', tokenExpires);
  // Output: tokenExpiresIn 15m tokenExpires 1734566400000

  const [accessToken, refreshToken] = await Promise.all([
    await this.jwtService.signAsync(
      {
        id: data.id,
        role: data.role,
        sessionId: data.sessionId,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    ),
    await this.jwtService.signAsync(
      {
        sessionId: data.sessionId,
        hash: data.hash,
      },
      {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
          infer: true,
        }),
      },
    ),
  ]);
  
  return {
    accessToken,
    refreshToken,
    tokenExpires, // ✅ Timestamp in milliseconds
  } as unknown as Token;
}
```

### API Response Format

```typescript
// Login endpoint: POST /api/v1/auth/login
Response: {
  accessToken: string;      // JWT token
  refreshToken: string;     // JWT refresh token
  tokenExpires: number;     // ✅ Timestamp in milliseconds (1734566400000)
}

// Refresh endpoint: POST /api/v1/auth/refresh
Response: {
  accessToken: string;      // New JWT token
  refreshToken: string;     // New JWT refresh token
  tokenExpires: number;     // ✅ Timestamp in milliseconds
}
```

---

## 🎨 Frontend Implementation

### Token Reception (Next.js)

```typescript
// actions/auth.ts
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number; // ✅ Timestamp in milliseconds
}

export async function login(rawData: LoginFormData): Promise<LoginResult> {
  const result = await api.post<LoginResponse>("/api/v1/auth/login", rawData);

  const cookieStore = await cookies();

  // ✅ tokenExpires từ backend đã là timestamp (milliseconds)
  const expiryTime = result.tokenExpires; // VD: 1734566400000
  
  // ✅ Convert sang seconds cho cookie maxAge
  const maxAgeSeconds = Math.floor((expiryTime - Date.now()) / 1000);
  
  // Set cookies
  cookieStore.set("access_token", result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: maxAgeSeconds, // ✅ Seconds
  });
  
  // Store timestamp for middleware check
  cookieStore.set("token_expiry", expiryTime.toString(), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: maxAgeSeconds,
  });
}
```

### Token Check in Middleware

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const tokenExpiry = request.cookies.get("token_expiry")?.value;
  
  if (tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry, 10); // Parse timestamp
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    // Check if need refresh
    if (expiryTime - now < fiveMinutes) {
      // Refresh token...
    }
  }
}
```

---

## 📊 Data Flow

```
┌─────────────┐           ┌─────────────┐
│   Backend   │           │  Frontend   │
│  (NestJS)   │           │  (Next.js)  │
└──────┬──────┘           └──────┬──────┘
       │                         │
       │  1. Login Request       │
       │◄────────────────────────┤
       │                         │
       │  tokenExpiresIn = "15m" │
       │  tokenExpires =         │
       │  Date.now() + ms("15m") │
       │  = 1734566400000        │
       │                         │
       │  2. Response:           │
       │  {                      │
       │    accessToken,         │
       │    refreshToken,        │
       │    tokenExpires:        │
       │    1734566400000 ──────►│
       │  }                      │
       │                         │
       │                         │  3. Process:
       │                         │  expiryTime = 1734566400000
       │                         │  maxAge = (expiry - now) / 1000
       │                         │  = 900 seconds
       │                         │
       │                         │  4. Set Cookies:
       │                         │  - access_token (maxAge: 900s)
       │                         │  - token_expiry ("1734566400000")
       │                         │
       │  5. Middleware Check    │
       │                         │  tokenExpiry = "1734566400000"
       │                         │  if (expiry - now < 5min)
       │                         │    → Refresh token
       │                         │
       │  6. Refresh Request     │
       │◄────────────────────────┤
       │                         │
       │  7. New tokenExpires    │
       │  = Date.now() + ms()    │
       │  = 1734567300000 ──────►│
       │                         │
       │                         │  8. Update cookies with
       │                         │     new tokenExpires
       │                         │
```

---

## ✅ Critical Points

### 1. **Backend MUST return timestamp**
```typescript
// ✅ CORRECT
const tokenExpires = Date.now() + ms(tokenExpiresIn);
return { accessToken, refreshToken, tokenExpires }; // 1734566400000

// ❌ WRONG
return { accessToken, refreshToken, expiresIn: 900 }; // seconds
```

### 2. **Frontend MUST convert to seconds for cookie**
```typescript
// ✅ CORRECT
const maxAgeSeconds = Math.floor((tokenExpires - Date.now()) / 1000);
cookieStore.set("access_token", token, { maxAge: maxAgeSeconds });

// ❌ WRONG
cookieStore.set("access_token", token, { maxAge: tokenExpires }); // Too large!
```

### 3. **Middleware checks timestamp directly**
```typescript
// ✅ CORRECT
const expiryTime = parseInt(tokenExpiry, 10); // Parse timestamp
if (expiryTime - Date.now() < fiveMinutes) { ... }

// ❌ WRONG
if (expiryTime < fiveMinutes) { ... } // Comparing different units!
```

---

## 🧪 Example Values

### Backend Config
```env
AUTH_EXPIRES=15m
AUTH_REFRESH_EXPIRES=7d
```

### Backend Calculation
```typescript
const tokenExpiresIn = "15m"
const tokenExpires = Date.now() + ms("15m")

// If now = 1734565500000
// Then tokenExpires = 1734565500000 + 900000 = 1734566400000
```

### Frontend Processing
```typescript
// Receive from backend
tokenExpires = 1734566400000

// Calculate maxAge for cookie
maxAgeSeconds = Math.floor((1734566400000 - 1734565500000) / 1000)
              = Math.floor(900000 / 1000)
              = 900 seconds

// Set cookie
cookieStore.set("access_token", token, { maxAge: 900 })
```

### Middleware Check
```typescript
// Read from cookie
tokenExpiry = "1734566400000"
expiryTime = parseInt("1734566400000", 10) = 1734566400000

// Check remaining time
now = Date.now() = 1734566100000
timeRemaining = 1734566400000 - 1734566100000 = 300000 ms = 5 minutes
minutesRemaining = Math.floor(300000 / 1000 / 60) = 5

// Need refresh?
fiveMinutes = 5 * 60 * 1000 = 300000
if (timeRemaining < fiveMinutes) { // 300000 < 300000 = false
  // Don't refresh yet
}
```

---

## 🐛 Common Mistakes

### Mistake 1: Backend returns seconds instead of timestamp
```typescript
// ❌ WRONG
return { tokenExpires: 900 } // Only 900ms = 0.9 seconds!

// ✅ CORRECT
return { tokenExpires: Date.now() + ms(tokenExpiresIn) }
```

### Mistake 2: Frontend doesn't convert for cookie
```typescript
// ❌ WRONG
cookieStore.set("token", token, { maxAge: tokenExpires })
// Cookie will last 1734566400000 seconds = 55 years!

// ✅ CORRECT
cookieStore.set("token", token, { 
  maxAge: Math.floor((tokenExpires - Date.now()) / 1000)
})
```

### Mistake 3: Comparing different time units
```typescript
// ❌ WRONG
if (expiryTime < 5 * 60 * 1000) { ... } // Comparing timestamp with milliseconds

// ✅ CORRECT
if (expiryTime - Date.now() < 5 * 60 * 1000) { ... }
```

---

## 📝 Type Definitions

### Backend (NestJS)
```typescript
interface Token {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number; // Timestamp in milliseconds
}
```

### Frontend (Next.js)
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number; // Timestamp in milliseconds
}
```

---

## 🎓 Summary

| Aspect | Backend (NestJS) | Frontend (Next.js) |
|--------|------------------|-------------------|
| **Config** | `tokenExpiresIn: "15m"` | N/A |
| **Calculation** | `Date.now() + ms("15m")` | N/A |
| **API Response** | `tokenExpires: 1734566400000` (ms) | Receive timestamp |
| **Cookie maxAge** | N/A | `(tokenExpires - now) / 1000` (s) |
| **Storage** | N/A | `token_expiry: "1734566400000"` |
| **Check** | N/A | `parseInt(token_expiry)` → timestamp |
| **Comparison** | N/A | `expiryTime - Date.now() < 5min` |

**Key Takeaway**: 
- Backend trả về **timestamp (milliseconds)** 
- Frontend convert sang **seconds** cho cookie maxAge
- Frontend lưu **timestamp** để check expiry

