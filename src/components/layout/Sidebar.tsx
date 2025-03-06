
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble, 
  BookOpen, 
  Users, 
  BarChart3, 
  ShowerHead, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Bookings",
    icon: BookOpen,
    href: "/bookings",
  },
  {
    title: "Rooms",
    icon: BedDouble,
    href: "/rooms",
  },
  {
    title: "Calendar",
    icon: CalendarDays,
    href: "/calendar",
  },
  {
    title: "Staff",
    icon: Users,
    href: "/staff",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Cleaning",
    icon: ShowerHead,
    href: "/cleaning",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-sidebar-border bg-sidebar",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center justify-between h-16 px-4 py-4 border-b border-sidebar-border",
          collapsed ? "justify-center" : ""
        )}>
          {!collapsed && (
            <h1 className="text-lg font-semibold text-sidebar-foreground animate-fade-in">
              Hotel PMS
            </h1>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1 rounded-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              collapsed ? "rotate-180" : ""
            )}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex flex-col justify-between h-full py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-md transition-all duration-200",
                    "group hover:bg-sidebar-accent",
                    isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground",
                    collapsed ? "justify-center" : ""
                  )
                }
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0 transition-transform duration-200", 
                    collapsed ? "group-hover:scale-110" : "",
                  )} 
                />
                {!collapsed && (
                  <span className="ml-3 animate-fade-in">{item.title}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="px-2 mt-auto">
            <button
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-md text-sidebar-foreground",
                "hover:bg-sidebar-accent transition-all duration-200",
                collapsed ? "justify-center" : ""
              )}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
