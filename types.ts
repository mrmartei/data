export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  avatar: string;
  role: 'user' | 'admin';
  joinedDate: string;
}

export interface Transaction {
  id: string;
  type: 'Data' | 'Fund';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
  recipient: string;
  plan: string;
  network?: 'MTN' | 'Telecel' | 'AT';
}

export interface DataPlan {
  id: string;
  network: 'MTN' | 'Telecel' | 'AT';
  size: string;
  price: number;
}

export type ViewType = 'dashboard' | 'buy-data' | 'history' | 'settings' | 'admin' | 'login';