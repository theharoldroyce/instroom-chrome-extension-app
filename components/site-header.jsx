import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogoutButton } from "@/components/logout-button"
import { getCurrentUser } from "@/lib/session"

export async function SiteHeader() {
  // Fetch user on server side
  const user = await getCurrentUser()

  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-4">
          {/* User Info Display */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium leading-none">{user.fullName || user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
              </div>
              <Separator orientation="vertical" className="h-6" />
            </div>
          )}

          {/* Logout Button */}
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
