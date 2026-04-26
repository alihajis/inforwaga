export interface User {
  id: number;
  email: string;
  full_name: string;
  address?: string;
  phone?: string;
  role: 'admin' | 'warga';
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author_id: number;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Treasury {
  id: number;
  month: number;
  year: number;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  created_at: string;
}

export interface FormSubmission {
  id: number;
  user_id: number;
  form_type: string;
  data_json: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  files?: string[];
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: number;
}

export interface Poll {
  id: number;
  question: string;
  options_json: string[];
  created_at: string;
  expires_at?: string;
  votes?: { [key: string]: number };
  user_vote?: string;
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  uploaded_by?: number;
  uploaded_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
