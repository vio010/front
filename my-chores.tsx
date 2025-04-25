import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Components
import { ChoreCard } from "@/components/dashboard/chore-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyChores() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get active household ID
  const householdId = 1;
  
  // Fetch user's chores
  const { data: chores = [], isLoading } = useQuery({
    queryKey: ["/api/chores", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/chores?householdId=${householdId}`);
      if (!response.ok) throw new Error("Failed to fetch chores");
      return response.json();
    },
  });
  
  // Fetch household members
  const { data: householdMembers = [] } = useQuery({
    queryKey: [`/api/households/${householdId}/members`],
  });
  
  // Complete chore mutation
  const completeChore = useMutation({
    mutationFn: async (choreId: number) => {
      return await apiRequest("POST", `/api/chores/${choreId}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chores"] });
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
    // In a real app, this would navigate to a chore details page or open a modal
    toast({
      title: "Chore Details",
      description: `View details for chore #${choreId}`,
    });
  };
  
  // Filter chores by status
  const pendingChores = chores.filter((chore: any) => !chore.completed && chore.assignedTo === user?.id);
  const completedChores = chores.filter((chore: any) => chore.completed && chore.assignedTo === user?.id);
  const assignedToOthers = chores.filter((chore: any) => chore.assignedTo !== user?.id);
  
  return (
    <div className="py-6 space-y-6">
      <div className="px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Chores</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your assigned chores
        </p>
      </div>
      
      <div className="px-4 md:px-6">
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingChores.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedChores.length})
            </TabsTrigger>
            <TabsTrigger value="others">
              Assigned to Others ({assignedToOthers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : pendingChores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending chores assigned to you. Good job!</p>
                <Button 
                  className="mt-4"
                  onClick={() => document.querySelector('[data-event="click:openNewChoreModal"]')?.click()}
                >
                  Create a new chore
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingChores.map((chore: any) => {
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
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : completedChores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't completed any chores yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedChores.map((chore: any) => {
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
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="others" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : assignedToOthers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No chores assigned to other roommates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedToOthers.map((chore: any) => {
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
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
