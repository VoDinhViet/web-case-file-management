# Refresh Token Implementation

## 📋 Tổng quan

Hệ thống refresh token được implement ở **middleware level**, tự động làm mới access token trước khi token hết hạn.

## 🔑 Cơ chế hoạt động

### 1. Khi đăng nhập (`actions/auth.ts`)

```typescript
// Lưu 3 cookies:
- access_token: Token truy cập API
- refresh_token: Token để làm mới access token
- token_expiry: Thời gian hết hạn (timestamp)
```

### 2. Middleware tự động kiểm tra (`middleware.ts`)

Middleware chạy **trước mọi request** đến protected routes:

```typescript
// Kiểm tra:
1. Token có tồn tại không?
2. Token sắp hết hạn không? (còn < 5 phút)
3. Nếu có refresh_token → Tự động làm mới
4. Nếu refresh thất bại → Redirect về login
```

## 🚀 Ưu điểm

### ✅ Tự động và trong suốt
- User không cần làm gì
- Không cần update từng action file
- Token tự động refresh khi còn 5 phút

### ✅ Tập trung
- Logic refresh ở 1 chỗ duy nhất (middleware)
- Dễ maintain và debug
- Áp dụng cho toàn bộ app

### ✅ An toàn
- Cookies có httpOnly flag
- Secure flag cho production
- Tự động clear cookies khi refresh fail

## 📝 Chi tiết Implementation

### Login Flow

```
User login
    ↓
Backend trả về: { 
  accessToken: string,
  refreshToken: string,
  tokenExpires: number  // Timestamp (milliseconds)
}
    ↓
Calculate maxAge = (tokenExpires - Date.now()) / 1000 (seconds)
    ↓
Save cookies:
  - access_token (maxAge: calculated seconds)
  - refresh_token (maxAge: 7 days)
  - token_expiry (tokenExpires timestamp)
```

### Request Flow

```
User vào protected route
    ↓
Middleware kiểm tra token_expiry
    ↓
Còn < 5 phút?
    ├─ Yes → Call /api/v1/auth/refresh
    │         ├─ Success → Update cookies → Continue
    │         └─ Fail → Clear cookies → Redirect login
    └─ No → Continue bình thường
```

### Logout Flow

```
User logout
    ↓
Delete cookies:
  - access_token
  - refresh_token
  - token_expiry
```

## ⚙️ Cấu hình

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Cookie Settings

```typescript
{
  httpOnly: true,                           // Không truy cập từ JavaScript
  secure: false,                            // Cho phép HTTP (không bắt buộc HTTPS)
  sameSite: "lax",                          // CSRF protection
  maxAge: Math.floor((tokenExpires - Date.now()) / 1000)  // Convert to seconds
}

// Note: 
// - tokenExpires từ backend là timestamp (ms)
// - maxAge cookie cần giá trị là seconds
// - Phải convert: (tokenExpires - Date.now()) / 1000
```

### Thời gian

```typescript
Access Token: 
  - Backend config: tokenExpiresIn (VD: "15m", "1h")
  - Backend trả về: tokenExpires (timestamp milliseconds)
  - Frontend convert: maxAge (seconds) = (tokenExpires - now) / 1000
  
Refresh Token: 7 days

Token Refresh: Khi còn < 5 phút hết hạn
```

## 🔧 API Endpoint

Backend cần implement endpoints:

### Login
```
POST /api/v1/auth/login
Body: { username: string, password: string }
Response: {
  accessToken: string,
  refreshToken: string,
  tokenExpires: number  // Timestamp in milliseconds (Date.now() + ms(tokenExpiresIn))
}
```

### Refresh Token
```
POST /api/v1/auth/refresh
Body: { refreshToken: string }
Response: {
  accessToken: string,
  refreshToken: string,
  tokenExpires: number  // Timestamp in milliseconds
}
```

### Backend Implementation (NestJS example)
```typescript
// tokenExpires phải là timestamp (milliseconds), không phải seconds
const tokenExpiresIn = this.configService.get('auth.expires'); // VD: "15m"
const tokenExpires = Date.now() + ms(tokenExpiresIn); // Timestamp

return {
  accessToken,
  refreshToken,
  tokenExpires, // VD: 1734566400000
};
```

## 📊 Luồng xử lý lỗi

### Refresh thành công
```
Token refreshed → Update cookies → Continue request
```

### Refresh thất bại
```
Clear all cookies → Redirect to login → Query param: sessionExpired=true
```

### Token hết hạn mà không có refresh_token
```
Redirect to login → Query param: callbackUrl=<current_path>
```

## 🎯 Best Practices

### 1. Token Expiry Time
- Access token: 15-60 phút (balance giữa security và UX)
- Refresh token: 7-30 days
- Auto-refresh: 5 phút trước khi hết hạn

### 2. Security
- Luôn dùng httpOnly cookies
- Secure flag hiện đang tắt để hỗ trợ HTTP trong development
- Clear cookies khi logout hoặc refresh fail
- Không expose tokens trong localStorage/sessionStorage
- **Lưu ý**: Bật secure flag khi deploy production với HTTPS

### 3. Error Handling
- Hiển thị message "Phiên đăng nhập hết hạn" khi sessionExpired=true
- Redirect về callbackUrl sau khi login thành công
- Log errors để debug

## 🧪 Testing

### Test case 1: Token sắp hết hạn
```
1. Login
2. Set token_expiry = Date.now() + 4 * 60 * 1000 (4 phút)
3. Navigate to any protected route
4. Token should be auto-refreshed
```

### Test case 2: Refresh token hết hạn
```
1. Login
2. Delete refresh_token cookie
3. Set token_expiry = Date.now() + 1 * 60 * 1000 (1 phút)
4. Navigate to any protected route
5. Should redirect to login với sessionExpired=true
```

### Test case 3: Normal flow
```
1. Login
2. Navigate around app
3. Token should work normally
4. Auto-refresh khi còn < 5 phút
```

## 📱 Monitoring

Có thể thêm logging để monitor:

```typescript
// middleware.ts
if (expiryTime - now < fiveMinutes) {
  console.log(`[Token Refresh] Refreshing token for user`);
  // ...
}
```

## 🔍 Debug & Logging

### Console Logs

Middleware hiện đã có logging chi tiết để theo dõi quá trình refresh token:

#### 1. Mỗi request:
```
[Middleware] Request: {
  path: "/dashboard",
  hasAccessToken: true,
  hasRefreshToken: true,
  hasTokenExpiry: true,
  isAuthenticated: true
}
```

#### 2. Token check:
```
[Token Check] {
  path: "/dashboard",
  hasRefreshToken: true,
  hasTokenExpiry: true,
  minutesRemaining: 3,
  needsRefresh: true
}
```

#### 3. Khi refresh token:
```
[Token Refresh] Attempting to refresh token...
[API Call] Calling refresh token endpoint: {
  url: "http://localhost:3001/api/v1/auth/refresh",
  hasRefreshToken: true
}
[API Response] Refresh token response: {
  status: 200,
  ok: true
}
[API Response] Refresh successful: {
  hasAccessToken: true,
  hasRefreshToken: true,
  tokenExpires: 3600
}
[Token Refresh] ✅ Token refreshed successfully
```

#### 4. Khi refresh thất bại:
```
[Token Refresh] Attempting to refresh token...
[API Response] Refresh token response: {
  status: 401,
  ok: false
}
[API Response] Refresh failed: { message: "Invalid refresh token" }
[Token Refresh] ❌ Refresh failed - redirecting to login
```

#### 5. Warnings:
```
[Token Check] ⚠️ No refresh token found for path: /dashboard
[Token Check] ⚠️ No token expiry found for path: /dashboard
```

### Debugging Steps

Để debug, check:

1. **Console logs**: Xem terminal/console để theo dõi luồng refresh token
2. **Cookies trong DevTools**: Application → Cookies
   - `access_token`
   - `refresh_token`
   - `token_expiry`
3. **Network tab**: Request đến `/api/v1/auth/refresh`
4. **Redirect behavior**: Login với sessionExpired param

## 💡 Tips

- Middleware chỉ chạy cho routes match pattern trong `config.matcher`
- Không chạy cho static files, API routes, images
- Token refresh là **silent** - user không thấy gì
- Nếu backend trả lỗi 401 ở API call, có thể là do token vừa hết hạn giữa request

