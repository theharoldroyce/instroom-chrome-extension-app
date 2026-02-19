import { requireAuthentication } from "@/lib/auth-guard"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BillingPage() {
  let user;
  try {
    user = await requireAuthentication();
  } catch (error) {
    if (error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }
    throw error;
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 16)"
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your billing and subscription</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Professional</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$29/month</div>
                  <p className="text-sm text-gray-500 mt-2">Renews on March 19, 2026</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Usage</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-sm text-gray-500 mt-2">13 of 20 projects used</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Next Billing</CardTitle>
                  <CardDescription>Due</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Mar 19</div>
                  <p className="text-sm text-gray-500 mt-2">$29.00</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your recent invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">February 19, 2026</p>
                      <p className="text-sm text-gray-500">Invoice #INV-002</p>
                    </div>
                    <span className="font-medium">$29.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">January 19, 2026</p>
                      <p className="text-sm text-gray-500">Invoice #INV-001</p>
                    </div>
                    <span className="font-medium">$29.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
