import { useQuery, useMutation } from "@tanstack/react-query";
import { Task, TaskWithAssignee, StatsSummary } from "@/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useTasks(householdId: number) {
  const { toast } = useToast();

  // Fetch tasks for a household
  const { data: tasks = [], isLoading, isError } = useQuery<TaskWithAssignee[]>({
    queryKey: [`/api/households/${householdId}/tasks`],
  });

  // Calculate task stats
  const stats: StatsSummary = tasks.reduce(
    (acc, task) => {
      if (task.completed) {
        acc.completedCount += 1;
      } else {
        acc.pendingCount += 1;
      }
      return acc;
    },
    { 
      pendingCount: 0, 
      completedCount: 0, 
      weeklyProgress: 0,
      pendingDiff: 2,  // Mocked difference from previous week
      completedDiff: 3 // Mocked difference from previous week
    }
  );

  // Calculate progress
  if (tasks.length > 0) {
    stats.weeklyProgress = Math.round((stats.completedCount / tasks.length) * 100);
  }

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const response = await apiRequest("POST", "/api/tasks", newTask);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Task created",
        description: "New task has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/activities`] });
    },
    onError: () => {
      toast({
        title: "Failed to create task",
        description: "There was an error creating the task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: number; userId: number }) => {
      const response = await apiRequest("POST", `/api/tasks/${taskId}/complete`, { userId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Task completed",
        description: "Task has been marked as completed",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/activities`] });
    },
    onError: () => {
      toast({
        title: "Failed to complete task",
        description: "There was an error completing the task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: number; updates: Partial<Task> }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${taskId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/tasks`] });
    },
    onError: () => {
      toast({
        title: "Failed to update task",
        description: "There was an error updating the task. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    stats,
    isLoading,
    isError,
    createTask: createTaskMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isCompleting: completeTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
  };
}
