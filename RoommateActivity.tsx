import { formatDistanceToNow } from "date-fns";
import { Activity, User } from "@/types";

interface RoommateActivityProps {
  activities: (Activity & { user: User })[];
}

const RoommateActivity = ({ activities }: RoommateActivityProps) => {
  // Generate message for activity
  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case "task_completed":
        return `Completed the task "${activity.metadata?.taskTitle || 'Unknown task'}".`;
      case "task_created":
        return `Created a new task "${activity.metadata?.taskTitle || 'Unknown task'}".`;
      case "task_assigned":
        return `Was assigned the task "${activity.metadata?.taskTitle || 'Unknown task'}".`;
      default:
        return "Made an update.";
    }
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const timestamp = new Date(date);
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Roommate Activity</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="border-b p-4 last:border-0">
              <div className="flex items-start">
                <img 
                  src={activity.user.avatar || "https://via.placeholder.com/40"} 
                  alt={`${activity.user.firstName} profile`} 
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800">
                      {activity.user.firstName} {activity.user.lastName}
                    </h4>
                    <span className="ml-2 text-xs text-gray-500">
                      {formatTimestamp(activity.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {getActivityMessage(activity)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoommateActivity;
