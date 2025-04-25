import { useTaskContext } from "@/contexts/TaskContext";
import SummaryStats from "@/components/dashboard/SummaryStats";
import TaskList from "@/components/dashboard/TaskList";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import RoommateActivity from "@/components/dashboard/RoommateActivity";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { isLoading, tasks, groupedTasks, household } = useTaskContext();

  // Get summary stats
  const stats = {
    pendingCount: tasks.filter(task => !task.completed).length,
    completedCount: tasks.filter(task => task.completed).length,
    weeklyProgress: Math.round((tasks.filter(task => task.completed).length / (tasks.length || 1)) * 100),
    pendingDiff: 2, // Mock data for now
    completedDiff: 3  // Mock data for now
  };

  // Fetch activities for the household
  const { 
    data: activities = [], 
    isLoading: isActivitiesLoading 
  } = useQuery({
    queryKey: [`/api/households/${household?.id}/activities`],
    enabled: !!household?.id,
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">Manage your apartment chores and roommate assignments</p>
      </div>

      <SummaryStats 
        pendingCount={stats.pendingCount}
        completedCount={stats.completedCount}
        weeklyProgress={stats.weeklyProgress}
        pendingDiff={stats.pendingDiff}
        completedDiff={stats.completedDiff}
      />

      <TaskList 
        title="Today's Tasks" 
        tasks={groupedTasks.today}
        showAddButton={true} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingTasks tasks={groupedTasks.upcoming} />
        
        {isActivitiesLoading ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Roommate Activity</h3>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        ) : (
          <RoommateActivity activities={activities} />
        )}
      </div>
    </div>
  );
}
