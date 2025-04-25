import { useState, ReactNode, useEffect } from "react";
import Sidebar from "./sidebar";
import { useLocation } from "wouter";
import { useTaskContext } from "@/contexts/TaskContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BellIcon, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isLoading: tasksLoading } = useTaskContext();
  const { user } = useAuth();
  const { theme } = useTheme();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Function to get the page title based on current path
  const getPageTitle = () => {
    const path = location === "/" ? "/dashboard" : location;
    const title = path.substring(1);
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button 
                variant="ghost" 
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <Sidebar mobile={true} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top bar */}
        <header className="bg-card shadow-sm w-full dark:border-b dark:border-muted">
          <div className="flex justify-between items-center px-4 py-3 md:px-6">
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-foreground focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-primary ml-2">RoommateChore</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-foreground focus:outline-none relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
              </button>
              
              <div className="md:hidden">
                {user && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-foreground">
                    {user.firstName.charAt(0)}{user.lastName ? user.lastName.charAt(0) : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {tasksLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
              <Skeleton className="h-64 rounded-lg mt-6" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
