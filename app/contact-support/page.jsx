import { requireAuthentication } from "@/lib/auth-guard"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ContactSupportPage() {
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
              <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
              <p className="text-gray-500 dark:text-gray-400">We're here to help. Get in touch with our support team</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>Fill out the form and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea 
                      className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Describe your issue..."
                    />
                  </div>
                  <Button>Submit Ticket</Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Help</CardTitle>
                    <CardDescription>Common questions and answers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <Button variant="link" className="h-auto p-0 text-left">How do I update my profile?</Button>
                      </li>
                      <li>
                        <Button variant="link" className="h-auto p-0 text-left">How do I change my plan?</Button>
                      </li>
                      <li>
                        <Button variant="link" className="h-auto p-0 text-left">How do I reset my password?</Button>
                      </li>
                      <li>
                        <Button variant="link" className="h-auto p-0 text-left">Billing questions</Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-400">support@example.com</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-gray-600 dark:text-gray-400">Mon-Fri 9AM - 6PM EST</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
