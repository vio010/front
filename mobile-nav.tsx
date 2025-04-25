import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onNewChoreClick: () => void;
}

export default function MobileNav({ onNewChoreClick }: MobileNavProps) {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/my-chores", label: "My Chores", icon: "assignment" },
    { path: null, label: "New Chore", icon: "add_circle", onClick: onNewChoreClick },
    { path: "/roommates", label: "Roommates", icon: "group" },
    { path: "/settings", label: "Settings", icon: "settings" },
  ];
  
  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item, index) => {
          const isActive = item.path && location === item.path;
          
          const NavItem = () => (
            <div 
              className={cn(
                "flex flex-col items-center py-3",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          );
          
          return item.path ? (
            <Link key={index} href={item.path}>
              <NavItem />
            </Link>
          ) : (
            <button 
              key={index}
              type="button" 
              onClick={item.onClick}
              className="focus:outline-none"
            >
              <NavItem />
            </button>
          );
        })}
      </div>
    </div>
  );
}
