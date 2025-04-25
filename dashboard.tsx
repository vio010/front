import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Components
import { StatCard } from "@/components/dashboard/stat-card";
import { ChoreCard } from "@/components/dashboard/chore-card";
import { CompletedChoreItem } from "@/components/dashboard/completed-chore-item";
import { RoommateCard } from "@/components/dashboard/roommate-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for displaying chore details or roommate details
  const [selectedChoreId, setSelectedChoreId] = useState<number | null>(null);
  
  // Get active household ID (in a real app, you would allow users to switch between households)
  const householdId = 1;
  
  // Fetch stats for the household
  const { data: householdStats, isLoading: isStatsLoading } = useQuery({
    queryKey: [`/api/stats/household/${householdId}`],
  });
  
  // Fetch upcoming chores
  const { data: upcomingChores = [], isLoading: isUpcomingLoading } = useQuery({
    queryKey: ["/api/chores/upcoming", householdId],
    queryFn: async () => {
      const response = await fetch(`/api/chores/upcoming?householdId=${householdId}`);
      if (!response.ok) throw new Error("Failed to fetch upcoming chores");
      return response.json();
    },
  });
  
  // Fetch recently completed chores
  const { data: completedChores = [], isLoading: isCompletedLoading } = useQuery({
    queryKey: ["/api/chores/completed", householdId],
    queryFn: async () => {
      const response = await fetch(`/api/chores/completed?householdId=${householdId}`);
      if (!response.ok) throw new Error("Failed to fetch completed chores");
      return response.json();
    },
  });
  
  // Fetch household members (roommates)
  const { data: householdMembers = [], isLoading: isMembersLoading } = useQuery({
    queryKey: [`/api/households/${householdId}/members`],
  });
  
  // Fetch user stats
  const { data: userStats, isLoading: isUserStatsLoading } = useQuery({
    queryKey: ["/api/stats/user", householdId],
    queryFn: async () => {
      const response = await fetch(`/api/stats/user?householdId=${householdId}`);
      if (!response.ok) throw new Error("Failed to fetch user stats");
      return response.json();
    },
  });
  
  // Complete chore mutation
  const completeChore = useMutation({
    mutationFn: async (choreId: number) => {
      return await apiRequest("POST", `/api/chores/${choreId}/complete`, {});
    },
    onSuccess: () => {
      // Invalidate the queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/chores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chores/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chores/completed"] });
      queryClient.invalidateQueries({ queryKey: [`/api/stats/household/${householdId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/user"] });
      
      toast({
        title: "Chore completed",
        description: "The chore has been marked as complete!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark chore as complete.",
        variant: "destructive",
      });
    },
  });
  
  // Handle marking a chore as complete
  const handleMarkComplete = (choreId: number) => {
    completeChore.mutate(choreId);
  };
  
  // Handle opening chore details
  const handleOpenChoreDetails = (choreId: number) => {
    setSelectedChoreId(choreId);
    // In a real app, this would navigate to a chore details page or open a modal
    toast({
      title: "Chore Details",
      description: `View details for chore #${choreId}`,
    });
  };
  
  // Handle view roommate details
  const handleViewRoommateDetails = (userId: number) => {
    // In a real app, this would navigate to a roommate details page or open a modal
    toast({
      title: "Roommate Details",
      description: `View details for roommate #${userId}`,
    });
  };
  
  // Stats calculations
  const totalChores = householdStats?.totalChores || 0;
  const completedCount = householdStats?.completedChores || 0;
  const completionRate = totalChores > 0 ? Math.round((completedCount / totalChores) * 100) : 0;
  
  // Find current user's stats
  const currentUserStats = householdStats?.members?.find(
    (member: any) => member.userId === user?.id
  );

  // Due today count
  const dueTodayCount = upcomingChores.filter((chore: any) => {
    const dueDate = new Date(chore.dueDate);
    const today = new Date();
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  }).length;
  
  // Find next chore due
  const nextChore = upcomingChores[0];
  const nextChoreText = nextChore 
    ? `${nextChore.name} (in ${new Date(nextChore.dueDate).getHours() - new Date().getHours()} hours)` 
    : "None";
  
  return (
    <div className="py-6 space-y-6">
      {/* Dashboard Header */}
      <div className="px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Your household chore overview for this week</p>
      </div>
      
      {/* Dashboard Stats */}
      <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {isStatsLoading || isUserStatsLoading ? (
          // Loading skeletons
          <>
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
          </>
        ) : (
          <>
            {/* Completed Chores */}
            <StatCard
              icon="assignment_turned_in"
              iconColor="primary"
              title="Completed Chores"
              value={`${completedCount}/${totalChores}`}
              progress={completionRate}
            />
            
            {/* Due Today */}
            <StatCard
              icon="schedule"
              iconColor="warning"
              title="Due Today"
              value={dueTodayCount}
              subtitle={`Next: ${nextChoreText}`}
            />
            
            {/* Your Contribution */}
            <StatCard
              icon="person"
              iconColor="success"
              title="Your Contribution"
              value={`${currentUserStats?.contribution || 0}%`}
              trendDirection="up"
              trendValue="5% from last week"
            />
          </>
        )}
      </div>
      
      {/* Upcoming Chores Section */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Chores</h2>
          <a href="#" className="text-sm font-medium text-primary hover:text-indigo-800">
            View all
          </a>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isUpcomingLoading ? (
            // Loading skeletons
            <>
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </>
          ) : upcomingChores.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No upcoming chores. Take a break!</p>
              <Button 
                className="mt-4"
                onClick={() => document.querySelector('[data-event="click:openNewChoreModal"]')?.click()}
              >
                Create a new chore
              </Button>
            </div>
          ) : (
            // Display upcoming chores
            upcomingChores.slice(0, 3).map((chore: any) => {
              // Find the assignee from the household members
              const assignee = householdMembers.find(
                (member: any) => member.userId === chore.assignedTo
              )?.user || { name: 'Unassigned', avatar: '' };
              
              return (
                <ChoreCard
                  key={chore.id}
                  chore={chore}
                  assignee={assignee}
                  onMarkComplete={handleMarkComplete}
                  onOpenDetails={handleOpenChoreDetails}
                />
              );
            })
          )}
        </div>
      </div>
      
      {/* Recently Completed Section */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recently Completed</h2>
          <a href="#" className="text-sm font-medium text-primary hover:text-indigo-800">
            View history
          </a>
        </div>
        
        <div className="mt-4 bg-white shadow overflow-hidden rounded-lg">
          {isCompletedLoading ? (
            // Loading skeleton
            <div className="divide-y divide-gray-200">
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
            </div>
          ) : completedChores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No completed chores yet. Get to work!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {completedChores.map((chore: any) => {
                // Find the user who completed the chore
                const completedBy = householdMembers.find(
                  (member: any) => member.userId === chore.completedBy
                )?.user || { name: 'Unknown', avatar: '' };
                
                return (
                  <CompletedChoreItem
                    key={chore.id}
                    chore={chore}
                    completedBy={completedBy}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>
      
      {/* Roommate Section */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Roommate Activity</h2>
          <a href="/roommates" className="text-sm font-medium text-primary hover:text-indigo-800">
            Manage roommates
          </a>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isMembersLoading ? (
            // Loading skeletons
            <>
              <Skeleton className="h-[220px] w-full" />
              <Skeleton className="h-[220px] w-full" />
              <Skeleton className="h-[220px] w-full" />
              <Skeleton className="h-[220px] w-full" />
            </>
          ) : (
            <>
              {/* Display roommates */}
              {householdMembers.map((member: any) => {
                const memberStats = householdStats?.members?.find(
                  (stats: any) => stats.userId === member.user.id
                ) || { contribution: 0, completed: 0 };
                
                return (
                  <RoommateCard
                    key={member.user.id}
                    user={member.user}
                    contribution={memberStats.contribution}
                    completedChores={memberStats.completed}
                    onViewDetails={handleViewRoommateDetails}
                  />
                );
              })}
              
              {/* Invite roommate card */}
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-5 flex flex-col items-center justify-center">
                  <span className="material-icons text-gray-400 text-3xl mb-2">person_add</span>
                  <Button 
                    variant="link"
                    className="text-sm font-medium text-primary hover:text-indigo-800"
                  >
                    Invite a roommate
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
