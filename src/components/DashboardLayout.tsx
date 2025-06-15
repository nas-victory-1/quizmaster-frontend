import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, ListChecks, Users, BarChart, Settings, LogOut, Menu, Brain } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ListChecks, label: "Quizzes", href: "/dashboard/quizzes" },
    { icon: Users, label: "Participants", href: "/dashboard/participants" },
    { icon: BarChart, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-purple-600 text-white p-2 rounded-md">
              <Brain size={20} />
            </div>
            <h1 className="font-bold text-xl">QuizMaster</h1>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Jane Doe</div>
              <div className="text-sm text-gray-500">jane@example.com</div>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-purple-600 text-white p-2 rounded-md">
              <Brain size={20} />
            </div>
            <h1 className="font-bold text-xl">QuizMaster</h1>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-600 text-white p-2 rounded-md">
                    <Brain size={20} />
                  </div>
                  <h1 className="font-bold text-xl">QuizMaster</h1>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            {item.label}
                          </div>
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Jane Doe</div>
                    <div className="text-sm text-gray-500">jane@example.com</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:p-8 p-4 pt-20 md:pt-8">{children}</div>
    </div>
  )
}
