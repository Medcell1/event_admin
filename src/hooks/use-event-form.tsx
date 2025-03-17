"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { openDB } from "idb";

export type Category = {
  _id: string;
  name: string;
};

export type Ticket = {
  id: string;
  name: string;
  price: number;
  description?: string;
  visibility: "public" | "private";
  codePrefix: string;
  totalSupply: number;
};

export type EventFormData = {
  name: string;
  date: Date | null;
  time: string;
  location: string;
  description: string;
  category: Category[];
  bannerImage?: File | null;
  tickets: Ticket[];
};

type EventFormContextType = {
  formData: EventFormData;
  updateEventParameters: (data: Partial<EventFormData>) => void;
  addTicket: (ticket: Omit<Ticket, "id">) => void;
  editTicket: (id: string, ticket: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  resetForm: () => void;
};

const defaultFormData: EventFormData = {
  name: "",
  date: null,
  time: "",
  location: "",
  description: "",
  category: [],
  bannerImage: null,
  tickets: [],
};

const STORAGE_KEY = "eventFormData";
const DB_NAME = "EventFormDB";
const STORE_NAME = "images";

const EventFormContext = createContext<EventFormContextType | undefined>(undefined);

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

async function saveImageToIndexedDB(file: File) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put(file, "bannerImage");
}

async function getImageFromIndexedDB(): Promise<File | null> {
  const db = await initDB();
  return (await db.get(STORE_NAME, "bannerImage")) || null;
}

export async function removeImageFromIndexedDB() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete("bannerImage");
}

export function EventFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          parsedData.bannerImage = await getImageFromIndexedDB();
          setFormData(parsedData);
        }
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);
  

  useEffect(() => {
    const timeout = setTimeout(async () => {
      let dataToStore = { ...formData };
  
      if (dataToStore.bannerImage instanceof File) {
        await saveImageToIndexedDB(dataToStore.bannerImage);
        dataToStore.bannerImage = undefined;
      }
  
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    }, 500); 
  
    return () => clearTimeout(timeout);
  }, [formData]);
  
  if (!isLoaded) return null; 

  const updateEventParameters = (data: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const addTicket = (ticket: Omit<Ticket, "id">) => {
    const newTicket = { ...ticket, id: crypto.randomUUID() };
    setFormData((prev) => ({ ...prev, tickets: [...prev.tickets, newTicket] }));
  };

  const editTicket = (id: string, ticketData: Partial<Ticket>) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...ticketData } : ticket
      ),
    }));
  };

  const deleteTicket = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((ticket) => ticket.id !== id),
    }));
  };

  const resetForm = async () => {
    setFormData(defaultFormData);
    localStorage.removeItem(STORAGE_KEY);
    await removeImageFromIndexedDB();
  };

  return (
    <EventFormContext.Provider value={{ formData, updateEventParameters, addTicket, editTicket, deleteTicket, resetForm }}>
      {children}
    </EventFormContext.Provider>
  );
}

export function useEventForm() {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error("useEventForm must be used within an EventFormProvider");
  }
  return context;
}
