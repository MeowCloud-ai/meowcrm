"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  Contact,
  CheckSquare,
  Activity,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MeowCloudLogo } from "@/components/meowcloud-logo"

const navItems = [
  { title: "總覽", href: "/dashboard", icon: LayoutDashboard },
  { title: "客戶", href: "/customers", icon: Users },
  { title: "聯絡人", href: "/contacts", icon: Contact },
  { title: "任務", href: "/tasks", icon: CheckSquare },
  { title: "活動", href: "/activities", icon: Activity },
  { title: "設定", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <MeowCloudLogo size={28} className="text-mc-primary-600" />
          <span className="text-lg font-semibold bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 bg-clip-text text-transparent">
            MeowCRM
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>導航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
