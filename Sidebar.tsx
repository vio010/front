import { Link, useLocation } from "wouter";
import { useTaskContext } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  CheckSquareIcon, 
  CalendarIcon, 
  UsersIcon, 
  BarChartIcon, 
  SettingsIcon, 
  SearchIcon, 
  XIcon
} from "lucide-react";

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) => {
  const [location] = useLocation();
  const { household } = useTaskContext();

  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "My Tasks", path: "/tasks", icon: CheckSquareIcon },
    { name: "Schedule", path: "/schedule", icon: CalendarIcon },
    { name: "Roommates", path: "/roommates", icon: UsersIcon },
    { name: "Statistics", path: "/statistics", icon: BarChartIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-white shadow-md fixed h-full z-10 transition-all duration-300">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            RoomieTask
          </h1>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
            />
            <SearchIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg",
                location === item.path 
                  ? "bg-indigo-50 text-primary" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Your Household
            </h3>
            <div className="px-3 py-2 rounded-lg bg-indigo-50 mb-2">
              <div className="font-medium text-primary">
                {household?.name || "Loading..."}
              </div>
              <div className="text-xs text-gray-500">4 roommates</div>
            </div>
            <Link 
              href="/settings" 
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg",
                location === "/settings"
                  ? "bg-indigo-50 text-primary" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80" 
              alt="User profile" 
              className="h-10 w-10 rounded-full" 
            />
            <div>
              <div className="font-medium">Emma Wilson</div>
              <button className="text-xs text-gray-500 hover:text-primary">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className={`bg-white h-full w-72 shadow-xl overflow-y-auto transform transition duration-300 ${mobileMenuOpen ? '' : '-translate-x-full'}`}>
          <div className="p-4 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              RoomieTask
            </h1>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-gray-500"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4 border-b">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
              <SearchIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg",
                  location === item.path 
                    ? "bg-indigo-50 text-primary" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your Household
              </h3>
              <div className="px-3 py-2 rounded-lg bg-indigo-50 mb-2">
                <div className="font-medium text-primary">
                  {household?.name || "Loading..."}
                </div>
                <div className="text-xs text-gray-500">4 roommates</div>
              </div>
              <Link 
                href="/settings" 
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg",
                  location === "/settings"
                    ? "bg-indigo-50 text-primary" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <SettingsIcon className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
