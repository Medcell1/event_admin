'use client';

import { Ticket } from '@/hooks/use-event-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PreviousTicketsClientProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket, isNewCopy: boolean) => void;
}

export function PreviousTicketsClient({ tickets, onSelectTicket }: PreviousTicketsClientProps) {
  // Client component that receives pre-fetched data
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't created any tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
        >
          <div className="space-y-1">
            <h4 className="font-medium">{ticket.name}</h4>
            <p className="text-sm text-muted-foreground">
              ${ticket.price.toFixed(2)} • {ticket.visibility}
            </p>
            {ticket.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => onSelectTicket(ticket, false)}
            >
              Use
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => onSelectTicket(ticket, true)}
            >
              <Plus className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}