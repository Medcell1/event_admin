import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface TicketDB extends DBSchema {
  scannedTickets: {
    key: string;
    value: {
      id: string;
      eventId: string; 
      type: string;
      holder: string;
      status: "valid" | "used" | "invalid";
      timestamp: string;
      scannedBy: string;
      reason?: string;
    };
    indexes: { 
      'by-timestamp': string;
      'by-event': string; 
    };
  };
}

let db: IDBPDatabase<TicketDB>;

// Initialize the database
export const initDB = async (): Promise<void> => {
  // Close any existing connection first to avoid issues
  if (db) {
    db.close();
  }

  // Increase the version number to force an upgrade
  db = await openDB<TicketDB>('ticket-scanner-db', 2, {
    upgrade(database, oldVersion, newVersion, transaction) {
      // If the object store already exists, delete it to recreate
      if (database.objectStoreNames.contains('scannedTickets')) {
        database.deleteObjectStore('scannedTickets');
      }
      
      // Create a store of objects
      const ticketStore = database.createObjectStore('scannedTickets', {
        keyPath: 'id'
      });
      
      // Create required indexes
      ticketStore.createIndex('by-timestamp', 'timestamp');
      ticketStore.createIndex('by-event', 'eventId');
      
      console.log('IndexedDB setup complete with indexes');
    },
  });
  
  // Verify indexes were created
  const transaction = db.transaction('scannedTickets', 'readonly');
  const store = transaction.objectStore('scannedTickets');
  const indexNames = store.indexNames;
  console.log('Available indexes:', Array.from(indexNames));
  await transaction.done;
};

// Save a scanned ticket
export const saveScannedTicket = async (ticket: {
  id: string;
  eventId: string; 
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

// Get recent scans for a specific event (most recent 10)
export const getRecentScans = async (eventId: string): Promise<any[]> => {
  if (!db) await initDB();
  
  try {
    const tx = db.transaction('scannedTickets', 'readonly');
    const store = tx.objectStore('scannedTickets');
    
    // Verify the index exists
    if (!store.indexNames.contains('by-event')) {
      console.error('Index by-event does not exist');
      // Fallback: get all tickets and filter manually
      const allTickets = await store.getAll();
      const eventTickets = allTickets.filter(ticket => ticket.eventId === eventId);
      const sortedTickets = eventTickets.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return sortedTickets.slice(0, 10);
    }
    
    const index = store.index('by-event');
    // Get all tickets for this event
    const tickets = await index.getAll(eventId);
    
    // Sort by timestamp in descending order (newest first)
    const sortedTickets = tickets.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Return the most recent 10 tickets
    return sortedTickets.slice(0, 10);
  } catch (error) {
    console.error('Error getting recent scans:', error);
    return []; // Return empty array on error
  }
};

// Clear scan history for a specific event
export const clearEventScanHistory = async (eventId: string): Promise<void> => {
  if (!db) await initDB();
  
  try {
    const tx = db.transaction('scannedTickets', 'readwrite');
    const store = tx.objectStore('scannedTickets');
    
    if (!store.indexNames.contains('by-event')) {
      // Fallback: get all tickets and delete matching ones
      const allTickets = await store.getAll();
      for (const ticket of allTickets) {
        if (ticket.eventId === eventId) {
          await store.delete(ticket.id);
        }
      }
    } else {
      const index = store.index('by-event');
      let cursor = await index.openCursor(eventId);
      
      while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
      }
    }
    
    await tx.done;
  } catch (error) {
    console.error('Error clearing event history:', error);
  }
};

// Clear all scan history (all events)
export const clearAllScanHistory = async (): Promise<void> => {
  if (!db) await initDB();
  
  const tx = db.transaction('scannedTickets', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

// Get a specific scanned ticket by ID for a specific event
export const getScannedTicketById = async (id: string, eventId: string): Promise<any | undefined> => {
  if (!db) await initDB();
  
  try {
    // Direct retrieval by ID
    const ticket = await db.get('scannedTickets', id);
    
    // Check if the ticket belongs to the expected event
    if (ticket && ticket.eventId === eventId) {
      return ticket;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting ticket by ID:', error);
    return undefined;
  }
};

// Delete a specific scanned ticket
export const deleteScannedTicket = async (id: string): Promise<void> => {
  if (!db) await initDB();
  
  try {
    await db.delete('scannedTickets', id);
  } catch (error) {
    console.error('Error deleting ticket:', error);
  }
};

// Get all scanned tickets for a specific event
export const getAllEventScannedTickets = async (eventId: string): Promise<any[]> => {
  if (!db) await initDB();
  
  try {
    const tx = db.transaction('scannedTickets', 'readonly');
    const store = tx.objectStore('scannedTickets');
    
    if (!store.indexNames.contains('by-event')) {
      // Fallback: filter manually
      const allTickets = await store.getAll();
      return allTickets
        .filter(ticket => ticket.eventId === eventId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    const index = store.index('by-event');
    const tickets = await index.getAll(eventId);
    
    return tickets.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting all event tickets:', error);
    return [];
  }
};

// Get all scanned tickets (across all events)
export const getAllScannedTickets = async (): Promise<any[]> => {
  if (!db) await initDB();
  
  try {
    const tx = db.transaction('scannedTickets', 'readonly');
    const store = tx.objectStore('scannedTickets');
    
    const tickets = await store.getAll();
    return tickets.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting all tickets:', error);
    return [];
  }
};

// Get statistics about scanned tickets for a specific event
export const getEventScanStats = async (eventId: string): Promise<{
  total: number;
  valid: number;
  used: number;
  invalid: number;
}> => {
  if (!db) await initDB();
  
  try {
    const tickets = await getAllEventScannedTickets(eventId);
    
    return {
      total: tickets.length,
      valid: tickets.filter(t => t.status === 'valid').length,
      used: tickets.filter(t => t.status === 'used').length,
      invalid: tickets.filter(t => t.status === 'invalid').length
    };
  } catch (error) {
    console.error('Error getting event scan stats:', error);
    return { total: 0, valid: 0, used: 0, invalid: 0 };
  }
};