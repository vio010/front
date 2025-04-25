import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Progress } from "@/components/ui/progress";
import { type User } from "@shared/schema";

interface RoommateCardProps {
  user: User;
  contribution: number;
  completedChores: number;
  onViewDetails: (userId: number) => void;
}

export function RoommateCard({
  user,
  contribution,
  completedChores,
  onViewDetails
}: RoommateCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col items-center">
          <AvatarWithStatus
            src={user.avatar}
            name={user.name}
            status={user.isOnline ? "online" : "offline"}
            size="lg"
            className="mb-3"
          />
          
          <h3 className="text-base font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{contribution}% contribution</p>
          
          <div className="w-full mt-2">
            <Progress 
              value={contribution} 
              className="h-2"
            />
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            {completedChores} chores completed this week
          </p>
          
          <Button 
            variant="link" 
            className="mt-3 text-sm text-primary hover:text-indigo-800 p-0 h-auto"
            onClick={() => onViewDetails(user.id)}
          >
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
