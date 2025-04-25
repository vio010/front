import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { type Chore, type User } from "@shared/schema";
import { formatDistanceToNow, format, isToday, isTomorrow } from "date-fns";

interface ChoreCardProps {
  chore: Chore;
  assignee: User;
  onMarkComplete: (id: number) => void;
  onOpenDetails: (id: number) => void;
}

export function ChoreCard({ 
  chore, 
  assignee, 
  onMarkComplete, 
  onOpenDetails 
}: ChoreCardProps) {
  // Format due date
  const dueDate = new Date(chore.dueDate);
  
  let statusBadge;
  if (chore.completed) {
    statusBadge = (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 bg-opacity-10 text-emerald-600">
        Completed
      </span>
    );
  } else if (isToday(dueDate)) {
    statusBadge = (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 bg-opacity-10 text-amber-500">
        Due Today
      </span>
    );
  } else if (isTomorrow(dueDate)) {
    statusBadge = (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
        Tomorrow
      </span>
    );
  } else {
    statusBadge = (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
        {format(dueDate, "MMM d")}
      </span>
    );
  }
  
  const formattedDueTime = format(dueDate, "h:mm a");
  const formattedDueDate = isToday(dueDate) 
    ? `today at ${formattedDueTime}` 
    : isTomorrow(dueDate) 
      ? `tomorrow at ${formattedDueTime}` 
      : `${format(dueDate, "MMM d")} at ${formattedDueTime}`;

  const assignedTimeAgo = formatDistanceToNow(dueDate, { addSuffix: true });
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">{chore.name}</h3>
            <p className="mt-1 text-sm text-gray-500">Due {formattedDueDate}</p>
          </div>
          {statusBadge}
        </div>
        
        <div className="mt-4 flex items-center">
          <AvatarWithStatus
            src={assignee.avatar}
            name={assignee.name}
            status={assignee.isOnline ? "online" : "offline"}
            size="sm"
          />
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-900">{assignee.name}</p>
            <p className="text-xs text-gray-500">Assigned {assignedTimeAgo}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-5 py-3 flex justify-between">
        <Button 
          variant="link" 
          className="text-sm font-medium text-primary hover:text-indigo-800 p-0 h-auto"
          disabled={chore.completed}
          onClick={() => onMarkComplete(chore.id)}
        >
          {chore.completed ? "Completed!" : "Mark as complete"}
        </Button>
        
        <Button 
          variant="link" 
          className="text-sm font-medium text-gray-500 hover:text-gray-600 p-0 h-auto"
          onClick={() => onOpenDetails(chore.id)}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
