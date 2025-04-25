import { ArrowUpIcon, ArrowDownIcon, ClockIcon, CheckCircleIcon, BarChartIcon } from "lucide-react";

interface SummaryStatsProps {
  pendingCount: number;
  completedCount: number;
  weeklyProgress: number;
  pendingDiff: number;  // Change from previous week
  completedDiff: number; // Change from previous week
}

const SummaryStats = ({ 
  pendingCount,
  completedCount,
  weeklyProgress,
  pendingDiff,
  completedDiff 
}: SummaryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Tasks Pending */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">Tasks Pending</p>
            <h3 className="text-2xl font-bold text-gray-800">{pendingCount}</h3>
          </div>
          <div className="bg-red-100 p-2 rounded-lg">
            <ClockIcon className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <div className="mt-2">
          <span className={`text-sm flex items-center ${pendingDiff > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {pendingDiff > 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(pendingDiff)} {pendingDiff > 0 ? 'more' : 'less'} than last week
          </span>
        </div>
      </div>
      
      {/* Tasks Completed */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">Tasks Completed</p>
            <h3 className="text-2xl font-bold text-gray-800">{completedCount}</h3>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div className="mt-2">
          <span className={`text-sm flex items-center ${completedDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {completedDiff > 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(completedDiff)} {completedDiff > 0 ? 'more' : 'less'} than last week
          </span>
        </div>
      </div>
      
      {/* Weekly Progress */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">Weekly Progress</p>
            <h3 className="text-2xl font-bold text-gray-800">{weeklyProgress}%</h3>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChartIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${weeklyProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
