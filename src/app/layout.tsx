import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { fonts } from "@/components/fonts"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"



export const metadata: Metadata = {
  title: "Events/Ticket Dashboard",
  description: "Your event management dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fonts.poppins} ${fonts.rubik} font-sans`}>
        <Providers>
        {children}
        </Providers>
        <Toaster/>
        </body>
    </html>
  ) 
}

