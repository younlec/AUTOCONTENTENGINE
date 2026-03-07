"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Content Generator",
    href: "/dashboard/content",
    icon: Sparkles,
  },
  {
    label: "Drafts & Approval",
    href: "/dashboard/drafts",
    icon: FileText,
  },
  {
    label: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    label: "Monetization",
    href: "/dashboard/monetization",
    icon: DollarSign,
  },
  {
    label: "Connected Accounts",
    href: "/dashboard/accounts",
    icon: LinkIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-950 text-white transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">
              AutoContent
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5">Engine</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800",
            collapsed && "ml-0"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white border border-violet-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-violet-400")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-4 border-t border-slate-800", collapsed && "p-2")}>
        {!collapsed && (
          <div className="rounded-lg bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 p-3">
            <p className="text-xs font-medium text-white">Pro Plan</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              5,000 / 10,000 credits used
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
