import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task, TaskWithAssignee, User } from '@/types';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";

interface TaskContextType {
  isLoading: boolean;
  tasks: TaskWithAssignee[];
  users: User[];
  household: { id: number; name: string } | null;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  completeTask: (id: number) => Promise<void>;
  groupedTasks: {
    today: TaskWithAssignee[];
    upcoming: TaskWithAssignee[];
    completed: TaskWithAssignee[];
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [household, setHousehold] = useState<{ id: number; name: string } | null>(null);
  const { toast } = useToast();

  // This would typically be determined by user login
  const currentUserId = 1;
  const defaultHouseholdId = 1;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch household data
        const householdData = await queryClient.fetchQuery({
          queryKey: [`/api/households/${defaultHouseholdId}`],
        });
        setHousehold({ id: householdData.id, name: householdData.name });

        // Fetch tasks for household
        const tasksData = await queryClient.fetchQuery({
          queryKey: [`/api/households/${defaultHouseholdId}/tasks`],
        });

        // Fetch users for household
        const usersData = await queryClient.fetchQuery({
          queryKey: [`/api/households/${defaultHouseholdId}/users`],
        });
        
        // Extract user information from household users
        const houseUsers = usersData.map((userHousehold: any) => userHousehold.user);
        setUsers(houseUsers);

        // Combine tasks with user information
        const tasksWithAssignees = tasksData.map((task: Task) => {
          const assignee = task.assignedToId 
            ? houseUsers.find((user: User) => user.id === task.assignedToId)
            : undefined;
          return { ...task, assignee };
        });

        setTasks(tasksWithAssignees);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: "Error loading data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = {
        ...taskData,
        householdId: defaultHouseholdId,
        createdById: currentUserId,
        sendReminder: taskData.sendReminder ?? true,
        recurring: taskData.recurring ?? 'never'
      };

      const createdTask = await apiRequest('POST', '/api/tasks', newTask);
      const taskJson = await createdTask.json();
      
      // Find assignee
      const assignee = taskJson.assignedToId 
        ? users.find(user => user.id === taskJson.assignedToId)
        : undefined;
      
      setTasks(prev => [...prev, { ...taskJson, assignee }]);
      
      toast({
        title: "Task Created",
        description: "Your new task has been added successfully",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/households/${defaultHouseholdId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${defaultHouseholdId}/activities`] });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: "Failed to create task",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const response = await apiRequest('PATCH', `/api/tasks/${id}`, updates);
      const updatedTask = await response.json();
      
      // Find assignee if the assignee changed
      let assignee = undefined;
      if (updates.assignedToId) {
        assignee = users.find(user => user.id === updates.assignedToId);
      } else {
        // Keep existing assignee
        const existingTask = tasks.find(t => t.id === id);
        assignee = existingTask?.assignee;
      }
      
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...updatedTask, assignee } : task
        )
      );
      
      toast({
        title: "Task Updated",
        description: "The task has been updated successfully",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/households/${defaultHouseholdId}/tasks`] });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: "Failed to update task",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const completeTask = async (id: number) => {
    try {
      const response = await apiRequest('POST', `/api/tasks/${id}/complete`, { userId: currentUserId });
      const completedTask = await response.json();
      
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...completedTask, assignee: task.assignee } : task
        )
      );
      
      toast({
        title: "Task Completed",
        description: "The task has been marked as completed",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/households/${defaultHouseholdId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${defaultHouseholdId}/activities`] });
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast({
        title: "Failed to complete task",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Group tasks by their status
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      if (task.completed) {
        acc.completed.push(task);
        return acc;
      }

      const taskDate = task.dueDate ? new Date(task.dueDate) : new Date();
      const today = new Date();
      
      // Check if the task is due today
      if (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      ) {
        acc.today.push(task);
      } else {
        acc.upcoming.push(task);
      }
      
      return acc;
    },
    { today: [] as TaskWithAssignee[], upcoming: [] as TaskWithAssignee[], completed: [] as TaskWithAssignee[] }
  );

  return (
    <TaskContext.Provider
      value={{
        isLoading,
        tasks,
        users,
        household,
        createTask,
        updateTask,
        completeTask,
        groupedTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
