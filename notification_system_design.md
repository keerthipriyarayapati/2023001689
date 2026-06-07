# Stage 1

## Core Actions

1. Get Notifications
2. Get Notification By ID
3. Create Notification
4. Mark Notification As Read
5. Delete Notification
6. Get Unread Count
7. Filter Notifications By Type

## Common Headers

Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json

## GET /api/v1/notifications

Response

{
  "notifications": [
    {
      "id": "uuid",
      "title": "Placement Drive",
      "message": "TCS Hiring",
      "type": "Placement",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:30Z"
    }
  ]
}

## GET /api/v1/notifications/{id}

Response

{
  "id": "uuid",
  "title": "Placement Drive",
  "message": "TCS Hiring",
  "type": "Placement",
  "isRead": false,
  "createdAt": "2026-04-22T17:51:30Z"
}

## POST /api/v1/notifications

Request

{
  "studentId": 1042,
  "title": "Placement Drive",
  "message": "TCS Hiring",
  "type": "Placement"
}

Response

{
  "message": "Notification Created"
}

## PATCH /api/v1/notifications/{id}/read

Response

{
  "message": "Notification Marked As Read"
}

## DELETE /api/v1/notifications/{id}

Response

{
  "message": "Notification Deleted"
}

## GET /api/v1/notifications/unread/count

Response

{
  "count": 5
}

## GET /api/v1/notifications?type=Placement

Response

{
  "notifications": []
}

## Real-Time Notification Mechanism

Technology: WebSocket

Flow:

1. Client connects to WebSocket server.
2. New notification created.
3. Server pushes notification instantly.
4. Client updates UI without refresh.

# Stage 2

## Database

PostgreSQL

## Schema

CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    studentId INT,
    title VARCHAR(255),
    message TEXT,
    notificationType VARCHAR(20),
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id)
);

## Problems At Scale

1. Slow notification retrieval
2. Large table size
3. High concurrent requests

## Solutions

1. Indexing
2. Pagination
3. Archiving old notifications
4. Read replicas

## Indexes

CREATE INDEX idx_student_read
ON notifications(studentId,isRead);

CREATE INDEX idx_created_at
ON notifications(createdAt);

## Queries

-- Create Notification

INSERT INTO notifications
(id,studentId,title,message,notificationType)
VALUES
(uuid_generate_v4(),1042,'Placement Drive',
'TCS Hiring','Placement');

-- Get Notifications

SELECT *
FROM notifications
WHERE studentId=1042
ORDER BY createdAt DESC;

-- Get Notification By ID

SELECT *
FROM notifications
WHERE id='notification-id';

-- Mark As Read

UPDATE notifications
SET isRead=true
WHERE id='notification-id';

-- Delete Notification

DELETE FROM notifications
WHERE id='notification-id';

-- Filter By Type

SELECT *
FROM notifications
WHERE studentId=1042
AND notificationType='Placement';

-- Unread Count

SELECT COUNT(*)
FROM notifications
WHERE studentId=1042
AND isRead=false;

-- Pagination

SELECT *
FROM notifications
WHERE studentId=1042
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;

# Stage 3

## Is the Query Accurate?

Yes. The query correctly fetches unread notifications of a student ordered by creation time.

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

## Why Is It Slow?

The notifications table contains about 5,000,000 records.

Without proper indexes, the database scans a large number of rows before filtering and sorting the results.

## Improvements

Create a composite index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

Query remains:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

## Likely Computation Cost

Without index:

```text
O(N)
```

With index:

```text
O(log N)
```

---

## Should We Add Indexes On Every Column?

No.

Reasons:

1. Indexes consume storage.
2. Inserts and updates become slower.
3. Many indexes may never be used.
4. Indexes should be created only for frequently queried columns.

---

## Students Who Received Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```
# Stage 4

## Suggested Solutions

### 1. Pagination

Instead of loading all notifications, load only a limited number.

Example:

```http
GET /api/v1/notifications?page=1&limit=20
```

Tradeoff:

* Reduces DB load
* User must load additional pages

---

### 2. Caching

Store frequently accessed notifications in Redis.

Flow:

```text
Client -> Cache -> Database
```

Tradeoff:

* Faster response time
* Additional memory usage
* Cache invalidation required

---

### 3. Real-Time Notifications

Use WebSockets to push new notifications instead of fetching repeatedly.

Tradeoff:

* Reduces API calls
* Requires maintaining WebSocket connections

---

### 4. Database Indexing

Create indexes on frequently queried columns.

```sql
CREATE INDEX idx_student_read
ON notifications(studentID, isRead);
```

Tradeoff:

* Faster reads
* Slightly slower inserts and updates

---

### 5. Unread Count API

Fetch notification count separately.

```http
GET /api/v1/notifications/unread/count
```

Tradeoff:

* Faster page load
* Requires an additional API endpoint

# Stage 5

## Shortcomings

1. Processing is sequential and slow.
2. If email sending fails, some students never receive notifications.
3. No retry mechanism.
4. A single failure can interrupt the process.
5. Not suitable for 50,000 students.

---

## What If Email Failed For 200 Students?

Those students would not receive the email.

A retry mechanism is required to resend failed notifications.

---

## Reliable Design

1. Save notification to database first.
2. Push notification tasks to a queue.
3. Workers process emails and app notifications.
4. Failed jobs are retried automatically.

---

## Should Saving To DB And Sending Email Happen Together?

No.

Saving to DB and sending email should be separate.

Reason:

* Database save is fast and reliable.
* Email service may fail or be slow.
* Notifications remain stored even if email delivery fails.

---

## Revised Pseudocode

```text
function notify_all(student_ids, message):

    for student_id in student_ids:

        save_to_db(student_id, message)

        add_to_email_queue(student_id, message)

        add_to_app_queue(student_id, message)


worker email_worker:

    while queue_not_empty:

        try:
            send_email(student_id, message)

        catch error:
            retry_job()


worker app_worker:

    while queue_not_empty:

        push_to_app(student_id, message)
```
