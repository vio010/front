import { useState } from "react";
import { PlusIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskWithAssignee } from "@/types";
import TaskItem from "../tasks/TaskItem";
import AddTaskDialog from "../tasks/AddTaskDialog";
import { useTaskContext } from "@/contexts/TaskContext";

interface TaskListProps {
  title: string;
  tasks: TaskWithAssignee[];
  showAddButton?: boolean;
}

const TaskList = ({ title, tasks, showAddButton = false }: TaskListProps) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { completeTask } = useTaskContext();

  // Listen for the custom event to open the dialog
  useState(() => {
    const handleOpenAddTask = () => setIsAddTaskOpen(true);
    document.addEventListener("open-add-task-dialog", handleOpenAddTask);
    return () => {
      document.removeEventListener("open-add-task-dialog", handleOpenAddTask);
    };
  });

  const handleTaskComplete = (taskId: number) => {
    completeTask(taskId);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        {showAddButton && (
          <Button 
            onClick={() => setIsAddTaskOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center hover:bg-indigo-600 transition duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Task
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {tasks.length === 0 ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100 mb-4">
              <ClockIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {showAddButton 
                ? "Add a new task to get started" 
                : "There are no tasks in this category"}
            </p>
            {showAddButton && (
              <Button 
                onClick={() => setIsAddTaskOpen(true)}
                variant="outline" 
                className="mt-4"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add a task
              </Button>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task}
              onComplete={handleTaskComplete}
            />
          ))
        )}
      </div>

      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
    </>
  );
};

export default TaskList;
