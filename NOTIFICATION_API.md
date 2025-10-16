# 🔔 Notification API Integration

## 📋 Tổng quan

Hệ thống notification đã được tích hợp đầy đủ với backend API, bao gồm:
- ✅ FCM token registration
- ✅ Get notifications list (với pagination)
- ✅ Get unread count
- ✅ Mark as read (single & all)
- ✅ Delete notifications (single & all)

---

## 🎯 API Endpoints

### 1. Register FCM Token
```typescript
POST /api/v1/users/fcm-token
Body: { fcmToken: string }
```

### 2. Get Notifications
```typescript
GET /api/v1/notifications?page=1&limit=10&isRead=false&type=case
```

### 3. Get Unread Count
```typescript
GET /api/v1/notifications/unread/count
Response: { count: number }
```

### 4. Mark as Read
```typescript
PATCH /api/v1/notifications/{id}/read
```

### 5. Mark All as Read
```typescript
PATCH /api/v1/notifications/read-all
```

### 6. Delete Notification
```typescript
DELETE /api/v1/notifications/{id}
```

### 7. Delete All Notifications
```typescript
DELETE /api/v1/notifications
```

---

## 📁 File Structure

```
actions/
  └── notification.ts          # Server actions cho notification API

hooks/
  ├── use-notification.ts      # Firebase foreground notification listener
  ├── use-fcm-token.ts        # FCM token management
  └── use-notifications-api.ts # Hook để call notification APIs

components/
  ├── notification-list.tsx    # Dropdown notification list UI
  ├── notification-permission-button.tsx
  └── providers/
      └── notification-provider.tsx
```

---

## 🚀 Usage

### 1. Sử dụng Hook

```typescript
"use client";

import { useNotificationsAPI } from "@/hooks/use-notifications-api";

export function MyComponent() {
  const {
    notifications,      // Array of notifications
    unreadCount,        // Number of unread
    loading,            // Loading state
    pagination,         // Pagination info
    fetchNotifications, // Refresh notifications
    markAsRead,         // Mark one as read
    markAllAsRead,      // Mark all as read
    deleteNotification, // Delete one
    deleteAllNotifications, // Delete all
  } = useNotificationsAPI();

  return (
    <div>
      <h1>Thông báo ({unreadCount})</h1>
      {notifications.map(notif => (
        <div key={notif.id}>
          <p>{notif.title}</p>
          <button onClick={() => markAsRead(notif.id)}>
            Đánh dấu đã đọc
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. Sử dụng Component

```typescript
import { NotificationList } from "@/components/notification-list";

export function Header() {
  return (
    <header>
      {/* Other header items */}
      <NotificationList />
    </header>
  );
}
```

### 3. Sử dụng Server Actions

```typescript
"use server";

import {
  registerFCMToken,
  getNotifications,
  markAsRead,
} from "@/actions/notification";

// Register FCM token
await registerFCMToken("fcm_token_here");

// Get notifications
const { data, pagination } = await getNotifications({
  page: 1,
  limit: 20,
  isRead: false,
});

// Mark as read
await markAsRead("notification_id");
```

---

## 📊 Data Types

### Notification Interface

```typescript
interface Notification {
  id: string;
  title: string;
  body: string;
  type?: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
```

### Search Params

```typescript
interface NotificationSearchParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}
```

---

## 🎨 NotificationList Component Features

### ✨ Features:
- ✅ Badge hiển thị số lượng unread
- ✅ Dropdown menu với scroll
- ✅ Mark as read (single & all)
- ✅ Delete notification (single & all)
- ✅ Navigate đến URL khi click notification
- ✅ Hover actions (mark read, delete)
- ✅ Timestamp với format tiếng Việt
- ✅ Empty state
- ✅ Loading state

### 🎯 UI Elements:
```
┌─ Header ──────────────────────────────┐
│  Thông báo [2 mới] [✓✓] [🗑]          │
├───────────────────────────────────────┤
│  ┌─ Notification Item ──────────────┐ │
│  │  • Tiêu đề thông báo             │ │
│  │    Chi tiết thông báo...         │ │
│  │    2 giờ trước            [✓][✗] │ │
│  └──────────────────────────────────┘ │
│  ┌─ Notification Item (unread) ─────┐ │
│  │  🔵 Tiêu đề thông báo mới        │ │
│  │    Chi tiết...                   │ │
│  │    30 phút trước          [✓][✗] │ │
│  └──────────────────────────────────┘ │
├───────────────────────────────────────┤
│  [   Xem tất cả thông báo   ]        │
└───────────────────────────────────────┘
```

---

## 🔄 Auto Refresh

Hook tự động fetch notifications và unread count khi mount:

```typescript
useEffect(() => {
  fetchNotifications();
  fetchUnreadCount();
}, []);
```

Bạn có thể trigger manual refresh:

```typescript
const { fetchNotifications, fetchUnreadCount } = useNotificationsAPI();

// Refresh notifications
await fetchNotifications({ page: 1, limit: 10 });

// Refresh unread count
await fetchUnreadCount();
```

---

## 🎨 Customization

### Custom Notification Item

```typescript
{notifications.map((notif) => (
  <div key={notif.id} className={!notif.isRead ? "bg-blue-50" : ""}>
    <h3>{notif.title}</h3>
    <p>{notif.body}</p>
    <small>
      {formatDistanceToNow(new Date(notif.createdAt), {
        addSuffix: true,
        locale: vi,
      })}
    </small>
  </div>
))}
```

### Filter Notifications

```typescript
// Chỉ lấy unread
await fetchNotifications({ isRead: false });

// Lấy by type
await fetchNotifications({ type: "case_update" });

// Pagination
await fetchNotifications({ page: 2, limit: 20 });
```

---

## 🔐 Authentication

Tất cả API calls đều tự động include access token từ cookies:

```typescript
const cookieStore = await cookies();
const accessToken = cookieStore.get("access_token")?.value;

await api.get("/api/v1/notifications", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

---

## 🎯 Integration với Refresh Token

API notifications tự động hoạt động với hệ thống refresh token:

- ✅ Middleware tự động refresh token khi còn < 15 phút
- ✅ API calls luôn dùng token mới nhất
- ✅ Không cần lo về token expiry

---

## 📱 Firebase Integration

### FCM Token Registration

```typescript
import { useFCMToken } from "@/hooks/use-fcm-token";
import { registerFCMToken } from "@/actions/notification";

function MyApp() {
  const { token } = useFCMToken();

  useEffect(() => {
    if (token) {
      // Auto-register token with backend
      registerFCMToken(token);
    }
  }, [token]);
}
```

### Foreground Notifications

```typescript
import { useNotification } from "@/hooks/use-notification";

function MyComponent() {
  const { lastNotification, notifications } = useNotification();

  useEffect(() => {
    if (lastNotification) {
      // Show toast or update UI
      toast(lastNotification.notification.title, {
        description: lastNotification.notification.body,
      });
    }
  }, [lastNotification]);
}
```

---

## 🧪 Testing

### Test Notifications

```typescript
// Mock notification data
const mockNotifications = [
  {
    id: "1",
    title: "Vụ án mới",
    body: "Bạn có vụ án mới được phân công",
    type: "case_assigned",
    isRead: false,
    data: { url: "/cases/123" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

### Test Actions

```bash
# Test get notifications
curl http://localhost:3001/api/v1/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test mark as read
curl -X PATCH http://localhost:3001/api/v1/notifications/123/read \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test unread count
curl http://localhost:3001/api/v1/notifications/unread/count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎓 Best Practices

### 1. **Polling vs Real-time**
```typescript
// Option 1: Polling (current)
useEffect(() => {
  const interval = setInterval(() => {
    fetchUnreadCount();
  }, 30000); // Every 30s

  return () => clearInterval(interval);
}, []);

// Option 2: Firebase Real-time (recommended)
// Already setup with useNotification hook
```

### 2. **Optimistic Updates**
```typescript
async function handleMarkAsRead(id: string) {
  // Update UI immediately
  setNotifications(prev =>
    prev.map(n => n.id === id ? { ...n, isRead: true } : n)
  );

  // Then sync with backend
  await markAsRead(id);
}
```

### 3. **Error Handling**
```typescript
try {
  await markAsRead(id);
  toast.success("Đã đánh dấu đã đọc");
} catch (error) {
  toast.error("Có lỗi xảy ra");
  // Revert optimistic update
}
```

---

## 🔧 Backend Requirements

Backend cần implement các endpoints:

```typescript
// 1. Register FCM token
PATCH /api/v1/users/fcm-token
Body: { fcmToken: string }

// 2. Get notifications
GET /api/v1/notifications?page=1&limit=10
Response: {
  data: Notification[],
  pagination: { page, limit, total, totalPages }
}

// 3. Unread count
GET /api/v1/notifications/unread/count
Response: { count: number }

// 4. Mark as read
PATCH /api/v1/notifications/:id/read

// 5. Mark all as read
PATCH /api/v1/notifications/read-all

// 6. Delete notification
DELETE /api/v1/notifications/:id

// 7. Delete all
DELETE /api/v1/notifications
```

---

## 📝 Summary

✅ **Complete API Integration**
- 7 endpoints fully integrated
- Type-safe with TypeScript
- Auto token refresh support

✅ **Easy to Use Hooks**
- `useNotificationsAPI()` - Full API access
- `useNotification()` - Firebase foreground
- `useFCMToken()` - Token management

✅ **Beautiful UI Component**
- Dropdown notification list
- Mark as read/delete actions
- Empty & loading states
- Vietnamese date format

✅ **Production Ready**
- Error handling
- Toast notifications
- Optimistic updates
- Proper TypeScript types

Giờ bạn có thể sử dụng `<NotificationList />` component trong Header! 🎉

