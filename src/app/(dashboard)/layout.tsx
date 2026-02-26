import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { OrganizationProvider } from "@/lib/hooks/use-organization"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrganizationProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main id="main-content" className="flex-1 p-6">{children}</main>
        </div>
      </SidebarProvider>
    </OrganizationProvider>
  )
}
