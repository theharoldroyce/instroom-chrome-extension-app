import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/session";

export async function SiteHeader() {
  // Fetch user on server side
  const user = await getCurrentUser();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-3 sm:px-4 md:px-6 lg:gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 data-[orientation=vertical]:h-5 sm:h-6"
        />
        <div className="flex flex-1 items-center justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="text-left min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
              Hi,{user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
              Welcome back to your dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
