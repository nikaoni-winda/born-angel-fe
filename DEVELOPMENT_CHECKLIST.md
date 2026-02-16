# Born Angel React - Development Checklist

## ✅ Phase 1: Foundation (COMPLETED)

- [x] Create folder structure
- [x] Setup API service layer
- [x] Implement authentication context
- [x] Create route guards (Protected & Role-based)
- [x] Setup all page placeholders
- [x] Create utility functions
- [x] Setup environment variables
- [x] Write documentation

## 🔨 Phase 2: Core Features (TODO)

### 2.1 Authentication Pages

- [ ] **LoginPage.jsx**
  - [ ] Create login form (email, password)
  - [ ] Add form validation
  - [ ] Implement login logic with authService
  - [ ] Handle errors (invalid credentials, network errors)
  - [ ] Add loading state
  - [ ] Redirect to dashboard on success
  - [ ] Add "Register" link

- [ ] **RegisterPage.jsx**
  - [ ] Create register form (name, email, password, phone)
  - [ ] Add form validation
  - [ ] Implement register logic with authService
  - [ ] Handle errors (duplicate email, validation)
  - [ ] Add loading state
  - [ ] Redirect to login on success
  - [ ] Add "Login" link

### 2.2 Common Components

- [ ] **Button.jsx**
  - [ ] Primary, secondary, danger variants
  - [ ] Loading state
  - [ ] Disabled state
  - [ ] Size variants (sm, md, lg)

- [ ] **Card.jsx**
  - [ ] Basic card with header, body, footer
  - [ ] Hover effects
  - [ ] Shadow variants

- [ ] **Modal.jsx**
  - [ ] Backdrop overlay
  - [ ] Close button
  - [ ] Confirm/Cancel actions
  - [ ] Size variants

- [ ] **Table.jsx**
  - [ ] Responsive table
  - [ ] Sortable columns
  - [ ] Action buttons
  - [ ] Empty state

- [ ] **Form Components**
  - [ ] Input.jsx (text, email, password, number)
  - [ ] Select.jsx (dropdown)
  - [ ] TextArea.jsx
  - [ ] Error message display
  - [ ] Label component

- [ ] **Loading.jsx**
  - [ ] Spinner component
  - [ ] Full page loading
  - [ ] Inline loading

- [ ] **Badge.jsx**
  - [ ] Status badges (confirmed, cancelled, etc)
  - [ ] Color variants

### 2.3 Layout Components

- [ ] **Navbar.jsx**
  - [ ] Logo
  - [ ] Navigation links (public)
  - [ ] Login/Register buttons (if not authenticated)
  - [ ] User menu (if authenticated)
  - [ ] Logout button
  - [ ] Mobile responsive

- [ ] **Footer.jsx**
  - [ ] Copyright
  - [ ] Links
  - [ ] Social media

- [ ] **Sidebar.jsx** (Admin)
  - [ ] Navigation menu
  - [ ] Active link highlight
  - [ ] Collapsible on mobile
  - [ ] Role-based menu items

- [ ] **AdminLayout.jsx**
  - [ ] Sidebar + Content layout
  - [ ] Breadcrumbs
  - [ ] Page title

## 🎨 Phase 3: Public Pages

### 3.1 HomePage.jsx

- [ ] Hero section
- [ ] Featured services
- [ ] Featured instructors
- [ ] Call to action
- [ ] Testimonials/Reviews

### 3.2 ServicesPage.jsx

- [ ] Fetch services from API
- [ ] Display service cards
- [ ] Filter by category (if applicable)
- [ ] Search functionality
- [ ] Link to service detail

### 3.3 ServiceDetailPage.jsx

- [ ] Fetch service by ID
- [ ] Display service info (name, description, price, duration)
- [ ] Show available schedules
- [ ] "Book Now" button (redirect to login if not authenticated)
- [ ] Show reviews

### 3.4 InstructorsPage.jsx

- [ ] Fetch instructors from API
- [ ] Display instructor cards
- [ ] Show bio and photo
- [ ] Link to instructor detail (optional)

## 👤 Phase 4: User/Customer Features

### 4.1 User Dashboard

- [ ] Welcome message
- [ ] Quick stats (upcoming bookings, total bookings)
- [ ] Recent bookings
- [ ] Quick actions (Book Now, View All)

### 4.2 MyBookingsPage.jsx

- [ ] Fetch user bookings
- [ ] Display booking list (table or cards)
- [ ] Show booking details (service, schedule, status, payment)
- [ ] Cancel booking action
- [ ] Filter by status
- [ ] "Create Review" button (if completed)

### 4.3 CreateBookingPage.jsx (Optional)

- [ ] Select service
- [ ] View available schedules
- [ ] Confirm booking
- [ ] Payment info
- [ ] Success message

### 4.4 MyReviewsPage.jsx (Optional)

- [ ] Fetch user reviews
- [ ] Display review list
- [ ] Edit review
- [ ] Delete review

## 👨‍🏫 Phase 5: Instructor Features

### 5.1 Instructor Dashboard

- [ ] Welcome message
- [ ] Upcoming schedules
- [ ] Recent reviews
- [ ] Quick stats

### 5.2 MySchedulesPage.jsx

- [ ] Fetch instructor schedules
- [ ] Display schedule list (calendar or table)
- [ ] Show past and future schedules
- [ ] Show booking count per schedule
- [ ] Filter by date

### 5.3 Instructor Reviews (Optional)

- [ ] Fetch reviews for instructor's classes
- [ ] Display review list
- [ ] Filter by rating

## 🔧 Phase 6: Admin Features

### 6.1 Admin Dashboard

- [ ] Statistics cards (total users, services, bookings, revenue)
- [ ] Recent bookings
- [ ] Recent users
- [ ] Quick actions

### 6.2 User Management

- [ ] **UsersListPage.jsx**
  - [ ] Fetch all users
  - [ ] Display user table
  - [ ] Filter by role
  - [ ] Search by name/email
  - [ ] Edit user button
  - [ ] Delete user button
  - [ ] Create user button

- [ ] **CreateUserPage.jsx**
  - [ ] Create user form
  - [ ] Role selection (admin can't create super_admin)
  - [ ] Form validation
  - [ ] Success message
  - [ ] Redirect to list

- [ ] **EditUserPage.jsx**
  - [ ] Fetch user by ID
  - [ ] Edit user form
  - [ ] Update user
  - [ ] Handle hierarchy (can't edit super_admin if admin)
  - [ ] Success message

### 6.3 Service Management

- [ ] **ServicesListPage.jsx**
  - [ ] Fetch all services
  - [ ] Display service table
  - [ ] Edit service button
  - [ ] Delete service button
  - [ ] Create service button

- [ ] **CreateServicePage.jsx**
  - [ ] Create service form
  - [ ] Upload image (optional)
  - [ ] Form validation
  - [ ] Success message

- [ ] **EditServicePage.jsx**
  - [ ] Fetch service by ID
  - [ ] Edit service form
  - [ ] Update service
  - [ ] Success message

### 6.4 Instructor Management

- [ ] **InstructorsListPage.jsx**
  - [ ] Fetch all instructors
  - [ ] Display instructor table
  - [ ] Edit instructor button
  - [ ] Delete instructor button
  - [ ] Create instructor button

- [ ] **CreateInstructorPage.jsx**
  - [ ] Select user (role: instructor)
  - [ ] Select service
  - [ ] Bio form
  - [ ] Upload photo (optional)
  - [ ] Success message

- [ ] **EditInstructorPage.jsx**
  - [ ] Fetch instructor by ID
  - [ ] Edit instructor form
  - [ ] Update instructor
  - [ ] Success message

### 6.5 Schedule Management

- [ ] **SchedulesListPage.jsx**
  - [ ] Fetch all schedules
  - [ ] Display schedule table/calendar
  - [ ] Filter by instructor/service
  - [ ] Edit schedule button
  - [ ] Delete schedule button
  - [ ] Create schedule button

- [ ] **CreateSchedulePage.jsx**
  - [ ] Select service
  - [ ] Select instructor (filtered by service)
  - [ ] Select date & time
  - [ ] Set capacity
  - [ ] Validate no overlap
  - [ ] Success message

- [ ] **EditSchedulePage.jsx**
  - [ ] Fetch schedule by ID
  - [ ] Edit schedule form
  - [ ] Update schedule
  - [ ] Validate capacity (can't reduce below bookings)
  - [ ] Success message

### 6.6 Booking Management

- [ ] **BookingsListPage.jsx**
  - [ ] Fetch all bookings
  - [ ] Display booking table
  - [ ] Filter by status/date
  - [ ] Search by user
  - [ ] View booking detail
  - [ ] Cancel booking action

## 🎨 Phase 7: UI/UX Polish

- [ ] Add transitions and animations
- [ ] Implement toast notifications
- [ ] Add confirmation dialogs
- [ ] Improve error messages
- [ ] Add empty states
- [ ] Optimize images
- [ ] Add loading skeletons
- [ ] Responsive design testing

## 🧪 Phase 8: Testing

- [ ] Test all user flows
- [ ] Test role-based access
- [ ] Test form validations
- [ ] Test error handling
- [ ] Test on different screen sizes
- [ ] Test on different browsers

## 🚀 Phase 9: Deployment

- [ ] Build production bundle
- [ ] Configure environment variables
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Test production build
- [ ] Setup CI/CD (optional)

## 📝 Notes

### Priority Order

1. **High Priority** (Core functionality)
   - Authentication pages
   - Common components (Button, Card, Form)
   - Layout components (Navbar)
   - Public pages (Home, Services)
   - User booking flow

2. **Medium Priority** (Admin features)
   - Admin dashboard
   - User management
   - Service management
   - Schedule management

3. **Low Priority** (Nice to have)
   - Instructor dashboard
   - Advanced filters
   - Analytics
   - Export features

### Development Tips

- Start with one page at a time
- Test each feature before moving to next
- Reuse components as much as possible
- Keep API calls in service layer
- Use AuthContext for role checking
- Handle errors gracefully
- Add loading states everywhere
- Mobile-first approach

### Common Patterns

**Fetch Data Pattern:**
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await someService.getAll();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

**Form Submit Pattern:**
```javascript
const [formData, setFormData] = useState({ ... });
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setSubmitting(true);
    setError(null);
    await someService.create(formData);
    // Success: redirect or show message
  } catch (err) {
    setError(err.response?.data?.message || 'An error occurred');
  } finally {
    setSubmitting(false);
  }
};
```

**Role Check Pattern:**
```javascript
const { isAdmin, isSuperAdmin } = useAuth();

// In JSX
{isAdmin() && <AdminButton />}
{isSuperAdmin() && <SuperAdminButton />}
```

---

**Good luck with development! 🚀**
