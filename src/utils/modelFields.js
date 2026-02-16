/**
 * Model Field Definitions
 * Based on Laravel Models in born-angel-api/app/Models
 */

// User Model Fields
export const USER_FIELDS = {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    phone_number: 'phone_number',
    role: 'role',
    email_verified_at: 'email_verified_at',
    created_at: 'created_at',
    updated_at: 'updated_at',
};

// Service Model Fields
export const SERVICE_FIELDS = {
    id: 'id',
    name: 'name',
    description_id: 'description_id',
    description_en: 'description_en',
    price: 'price',
    duration_minutes: 'duration_minutes',
    image: 'image',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
};

// Instructor Model Fields
export const INSTRUCTOR_FIELDS = {
    id: 'id',
    user_id: 'user_id',
    service_id: 'service_id',
    bio_id: 'bio_id',
    bio_en: 'bio_en',
    photo: 'photo',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
};

// Schedule Model Fields
export const SCHEDULE_FIELDS = {
    id: 'id',
    service_id: 'service_id',
    instructor_id: 'instructor_id',
    start_time: 'start_time',
    end_time: 'end_time',
    total_capacity: 'total_capacity',
    remaining_slots: 'remaining_slots',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
};

// Booking Model Fields
export const BOOKING_FIELDS = {
    id: 'id',
    user_id: 'user_id',
    schedule_id: 'schedule_id',
    booking_code: 'booking_code',
    status: 'status',
    total_price: 'total_price',
    booking_date: 'booking_date',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
};

// Review Model Fields
export const REVIEW_FIELDS = {
    id: 'id',
    booking_id: 'booking_id',
    rating: 'rating',
    comment: 'comment',
    created_at: 'created_at',
    updated_at: 'updated_at',
};

// Payment Model Fields
export const PAYMENT_FIELDS = {
    id: 'id',
    booking_id: 'booking_id',
    transaction_id: 'transaction_id',
    payment_type: 'payment_type',
    gross_amount: 'gross_amount',
    transaction_status: 'transaction_status',
    fraud_status: 'fraud_status',
    snap_token: 'snap_token',
    created_at: 'created_at',
    updated_at: 'updated_at',
};

// Midtrans Transaction Status (from Payment Model)
export const MIDTRANS_STATUS = {
    PENDING: 'pending',
    CAPTURE: 'capture',
    SETTLEMENT: 'settlement',
    DENY: 'deny',
    EXPIRE: 'expire',
    CANCEL: 'cancel',
};
