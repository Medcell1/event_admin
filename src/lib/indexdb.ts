// lib/indexdb.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface TicketDB extends DBSchema {
  scannedTickets: {
    key: string;
    value: {
      id: string;
      type: string;
      holder: string;
      status: "valid" | "used" | "invalid";
      timestamp: string;
      scannedBy: string;
      reason?: string;
    };
    indexes: { 'by-timestamp': string };
  };
}

let db: IDBPDatabase<TicketDB>;

// Initialize the database
export const initDB = async (): Promise<void> => {
  db = await openDB<TicketDB>('ticket-scanner-db', 1, {
    upgrade(database) {
      // Create a store of objects
      const ticketStore = database.createObjectStore('scannedTickets', {
        // The 'id' property will be the key.
        keyPath: 'id',
      });
      
      // Create an index on the 'timestamp' property
      ticketStore.createIndex('by-timestamp', 'timestamp');
    },
  });
};

// Save a scanned ticket
export const saveScannedTicket = async (ticket: {
  id: string;
  type: string;
  holder: string;
  status: "valid" | "used" | "invalid";
  timestamp: string;
  scannedBy: string;
  reason?: string;
}): Promise<void> => {
  if (!db) await initDB();
  
  // Use a transaction to ensure data consistency
  const tx = db.transaction('scannedTickets', 'readwrite');
  await tx.store.put(ticket);
  await tx.done;
};

// Get recent scans (most recent 10)
export const getRecentScans = async (): Promise<any[]> => {
  if (!db) await initDB();
  
  const tx = db.transaction('scannedTickets', 'readonly');
  const index = tx.store.index('by-timestamp');
  
  // Get all the tickets, sorted by timestamp in descending order (newest first)
  const tickets = await index.getAll();
  const sortedTickets = tickets.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Return the most recent 10 tickets
  return sortedTickets.slice(0, 10);
};

// Clear all scan history
export const clearScanHistory = async (): Promise<void> => {
  if (!db) await initDB();
  
  const tx = db.transaction('scannedTickets', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

// Get a specific scanned ticket by ID
export const getScannedTicketById = async (id: string): Promise<any | undefined> => {
  if (!db) await initDB();
  
  return await db.get('scannedTickets', id);
};

// Delete a specific scanned ticket
export const deleteScannedTicket = async (id: string): Promise<void> => {
  if (!db) await initDB();
  
  await db.delete('scannedTickets', id);
};

// Get all scanned tickets (for export or full history view)
export const getAllScannedTickets = async (): Promise<any[]> => {
  if (!db) await initDB();
  
  const tx = db.transaction('scannedTickets', 'readonly');
  const index = tx.store.index('by-timestamp');
  
  const tickets = await index.getAll();
  return tickets.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get statistics about scanned tickets
export const getScanStats = async (): Promise<{
  total: number;
  valid: number;
  used: number;
  invalid: number;
}> => {
  if (!db) await initDB();
  
  const tickets = await getAllScannedTickets();
  
  return {
    total: tickets.length,
    valid: tickets.filter(t => t.status === 'valid').length,
    used: tickets.filter(t => t.status === 'used').length,
    invalid: tickets.filter(t => t.status === 'invalid').length
  };
};