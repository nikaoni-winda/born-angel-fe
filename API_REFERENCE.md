# Born Angel API - Endpoint Reference

Complete API endpoint documentation for frontend integration.

## Base URL
```
http://127.0.0.1:8000/api
```

---

## 🔓 Public Endpoints (No Auth Required)

### Authentication

#### Register
```
POST /register
Body: {
  name: string,
  email: string,
  password: string,
  phone_number: string
}
Response: {
  message: string,
  user: User
}
```

#### Login
```
POST /login
Body: {
  email: string,
  password: string
}
Response: {
  message: string,
  access_token: string,
  user: User (with instructor relation if role=instructor)
}
```

### Services

#### Get All Services
```
GET /services
Response: Service[]
```

#### Get Service by ID
```
GET /services/{id}
Response: Service
```

### Instructors

#### Get All Instructors
```
GET /instructors
Response: Instructor[] (with user relation)
```

#### Get Instructor by ID
```
GET /instructors/{id}
Response: Instructor (with user relation)
```

### Schedules (Context-Aware)

#### Get Schedules
```
GET /schedules?instructor_id={id}
Query Params:
  - instructor_id (optional): Filter by instructor

Context-Aware Behavior:
  - Public/User: Only upcoming schedules
  - Instructor (authenticated): Only own schedules (past & future)
  - Admin (authenticated): All schedules

Response: Schedule[] (with service, instructor.user relations)
```

#### Get Schedule by ID
```
GET /schedules/{id}
Response: Schedule (with service, instructor relations)
```

### Reviews (Context-Aware)

#### Get Reviews
```
GET /reviews?instructor_id={id}
Query Params:
  - instructor_id (optional): Filter by instructor

Context-Aware Behavior:
  - Public/User/Admin: All reviews
  - Instructor (authenticated): Only reviews for own classes

Response: Review[] (with booking.user, booking.schedule.service relations)
Note: Limited to 20 latest reviews
```

---

## 🔐 Authenticated Endpoints (Requires Token)

**Header Required:**
```
Authorization: Bearer {token}
```

### Profile Management (All Roles)

#### Get My Profile
```
GET /profile
Response: User (with instructor relation if role=instructor)
```

#### Update My Profile
```
PUT /profile
Body: {
  name: string (optional),
  phone_number: string (optional)
}
Response: User
```

#### Delete My Account
```
DELETE /profile
Response: { message: string }
```

#### Logout
```
POST /logout
Response: { message: string }
```

---

## 👤 User/Customer Endpoints

### Bookings

#### Get My Bookings
```
GET /bookings
Context-Aware:
  - User: Own bookings only
  - Admin: All bookings

Response: Booking[] (with schedule.service, schedule.instructor, payment relations)
```

#### Create Booking
```
POST /bookings
Body: {
  schedule_id: number
}
Response: Booking (creates payment record automatically)
```

#### Cancel Booking
```
POST /bookings/{id}/cancel
Authorization:
  - User: Can cancel own booking
  - Admin: Can cancel any booking

Response: { message: string, booking: Booking }
```

### Reviews

#### Create Review
```
POST /reviews
Body: {
  booking_id: number,
  rating: number (1-5),
  comment: string (optional)
}
Validation:
  - Must own the booking
  - Class must be finished (end_time < now)
  - No duplicate reviews

Response: Review
```

#### Update Review
```
PUT /reviews/{id}
Body: {
  rating: number (1-5) (optional),
  comment: string (optional)
}
Authorization: Owner only

Response: Review
```

#### Delete Review
```
DELETE /reviews/{id}
Authorization:
  - User: Can delete own review
  - Admin: Can delete any review

Response: { message: string }
```

---

## 🔧 Admin & Super Admin Endpoints

**Middleware:** `role:admin,super_admin`

### User Management

#### Get All Users
```
GET /users?role={role}
Query Params:
  - role (optional): Filter by role (user, instructor, admin, super_admin)

Response: User[]
```

#### Get User by ID
```
GET /users/{id}
Response: User
```

#### Create User
```
POST /users
Body: {
  name: string,
  email: string,
  password: string,
  phone_number: string,
  role: string (admin, instructor, super_admin)
}
Hierarchy:
  - Admin: Can create admin, instructor
  - Super Admin: Can create any role

Response: User
```

#### Update User
```
PUT /users/{id}
Body: {
  name: string (optional),
  email: string (optional),
  phone_number: string (optional),
  role: string (optional),
  password: string (optional)
}
Hierarchy:
  - Master Account (ID 1): Protected
  - Admin: Cannot edit super_admin
  - Admin: Cannot promote to super_admin

Response: User
```

#### Delete User
```
DELETE /users/{id}
Hierarchy:
  - Master Account (ID 1): Protected
  - Admin: Cannot delete super_admin
  - Admin: Cannot delete self

Response: { message: string }
```

### Service Management

#### Create Service
```
POST /services
Body: {
  name: string,
  description_id: string,
  description_en: string,
  price: number,
  duration_minutes: number,
  image: string (optional)
}
Response: Service
```

#### Update Service
```
PUT /services/{id}
Body: Same as create (all optional)
Response: Service
```

#### Delete Service
```
DELETE /services/{id}
Response: { message: string }
Note: Soft delete
```

### Instructor Management

#### Create Instructor Profile
```
POST /instructors
Body: {
  user_id: number,
  service_id: number,
  bio_id: string,
  bio_en: string,
  photo: string (optional)
}
Response: Instructor
```

#### Update Instructor Profile
```
PUT /instructors/{id}
Body: Same as create (all optional)
Response: Instructor
```

#### Delete Instructor Profile
```
DELETE /instructors/{id}
Response: { message: string }
Note: Soft delete
```

### Schedule Management

#### Create Schedule
```
POST /schedules
Body: {
  service_id: number,
  instructor_id: number,
  start_time: datetime,
  end_time: datetime,
  total_capacity: number
}
Validation:
  - Prevents instructor double booking (time overlap)
  - Validates time logic

Response: Schedule
```

#### Update Schedule
```
PUT /schedules/{id}
Body: Same as create (all optional)
Validation:
  - Capacity cannot be reduced below current bookings
  - Re-checks time overlaps

Response: Schedule
```

#### Delete Schedule
```
DELETE /schedules/{id}
Validation:
  - Cannot delete if active bookings exist

Response: { message: string }
Note: Soft delete
```

---

## 📊 Model Structures

### User
```javascript
{
  id: number,
  name: string,
  email: string,
  phone_number: string,
  role: 'user' | 'instructor' | 'admin' | 'super_admin',
  email_verified_at: datetime | null,
  created_at: datetime,
  updated_at: datetime,
  instructor: Instructor | null  // Only if role=instructor
}
```

### Service
```javascript
{
  id: number,
  name: string,
  description_id: string,
  description_en: string,
  price: number,
  duration_minutes: number,
  image: string | null,
  created_at: datetime,
  updated_at: datetime,
  deleted_at: datetime | null
}
```

### Instructor
```javascript
{
  id: number,
  user_id: number,
  service_id: number,
  bio_id: string,
  bio_en: string,
  photo: string | null,
  created_at: datetime,
  updated_at: datetime,
  deleted_at: datetime | null,
  user: User,
  service: Service
}
```

### Schedule
```javascript
{
  id: number,
  service_id: number,
  instructor_id: number,
  start_time: datetime,
  end_time: datetime,
  total_capacity: number,
  remaining_slots: number,
  created_at: datetime,
  updated_at: datetime,
  deleted_at: datetime | null,
  service: Service,
  instructor: Instructor
}
```

### Booking
```javascript
{
  id: number,
  user_id: number,
  schedule_id: number,
  booking_code: string,
  status: 'pending' | 'confirmed' | 'cancelled',
  total_price: number,
  booking_date: date,
  created_at: datetime,
  updated_at: datetime,
  deleted_at: datetime | null,
  user: User,
  schedule: Schedule,
  payment: Payment,
  review: Review | null
}
```

### Review
```javascript
{
  id: number,
  booking_id: number,
  rating: number (1-5),
  comment: string | null,
  created_at: datetime,
  updated_at: datetime,
  booking: Booking
}
```

### Payment
```javascript
{
  id: number,
  booking_id: number,
  transaction_id: string | null,
  payment_type: string,
  gross_amount: number,
  transaction_status: 'pending' | 'capture' | 'settlement' | 'deny' | 'expire' | 'cancel',
  fraud_status: string | null,
  snap_token: string | null,
  created_at: datetime,
  updated_at: datetime,
  booking: Booking
}
```

---

## 🔑 RBAC Summary

| Endpoint | Public | User | Instructor | Admin | Super Admin |
|----------|--------|------|------------|-------|-------------|
| GET /services | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /instructors | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /schedules | ✅ (upcoming) | ✅ (upcoming) | ✅ (own) | ✅ (all) | ✅ (all) |
| GET /reviews | ✅ (all) | ✅ (all) | ✅ (own classes) | ✅ (all) | ✅ (all) |
| POST /register | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /login | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /logout | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /profile | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /bookings | ❌ | ✅ (own) | ❌ | ✅ (all) | ✅ (all) |
| POST /bookings | ❌ | ✅ | ❌ | ❌ | ❌ |
| POST /reviews | ❌ | ✅ | ❌ | ❌ | ❌ |
| POST /services | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /users | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /instructors | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /schedules | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 🚨 Important Notes

1. **Context-Aware Endpoints**: `/schedules` and `/reviews` return different data based on authentication status and role
2. **Soft Deletes**: Services, Instructors, Schedules, and Bookings use soft deletes
3. **Hierarchy Protection**: Master Account (ID 1) is immutable, Admin cannot manage Super Admin
4. **Payment Integration**: Payments are created automatically with bookings (Midtrans integration)
5. **Review Restrictions**: Can only review completed classes, no duplicate reviews
6. **Schedule Validation**: Prevents instructor double booking and validates capacity constraints
