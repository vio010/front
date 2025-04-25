import { useQuery } from "@tanstack/react-query";
import { useTaskContext } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, TaskWithAssignee } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function Roommates() {
  const { users, tasks, household } = useTaskContext();

  // Calculate task stats for each roommate
  const roommateStats = users.map(user => {
    const userTasks = tasks.filter(task => task.assignedToId === user.id);
    const completedTasks = userTasks.filter(task => task.completed);
    const completionRate = userTasks.length 
      ? Math.round((completedTasks.length / userTasks.length) * 100) 
      : 0;
    
    return {
      ...user,
      taskCount: userTasks.length,
      completedCount: completedTasks.length,
      completionRate
    };
  });

  // Function to get initials from name
  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Roommates</h2>
        <p className="text-gray-600">
          View and manage your household members and their tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {roommateStats.map(roommate => (
          <Card key={roommate.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={roommate.avatar} alt={roommate.firstName} />
                  <AvatarFallback className="text-lg bg-primary text-white">
                    {getInitials(roommate.firstName, roommate.lastName)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">
                  {roommate.firstName} {roommate.lastName}
                </h3>
                <div className="mt-4 w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tasks Assigned</span>
                    <span className="font-medium">{roommate.taskCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tasks Completed</span>
                    <span className="font-medium">{roommate.completedCount}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Completion Rate</span>
                      <span className="font-medium">{roommate.completionRate}%</span>
                    </div>
                    <Progress value={roommate.completionRate} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-4 pl-4">Roommate</th>
                  <th className="text-left pb-4">Tasks</th>
                  <th className="text-left pb-4">Next Due</th>
                  <th className="text-left pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {roommateStats.map(roommate => {
                  const pendingTasks = tasks
                    .filter(task => task.assignedToId === roommate.id && !task.completed)
                    .sort((a, b) => {
                      if (!a.dueDate) return 1;
                      if (!b.dueDate) return -1;
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    });
                  
                  const nextDueTask = pendingTasks[0];
                  
                  return (
                    <tr key={roommate.id} className="border-b">
                      <td className="py-4 pl-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={roommate.avatar} alt={roommate.firstName} />
                            <AvatarFallback className="text-xs bg-primary text-white">
                              {getInitials(roommate.firstName, roommate.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{roommate.firstName} {roommate.lastName}</span>
                        </div>
                      </td>
                      <td>
                        {roommate.taskCount === 0 ? (
                          <Badge variant="outline">No tasks</Badge>
                        ) : (
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-primary/10">
                              {pendingTasks.length} pending
                            </Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {roommate.completedCount} completed
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td>
                        {nextDueTask ? (
                          <span>{nextDueTask.dueDate 
                            ? new Date(nextDueTask.dueDate).toLocaleDateString()
                            : 'No due date'}
                          </span>
                        ) : 'None'}
                      </td>
                      <td>
                        {roommate.taskCount === 0 ? (
                          <Badge variant="outline">No tasks</Badge>
                        ) : pendingTasks.length > 0 ? (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            In progress
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            All completed
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
