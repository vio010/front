import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { type Chore, type User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface CompletedChoreItemProps {
  chore: Chore;
  completedBy: User;
}

export function CompletedChoreItem({ chore, completedBy }: CompletedChoreItemProps) {
  // Format the completion time
  const completedTimeAgo = chore.completedAt 
    ? formatDistanceToNow(new Date(chore.completedAt), { addSuffix: true }) 
    : "";
  
  return (
    <li className="px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <span className="material-icons text-emerald-600">check_circle</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{chore.name}</p>
            <p className="text-xs text-gray-500">Completed {completedTimeAgo}</p>
          </div>
        </div>
        <div className="flex items-center">
          <AvatarWithStatus
            src={completedBy.avatar}
            name={completedBy.name}
            status="none"
            size="sm"
          />
        </div>
      </div>
    </li>
  );
}
