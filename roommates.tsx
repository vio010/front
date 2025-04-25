import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Components
import { RoommateCard } from "@/components/dashboard/roommate-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function Roommates() {
  const { toast } = useToast();
  
  // Get active household ID
  const householdId = 1;
  
  // Fetch household stats
  const { data: householdStats } = useQuery({
    queryKey: [`/api/stats/household/${householdId}`],
  });
  
  // Fetch household members
  const { data: householdMembers = [], isLoading } = useQuery({
    queryKey: [`/api/households/${householdId}/members`],
  });
  
  // Handle view roommate details
  const handleViewRoommateDetails = (userId: number) => {
    // In a real app, this would navigate to a roommate details page or open a modal
    toast({
      title: "Roommate Details",
      description: `View details for roommate #${userId}`,
    });
  };
  
  return (
    <div className="py-6 space-y-6">
      <div className="px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">Roommates</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your household members
        </p>
      </div>
      
      {/* Household Overview */}
      <div className="px-4 md:px-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Household Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Total Chores</p>
                <p className="text-2xl font-semibold">{householdStats?.totalChores || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold">{householdStats?.completedChores || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-semibold">{householdStats?.pendingChores || 0}</p>
              </div>
            </div>
            
            <h3 className="text-md font-medium mb-2">Roommate Contributions</h3>
            
            {householdStats?.members?.map((member: any) => (
              <div key={member.userId} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.contribution}%</p>
                </div>
                <Progress value={member.contribution} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Roommate Cards */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Household Members</h2>
          <Button 
            variant="outline" 
            className="flex items-center"
          >
            <span className="material-icons text-sm mr-1">person_add</span>
            Invite Roommate
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
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
