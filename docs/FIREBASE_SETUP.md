# Firebase Cloud Messaging Setup

Hướng dẫn cấu hình Firebase Cloud Messaging để nhận thông báo push.

## 1. Cài đặt Dependencies

```bash
npm install firebase
```

## 2. Cấu hình Firebase

### 2.1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Thêm Web App vào project

### 2.2. Lấy Firebase Configuration

1. Vào **Project Settings** > **General**
2. Scroll xuống phần **Your apps**
3. Copy Firebase configuration

### 2.3. Lấy VAPID Key

1. Vào **Project Settings** > **Cloud Messaging**
2. Scroll xuống **Web Push certificates**
3. Click **Generate key pair** (nếu chưa có)
4. Copy key pair

### 2.4. Cấu hình Environment Variables

Tạo file `.env.local` và thêm các biến sau:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Cloud Messaging VAPID Key
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BKGm...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 3. Cập nhật Service Worker

Mở file `public/firebase-messaging-sw.js` và cập nhật Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

## 4. Thêm NotificationProvider vào Layout

Mở `app/layout.tsx` và wrap app với `NotificationProvider`:

```tsx
import { NotificationProvider } from "@/components/providers/notification-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

## 5. Thêm Notification Button

Thêm button vào header hoặc settings page:

```tsx
import { NotificationPermissionButton } from "@/components/notification-permission-button";

export function Header() {
  return (
    <header>
      <NotificationPermissionButton 
        variant="outline" 
        size="icon" 
        showLabel={false}
      />
    </header>
  );
}
```

## 6. Sử dụng Hooks

### 6.1. useFCMToken

```tsx
import { useFCMToken } from "@/hooks/use-fcm-token";

function MyComponent() {
  const { token, permission, requestPermissionAndToken } = useFCMToken();

  const handleEnableNotifications = async () => {
    await requestPermissionAndToken();
  };

  return (
    <button onClick={handleEnableNotifications}>
      Enable Notifications
    </button>
  );
}
```

### 6.2. useNotification

```tsx
import { useNotification } from "@/hooks/use-notification";

function MyComponent() {
  const { lastNotification, notifications } = useNotification();

  useEffect(() => {
    if (lastNotification) {
      console.log("New notification:", lastNotification);
    }
  }, [lastNotification]);

  return <div>Total notifications: {notifications.length}</div>;
}
```

## 7. Backend Integration

Backend NestJS cần có endpoint để nhận FCM token:

```typescript
// PUT /fcm-token
{
  "fcmToken": "fcm_token_here"
}
```

Frontend sử dụng Server Action để gửi token lên backend (xem `actions/notification.ts`).

Cập nhật URL backend trong `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 8. Testing

### 8.1. Test Local

1. Start dev server: `npm run dev`
2. Mở browser (Chrome/Firefox)
3. Click vào notification button
4. Chấp nhận permission
5. Check console log để xem FCM token

### 8.2. Send Test Notification từ Firebase Console

1. Vào **Firebase Console** > **Cloud Messaging**
2. Click **Send your first message**
3. Nhập title và body
4. Chọn **Send test message**
5. Paste FCM token và click **Test**

### 8.3. Send Notification từ Backend

Backend NestJS sẽ gửi notification với payload:

```json
{
  "notification": {
    "title": "Cập nhật vụ án",
    "body": "Vụ án #123 đã được cập nhật",
    "icon": "/favicon.ico"
  },
  "data": {
    "caseId": "123",
    "url": "/cases/123"
  },
  "token": "user_fcm_token_here"
}
```

## 9. Troubleshooting

### Không nhận được thông báo

1. Kiểm tra permission: `Notification.permission === "granted"`
2. Kiểm tra service worker đã đăng ký: Check DevTools > Application > Service Workers
3. Kiểm tra FCM token đã được gửi lên backend
4. Kiểm tra console log có error không

### Service Worker không load

1. Đảm bảo file `firebase-messaging-sw.js` ở trong `public/`
2. Clear cache và hard reload (Ctrl+Shift+R)
3. Kiểm tra network tab, file `.js` phải load thành công

### VAPID key error

1. Đảm bảo VAPID key đúng format (bắt đầu với `B`)
2. Đảm bảo đã add VAPID key vào `.env.local`
3. Restart dev server sau khi thêm env variables

## 10. Production Deployment

1. Cập nhật Firebase config trong `firebase-messaging-sw.js` với production values
2. Đảm bảo tất cả environment variables đã được set
3. Enable HTTPS (Firebase Messaging yêu cầu HTTPS)
4. Test thoroughly trước khi release

## Tài liệu tham khảo

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Next.js with Firebase](https://firebase.google.com/docs/web/setup#next.js)
- [Web Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

