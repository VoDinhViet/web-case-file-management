# 🔔 Firebase Push Notification - Quick Start

## Cài đặt Firebase package

```bash
npm install firebase
```

## Cấu hình Environment Variables

Tạo file `.env.local` và thêm các biến sau:

```env
# Firebase Configuration (lấy từ Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# VAPID Key (lấy từ Firebase Console > Cloud Messaging > Web Push certificates)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BKGm...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Cập nhật Service Worker

Mở file `public/firebase-messaging-sw.js` và thay thế config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",           // Thay bằng key của bạn
  authDomain: "YOUR_AUTH_DOMAIN",   // Thay bằng auth domain của bạn
  projectId: "YOUR_PROJECT_ID",     // Thay bằng project ID của bạn
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

## Các file đã được tạo

### 1. Core Files
- ✅ `lib/firebase.ts` - Firebase initialization
- ✅ `lib/utils/notification.ts` - Notification utilities
- ✅ `public/firebase-messaging-sw.js` - Service worker

### 2. Hooks
- ✅ `hooks/use-fcm-token.ts` - Hook để lấy FCM token
- ✅ `hooks/use-notification.ts` - Hook để listen notifications

### 3. Components
- ✅ `components/providers/notification-provider.tsx` - Provider (đã thêm vào layout)
- ✅ `components/notification-permission-button.tsx` - Button xin quyền (đã thêm vào header)

### 4. Server Actions
- ✅ `actions/notification.ts` - Server action gửi token lên backend

## Cách sử dụng

### 1. User bật thông báo
- Click vào icon 🔔 trên header
- Chấp nhận permission trong browser
- FCM token tự động gửi lên backend

### 2. Backend gửi thông báo
Backend NestJS gửi payload như sau:

```typescript
{
  "notification": {
    "title": "Cập nhật vụ án",
    "body": "Vụ án #123 đã được cập nhật"
  },
  "data": {
    "caseId": "123",
    "url": "/cases/123"
  },
  "token": "user_fcm_token"
}
```

### 3. User nhận thông báo
- **Foreground**: Toast notification + browser notification
- **Background**: Browser notification
- Click vào notification → navigate to URL

## Testing

### Test từ Firebase Console
1. Vào Firebase Console > Cloud Messaging
2. Click "Send test message"
3. Paste FCM token (xem trong console log)
4. Send!

### Kiểm tra setup
1. Mở browser console
2. Click icon 🔔 trên header
3. Chấp nhận permission
4. Xem FCM token trong console
5. Token đã được gửi lên backend

## Troubleshooting

### Không nhận được thông báo?
- ✅ Check permission: `Notification.permission === "granted"`
- ✅ Check service worker: DevTools > Application > Service Workers
- ✅ Check FCM token đã được gửi lên backend
- ✅ Check HTTPS (production yêu cầu HTTPS)

### VAPID key error?
- ✅ Đảm bảo VAPID key đã được thêm vào `.env.local`
- ✅ Restart dev server

### Service worker không load?
- ✅ Hard reload: Ctrl+Shift+R
- ✅ Clear cache
- ✅ Check file `firebase-messaging-sw.js` ở đúng path `public/`

## Backend Integration

Backend NestJS cần có endpoint:

```
PUT /fcm-token
Body: { "fcmToken": "..." }
```

Frontend sử dụng **Server Action** (`actions/notification.ts`) để gửi token lên backend.

Chi tiết xem thêm tại: [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)

---

**Note**: Đây là setup cho frontend. Backend NestJS đã có sẵn logic gửi notification.

