import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { useAuth } from "@/hooks/use-auth";

interface TopBarProps {
  onMenuButtonClick: () => void;
  onNotificationsClick: () => void;
  onNewChoreClick: () => void;
}

export default function TopBar({ 
  onMenuButtonClick, 
  onNotificationsClick,
  onNewChoreClick
}: TopBarProps) {
  const { user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between h-16 bg-white shadow-sm px-4 md:px-6">
      {/* Mobile Menu Button */}
      <button 
        type="button" 
        className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
        onClick={onMenuButtonClick}
      >
        <span className="material-icons">menu</span>
      </button>
      
      <div className="md:hidden flex-1 flex justify-center">
        <h1 className="text-lg font-bold text-primary">RoomieTask</h1>
      </div>
      
      {/* Desktop Search Bar */}
      <div className="hidden md:flex md:flex-1 md:max-w-md">
        <div className="w-full">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400">search</span>
            </div>
            <Input 
              id="search" 
              name="search" 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
              placeholder="Search for chores, roommates..." 
              type="search"
            />
          </div>
        </div>
      </div>
      
      {/* Right side buttons */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button 
          type="button" 
          className="relative p-1 text-gray-500 hover:text-gray-600 focus:outline-none"
          onClick={onNotificationsClick}
        >
          <span className="material-icons">notifications</span>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* Create new chore button (desktop) */}
        <Button 
          className="hidden md:flex items-center px-3 py-1.5 text-sm"
          onClick={onNewChoreClick}
        >
          <span className="material-icons text-sm mr-1">add</span>
          New Chore
        </Button>
        
        {/* User menu (mobile only) */}
        <div className="md:hidden relative">
          <button 
            type="button" 
            className="flex text-sm rounded-full focus:outline-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            {user && (
              <AvatarWithStatus
                src={user.avatar}
                name={user.name}
                status="none"
                size="sm"
              />
            )}
          </button>
          
          {/* Mobile User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs">{user?.email}</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <button
                onClick={() => {
                  // Handle logout logic
                  setIsUserMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
