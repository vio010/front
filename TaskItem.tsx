import { useState } from "react";
import { format } from "date-fns";
import { ClockIcon, MoreVerticalIcon } from "lucide-react";
import { TaskWithAssignee } from "@/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskItemProps {
  task: TaskWithAssignee;
  onComplete: (taskId: number) => void;
  className?: string;
}

const TaskItem = ({ task, onComplete, className }: TaskItemProps) => {
  const [checked, setChecked] = useState(task.completed);

  const handleCheckboxChange = () => {
    // Only allow completing tasks, not uncompleting
    if (!checked) {
      setChecked(true);
      onComplete(task.id);
    }
  };

  // Determine task status for styling
  const getTaskClass = () => {
    if (task.completed) return "completed";
    
    if (!task.dueDate) return "upcoming";
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate < today) return "overdue";
    if (taskDate.getTime() === today.getTime()) return "today";
    return "upcoming";
  };

  // Format the due date and time
  const formatDueDateTime = () => {
    if (!task.dueDate) return "No due date";
    
    const dueDate = new Date(task.dueDate);
    
    // Get just the date part (Today, Tomorrow, or formatted date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    let dateString;
    if (taskDate.getTime() === today.getTime()) {
      dateString = "Today";
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      dateString = "Tomorrow";
    } else {
      dateString = format(dueDate, "EEE, MMM d");
    }
    
    // Get time
    const timeString = format(dueDate, "h:mm a");
    
    return `${dateString}, ${timeString}`;
  };

  return (
    <div 
      className={cn(
        "border-b p-4 flex items-center justify-between",
        "task-card", // Base class
        getTaskClass(), // Status-specific class
        className
      )}
    >
      <div className="flex items-center">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={handleCheckboxChange}
          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary mr-3 cursor-pointer"
        />
        <div>
          <h4 className={cn(
            "font-medium", 
            task.completed ? "text-gray-500 line-through" : "text-gray-800"
          )}>
            {task.title}
          </h4>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatDueDateTime()}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {task.assignee && (
          <div className="mr-4">
            <img 
              src={task.assignee.avatar || "https://via.placeholder.com/40"} 
              alt={`Assigned to ${task.assignee.firstName}`} 
              className="h-8 w-8 rounded-full border-2 border-white"
            />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVerticalIcon className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={checked}>Mark as completed</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskItem;
