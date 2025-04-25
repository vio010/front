import { TaskWithAssignee } from "@/types";
import TaskItem from "../tasks/TaskItem";
import { useTaskContext } from "@/contexts/TaskContext";

interface UpcomingTasksProps {
  tasks: TaskWithAssignee[];
}

const UpcomingTasks = ({ tasks }: UpcomingTasksProps) => {
  const { completeTask } = useTaskContext();

  const handleTaskComplete = (taskId: number) => {
    completeTask(taskId);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No upcoming tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task}
              onComplete={handleTaskComplete}
              className="task-card upcoming"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingTasks;
