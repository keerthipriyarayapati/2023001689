# Stage 1

## Notification System REST API Design

### Core Actions Supported

1. Create Notification
2. Get All Notifications
3. Get Notification By ID
4. Mark Notification As Read
5. Delete Notification
6. Filter Notifications By Type
7. Get Unread Notifications Count

---

## Common Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 1. Create Notification

### Endpoint

```http
POST /api/notifications
```

### Request Body

```json
{
  "title": "Placement Drive",
  "message": "TCS placement drive scheduled on Friday",
  "type": "placement",
  "priority": "high",
  "recipientId": "user123"
}
```

### Response

```json
{
  "success": true,
  "notificationId": "n101",
  "message": "Notification created successfully"
}
```

---

## 2. Get All Notifications

### Endpoint

```http
GET /api/notifications
```

### Response

```json
{
  "success": true,
  "notifications": [
    {
      "id": "n101",
      "title": "Placement Drive",
      "message": "TCS placement drive scheduled on Friday",
      "type": "placement",
      "priority": "high",
      "isRead": false,
      "createdAt": "2026-06-07T10:00:00Z"
    }
  ]
}
```

---

## 3. Get Notification By ID

### Endpoint

```http
GET /api/notifications/{id}
```

### Response

```json
{
  "success": true,
  "notification": {
    "id": "n101",
    "title": "Placement Drive",
    "message": "TCS placement drive scheduled on Friday",
    "type": "placement",
    "priority": "high",
    "isRead": false
  }
}
```

---

## 4. Mark Notification As Read

### Endpoint

```http
PATCH /api/notifications/{id}/read
```

### Request Body

```json
{
  "isRead": true
}
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

### Endpoint

```http
DELETE /api/notifications/{id}
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 6. Filter Notifications

### Endpoint

```http
GET /api/notifications?type=placement
```

### Response

```json
{
  "success": true,
  "notifications": []
}
```

---

## 7. Get Unread Notifications Count

### Endpoint

```http
GET /api/notifications/unread/count
```

### Response

```json
{
  "success": true,
  "unreadCount": 5
}
```

---

# JSON Notification Schema

```json
{
  "id": "string",
  "title": "string",
  "message": "string",
  "type": "event | placement | result | general",
  "priority": "low | medium | high",
  "recipientId": "string",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

# Real-Time Notification Mechanism

The system uses WebSockets for real-time notification delivery.

## Flow

1. User logs in.
2. Client establishes WebSocket connection.
3. Backend stores active connection.
4. When a new notification is created, backend pushes notification instantly.
5. Frontend updates notification panel without page refresh.

### WebSocket Endpoint

```http
ws://localhost:3000/ws/notifications
```

### Real-Time Message Format

```json
{
  "event": "NEW_NOTIFICATION",
  "data": {
    "id": "n101",
    "title": "Placement Drive",
    "message": "TCS placement drive scheduled on Friday",
    "priority": "high"
  }
}
```
