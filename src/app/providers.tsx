import { EventFormProvider } from "@/hooks/use-event-form";
import { SessionProvider } from "next-auth/react";

function Providers({ children }: { children: React.ReactNode }) {
    return (
      
            <SessionProvider>
                <EventFormProvider>
                {children}
                </EventFormProvider>
            </SessionProvider>
    )
}
export default Providers;