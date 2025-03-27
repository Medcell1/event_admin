"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CircleDollarSign,
  Contact2,
  CreditCard,
  MessageCircle,
  Radio,
  Ticket,
  Users2,
  ScanBarcode,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/constants/routes"
import { fonts } from "../fonts"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

export const navItems = [
  { title: "Overview", href: ROUTES.DASHBOARD.OVERVIEW, icon: BarChart3 },
  { title: "Commandes", href: ROUTES.DASHBOARD.COMMANDES, icon: CircleDollarSign },
  { title: "Events", href: ROUTES.DASHBOARD.EVENTS.ROOT, icon: Ticket },
  { title: "Teams", href: ROUTES.DASHBOARD.TEAMS, icon: Users2 },
  { title: "Scan", href: ROUTES.DASHBOARD.SCAN.ROOT, icon: ScanBarcode },
  { title: "Point de recharge", href: ROUTES.DASHBOARD.RECHARGE, icon: CreditCard },
  { title: "NFC wristband", href: ROUTES.DASHBOARD.NFC, icon: Radio },
  { title: "Messages", href: ROUTES.DASHBOARD.MESSAGES, icon: MessageCircle },
]

export function AppSidebar() {
  const {  open } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="min-w-[64px] transition-all duration-300"
    >
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center justify-center gap-2">
                <span className="text-xl font-semibold text-primary">
                  {open ? 'events' : 'e'}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} isCollapsed={!open} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      {open && (
        <SidebarFooter className="p-4">
          <div className="rounded-lg bg-gradient-to-b from-gray-300 via-zinc-500 to-zinc-900 px-4 py-8 text-center">
            <h3 className="mb-1 text-lg font-semibold text-white">Subscription</h3>
            <p className="mb-3 text-sm text-white">
              Explore 20+ Feature
              <br />
              With Lifetime Membership
            </p>
            <button className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50">
              Upgrade Now
            </button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

function NavItem({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const pathname = usePathname()

  const isActive = pathname.startsWith(item.href)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={`
          text-zinc-600 
          transition-all 
          data-[active=true]:bg-blue-50 
          data-[active=true]:text-primary
          ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'}
        `}
      >
        <Link href={item.href} className="flex items-center gap-3">
          <item.icon className={`h-5 w-5 ${!isCollapsed && 'mr-2'} ${fonts.inter}`} />
          {!isCollapsed && item.title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}