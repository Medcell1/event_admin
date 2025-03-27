export interface SignUpDTO {
  email: string;
  password: string;
  name: string;
  userType: string;
}
export interface TicketTypeRequest {
  price: number;
  name: string;
  visibility : "public" | "private",
  codePrefix: string;
  createdBy: string;
  totalSupply: number;
  description: string;
}
export interface TicketType {
  _id:string;
  price: number;
  name: string;
  visibility : "public" | "private",
  codePrefix: string;
  createdBy: string;
  totalSupply: number;
  description: string;
  soldOut: boolean;
}
//events
export interface EventRequest {
  name: string;
  description: string;
  date: string;
  location: string;
  files: string[];
  owner: string;
  categories: string[];
  ticketTypes: string[];
}

//categories
export interface EventCategory {
  _id:string;
  name: string;
}


export interface Event {
  _id: string;
  name: string;
  owner: string;
  description: string;
  location: string;
  visibility: "public" | "private";
  date: string; 
  mediaUrls: string[];
  sales: {
    ticketsSold: number;
    ticketsScanned: number;
    totalTicketSupply: number;
  };
}
export interface EventDetails {
  _id: string;
  name: string;
  owner: string;
  description: string;
  location: string;
  visibility: string;
  date: string;
  categories: {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
  }[];
  ticketTypes: {
    _id: string;
    price: number;
    name: string;
    description: string;
    totalSupply: number;
    visibility: string;
    codePrefix: string;
    createdBy: string;
    soldOut: boolean;
  }[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
    password: string;
    userType: string;
    age: number;
    username: string;
    avatarUrl: string;
    bio: string;
    isOnline: boolean;
    lastSeen: string;
    followingsCount: number | null;
    followersCount: number | null;
  };
  createdAt: string;
  views: number;
  clicks: number;
  shares: number;
  bookmarks: number;
  lastUpdated: string;
  mediaUrls: string[];
  sales: {
    ticketsSold: number;
    ticketsScanned: number;
    totalTicketSupply: number;
    ticketTypeSales: {
      [key: string]: {
        ticketTypeId: string;
        name: string;
        sold: number;
        scanned: number;
        totalSupply: number;
      };
    };
  };
}
export interface TicketTypeSale {
  ticketTypeId: string
  name: string
  sold: number
  scanned: number
  totalSupply: number
}

export interface EventSales {
  ticketsSold: number
  ticketsScanned: number
  totalTicketSupply: number
  ticketTypeSales: Record<string, TicketTypeSale>
}
export interface TodayEvent {
  _id: string
  name: string
  owner: string
  description: string
  location: string
  visibility: string
  date: string
  categories: string[]
  ticketTypes: string[]
  createdBy: string
  createdAt: string
  views: number
  clicks: number
  shares: number
  bookmarks: number
  lastUpdated: string
  mediaUrls: string[]
  sales: EventSales
}
export interface ScanResponse {
  success: boolean;
  message: string;
  ticket: {
    _id: string;
    event: {
      _id: string;
    };
    ticketType: {
      _id: string;
      price: number;
      name: string;
      description: string;
      totalSupply: number;
      visibility: string;
      codePrefix: string;
      createdBy: string;
      soldOut: boolean;
    };
    issuedTo: {
      name: string;
      email: string;
      phone: string;
    };
    issuedAt: string;
    ticketNumber: string;
    isScanned: boolean;
  };
}
