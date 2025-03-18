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
