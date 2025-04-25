import { useTaskContext } from "@/contexts/TaskContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function Statistics() {
  const { tasks, users, groupedTasks } = useTaskContext();
  
  // Calculate stats per roommate
  const roommateStats = users.map(user => {
    const userTasks = tasks.filter(task => task.assignedToId === user.id);
    const completedTasks = userTasks.filter(task => task.completed);
    
    return {
      name: user.firstName,
      assigned: userTasks.length,
      completed: completedTasks.length,
      pending: userTasks.length - completedTasks.length
    };
  });
  
  // Calculate stats per task type (we'll use recurring as a proxy for task type)
  const taskTypeCount = tasks.reduce((acc, task) => {
    const type = task.recurring || 'never';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const taskTypeData = Object.keys(taskTypeCount).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: taskTypeCount[type]
  }));
  
  // Calculate completion time stats
  const completionTimeData = tasks
    .filter(task => task.completed && task.completedAt && task.dueDate)
    .map(task => {
      const dueDate = new Date(task.dueDate!);
      const completedDate = new Date(task.completedAt!);
      const diffMs = completedDate.getTime() - dueDate.getTime();
      
      // Getting absolute value to measure distance (early or late)
      // Positive is late, negative is early
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      
      return {
        taskId: task.id,
        taskTitle: task.title,
        daysFromDue: Math.round(diffDays),
        status: diffDays > 0 ? 'late' : 'early'
      };
    })
    .sort((a, b) => a.daysFromDue - b.daysFromDue)
    .slice(0, 5); // Get top 5
  
  // Colors for the pie chart
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Statistics</h2>
        <p className="text-gray-600">View household chore analytics and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {tasks.length}
            </CardTitle>
            <CardDescription>
              Total Tasks
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">
              {tasks.filter(task => task.completed).length}
            </CardTitle>
            <CardDescription>
              Completed Tasks
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-500">
              {tasks.filter(task => !task.completed).length}
            </CardTitle>
            <CardDescription>
              Pending Tasks
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Roommate</CardTitle>
            <CardDescription>
              Distribution of assigned and completed tasks per roommate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={roommateStats}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assigned" stackId="a" fill="#4F46E5" name="Assigned" />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Breakdown</CardTitle>
            <CardDescription>
              Distribution of tasks by type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Completion trends */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Task Completions</CardTitle>
          <CardDescription>
            Time to completion for recent tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completionTimeData.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No completed tasks with due dates yet</p>
          ) : (
            <div className="space-y-4">
              {completionTimeData.map(task => (
                <div key={task.taskId} className="flex items-center">
                  <div className="w-32 text-sm text-gray-500">
                    {task.daysFromDue === 0 
                      ? 'On time' 
                      : task.daysFromDue > 0 
                        ? `${task.daysFromDue} days late` 
                        : `${Math.abs(task.daysFromDue)} days early`}
                  </div>
                  <div className="flex-1 ml-2">
                    <div className="h-4 w-full bg-gray-100 rounded-full relative">
                      <div 
                        className={`absolute top-0 h-4 rounded-full ${
                          task.status === 'late' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(task.daysFromDue) * 10, 100)}%`,
                          left: task.status === 'early' ? 0 : 'auto',
                          right: task.status === 'late' ? 0 : 'auto'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-64 ml-4 text-sm font-medium truncate">
                    {task.taskTitle}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
