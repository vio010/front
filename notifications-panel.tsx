import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const { toast } = useToast();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: open,
  });
  
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/notifications/read-all", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
  });
  
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>
      <div className="absolute right-0 top-16 mt-2 mr-4 md:mr-6 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            <button 
              type="button" 
              className="text-sm text-primary hover:text-indigo-800 focus:outline-none"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              Mark all as read
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification: any) => {
              // Determine icon based on notification type
              let icon;
              let iconColor;
              
              switch (notification.type) {
                case "reminder":
                  icon = "notification_important";
                  iconColor = "text-amber-500";
                  break;
                case "completion":
                  icon = "check_circle";
                  iconColor = "text-emerald-600";
                  break;
                case "assignment":
                  icon = "assignment";
                  iconColor = "text-primary";
                  break;
                case "rotation":
                  icon = "update";
                  iconColor = "text-primary";
                  break;
                case "summary":
                  icon = "bar_chart";
                  iconColor = "text-primary";
                  break;
                default:
                  icon = "info";
                  iconColor = "text-primary";
              }
              
              const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { 
                addSuffix: true 
              });
              
              return (
                <div 
                  key={notification.id}
                  className={notification.read ? "p-4" : "p-4 bg-primary bg-opacity-5"}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className={`material-icons ${iconColor}`}>{icon}</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{timeAgo}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 text-center">
          <a href="#" className="text-sm font-medium text-primary hover:text-indigo-800">
            View all notifications
          </a>
        </div>
      </div>
    </div>
  );
}
