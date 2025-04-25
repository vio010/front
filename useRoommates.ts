import { useQuery } from "@tanstack/react-query";
import { User, Activity } from "@/types";

export function useRoommates(householdId: number) {
  // Fetch household users (roommates)
  const { data: roommates = [], isLoading, isError } = useQuery<{ user: User }[]>({
    queryKey: [`/api/households/${householdId}/users`],
  });
  
  // Get just the user objects
  const users = roommates.map(item => item.user);

  // Fetch roommate activities
  const { 
    data: activities = [], 
    isLoading: isActivitiesLoading,
    isError: isActivitiesError
  } = useQuery<(Activity & { user: User })[]>({
    queryKey: [`/api/households/${householdId}/activities`],
  });

  return {
    users,
    activities,
    isLoading: isLoading || isActivitiesLoading,
    isError: isError || isActivitiesError,
  };
}
