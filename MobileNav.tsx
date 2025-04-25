import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { HomeIcon, CheckSquareIcon, PlusIcon, UsersIcon, SettingsIcon } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Tasks", path: "/tasks", icon: CheckSquareIcon },
    { name: "Add", path: "#add-task", icon: PlusIcon, action: "open-add-task" },
    { name: "Roommates", path: "/roommates", icon: UsersIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  // Open the add task dialog
  const handleAddTask = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch a custom event to open the task dialog
    // This avoids prop drilling and allows the modal to be controlled from anywhere
    document.dispatchEvent(new CustomEvent("open-add-task-dialog"));
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around z-10">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.path}
          onClick={item.action === "open-add-task" ? handleAddTask : undefined}
          className={cn(
            "flex flex-col items-center",
            (location === item.path || (item.path === "/" && location === "/")) 
              ? "text-primary" 
              : "text-gray-500"
          )}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
