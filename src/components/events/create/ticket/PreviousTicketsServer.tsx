"use client"; 

import { useEffect, useState } from "react";
import { Ticket } from "@/hooks/use-event-form";
import TicketTypesService from "@/actions/events/tickettype";
import { TicketType } from "@/@types";
import { getCurrentUser } from "@/lib/get-session";
import { PreviousTicketsClient } from "./PreviousTicketClient";
import { PreviousTicketsSkeleton } from "./previous-tickets-skeleton";

export default function PreviousTickets({ onSelectTicket }: { onSelectTicket: (ticket: Ticket, isNewCopy: boolean) => void; }) {
    const [tickets, setTickets] = useState<Ticket[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const session = await getCurrentUser();
                const ticketTypes: TicketType[] = await TicketTypesService.getForUser(session?.user?.id!);

                setTickets(ticketTypes.map(({ _id, name, price, description, visibility, codePrefix, totalSupply }) => ({
                    id: _id,
                    name,
                    price,
                    description,
                    visibility,
                    codePrefix,
                    totalSupply,
                })));
            } catch (error) {
                console.error("Failed to fetch Previous Ticket Types for User:", error);
                setTickets([]);
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, []);

    if (loading) return <PreviousTicketsSkeleton />;
    return <PreviousTicketsClient tickets={tickets ?? []} onSelectTicket={onSelectTicket} />;
}
