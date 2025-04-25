import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskList from "@/components/dashboard/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddTaskDialog from "@/components/tasks/AddTaskDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Tasks() {
  const { groupedTasks } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
          <p className="text-gray-600">View and manage your assigned chores</p>
        </div>

        <Button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center hover:bg-indigo-600 transition duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Task
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="today">
            Today ({groupedTasks.today.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({groupedTasks.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({groupedTasks.completed.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <TaskList title="Today's Tasks" tasks={groupedTasks.today} />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <TaskList title="Upcoming Tasks" tasks={groupedTasks.upcoming} />
        </TabsContent>
        
        <TabsContent value="completed">
          <TaskList title="Completed Tasks" tasks={groupedTasks.completed} />
        </TabsContent>
      </Tabs>

      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
    </div>
  );
}
