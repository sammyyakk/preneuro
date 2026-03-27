"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Brain,
  Menu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Assessments", href: "/assessments", icon: ClipboardList },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {navigation.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClick}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              "hover:bg-primary/10 hover:translate-x-1",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform duration-200",
              "group-hover:scale-110",
              isActive && "animate-float"
            )} />
            <span>{item.name}</span>
            {isActive && (
              <Sparkles className="w-3 h-3 ml-auto opacity-70" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-lg hover:bg-accent hover:scale-105 transition-all duration-200">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r-0">
            <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/30">
              {/* Logo */}
              <div className="flex items-center gap-3 p-6 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                  <Brain className="h-6 w-6 text-white brain-pulse" />
                </div>
                <div>
                  <span className="text-xl font-bold gradient-text">PreNeuro</span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Diagnostics</p>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex-1 p-4">
                <NavLinks onClick={() => setOpen(false)} />
              </div>
              
              {/* User section */}
              <div className="p-4 border-t border-border/50 bg-muted/30">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
                  <div className="w-10 h-10 rounded-full stat-gradient-1 flex items-center justify-center shadow-md">
                    <span className="text-sm font-semibold text-white">SC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Dr. Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">Neurologist</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gradient-to-b from-card to-muted/20 border-r border-border/50">
        {/* Logo */}
        <div className="flex items-center gap-3 h-20 px-6 border-b border-border/50">
          <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 animate-fade-in">
            <Brain className="h-6 w-6 text-white brain-pulse" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <span className="text-xl font-bold gradient-text">PreNeuro</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Diagnostics</p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 p-4 pt-6">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
            Navigation
          </p>
          <NavLinks />
        </div>
        
        {/* User section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 cursor-pointer group">
            <div className="w-10 h-10 rounded-full stat-gradient-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="text-sm font-semibold text-white">SC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Dr. Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Neurologist</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
