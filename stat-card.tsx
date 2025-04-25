import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  icon: string;
  iconColor: "primary" | "warning" | "success";
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  progressColor?: string;
  trendDirection?: "up" | "down" | "none";
  trendValue?: string;
}

export function StatCard({
  icon,
  iconColor,
  title,
  value,
  subtitle,
  progress,
  progressColor = "bg-primary",
  trendDirection = "none",
  trendValue,
}: StatCardProps) {
  // Background colors for the icon container
  const bgColors = {
    primary: "bg-primary bg-opacity-10",
    warning: "bg-amber-500 bg-opacity-10",
    success: "bg-emerald-600 bg-opacity-10",
  };
  
  // Text colors for the icon
  const textColors = {
    primary: "text-primary",
    warning: "text-amber-500",
    success: "text-emerald-600",
  };
  
  // Trend indicator
  const trendIcon = trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "";
  const trendColor = 
    trendDirection === "up" ? "text-emerald-600" : 
    trendDirection === "down" ? "text-red-500" : 
    "";
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${bgColors[iconColor]}`}>
            <span className={`material-icons ${textColors[iconColor]}`}>{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" indicatorColor={progressColor} />
          </div>
        )}
        
        {subtitle && (
          <div className="mt-4 text-sm text-gray-500">
            <p>{subtitle}</p>
          </div>
        )}
        
        {trendValue && trendDirection !== "none" && (
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              <span className={trendColor}>{trendIcon} {trendValue}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
