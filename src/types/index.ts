export type UserRole = "freelancer" | "startup" | "owner" | "community" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  plan: "free" | "starter" | "professional" | "enterprise";
  joinedAt: string;
  phone?: string;
  company?: string;
  bio?: string;
  location?: string;
  verified: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  type: "hot-desk" | "private-office" | "meeting-room" | "event-space" | "dedicated-desk";
  location: string;
  address: string;
  city: string;
  country: string;
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  available: boolean;
  images: string[];
  amenities: string[];
  description: string;
  ownerId: string;
  ownerName: string;
  tags: string[];
  featured: boolean;
  occupancy: number;
}

export interface Booking {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceImage: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  type: "hourly" | "daily" | "monthly";
  seats: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "checked-in";
  paymentStatus: "paid" | "pending" | "refunded";
  bookingCode: string;
  createdAt: string;
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "networking" | "workshop" | "meetup" | "conference" | "webinar";
  attendees: number;
  maxAttendees: number;
  price: number;
  image: string;
  organizer: string;
  tags: string[];
  featured: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  color: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  workspaceId: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "event" | "system" | "community";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  description: string;
  items: { name: string; qty: number; price: number }[];
}

export interface AnalyticsData {
  revenue: { month: string; value: number }[];
  bookings: { month: string; value: number }[];
  occupancy: { day: string; value: number }[];
  userGrowth: { month: string; value: number }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
