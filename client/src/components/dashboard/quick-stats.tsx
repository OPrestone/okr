import { useQuery } from "@tanstack/react-query";
import { Zap, Users, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickStatProps {
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  title: string;
  value: string;
  progress: number;
  description: string;
}

function QuickStat({ 
  icon, 
  iconColor, 
  bgColor, 
  title, 
  value, 
  progress, 
  description 
}: QuickStatProps) {
  // Calculate animation delay based on progress
  const animationDelay = `${Math.min(progress / 100, 0.5)}s`;
  
  // Ensure progress is within valid range
  const safeProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-neutral-100 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={cn("p-3 rounded-full flex items-center justify-center", bgColor, iconColor)}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h2 className="text-xl font-semibold text-neutral-900">{value}</h2>
        </div>
      </div>
      <div className="mt-3">
        {/* Progress wrapper with percentage indicator */}
        <div className="flex items-center mb-1">
          <div className="w-full bg-neutral-100 rounded-full h-2.5 mr-2">
            <div 
              className="h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${safeProgress}%`,
                background: `linear-gradient(90deg, ${getProgressColor(safeProgress)} 0%, ${getProgressColor(safeProgress, 0.8)} 100%)`,
                boxShadow: `0 0 6px ${getProgressColor(safeProgress, 0.5)}`,
                animation: `growProgress 1.5s ease-out ${animationDelay} both`
              }}
            ></div>
          </div>
          <span className="text-xs font-medium" style={{ color: getProgressColor(safeProgress) }}>
            {safeProgress}%
          </span>
        </div>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>

      {/* Animation is handled through the animation property in the style object */}
    </div>
  );
}

// Helper function to get a color based on progress percentage
function getProgressColor(progress: number, opacity: number = 1): string {
  if (progress < 25) {
    return `rgba(239, 68, 68, ${opacity})`; // red
  } else if (progress < 50) {
    return `rgba(245, 158, 11, ${opacity})`; // amber
  } else if (progress < 75) {
    return `rgba(59, 130, 246, ${opacity})`; // blue
  } else {
    return `rgba(16, 185, 129, ${opacity})`; // green
  }
}

export function QuickStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5 border border-neutral-100">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
            <div className="mt-3">
              <Skeleton className="h-1.5 w-full rounded-full mt-2" />
              <Skeleton className="h-3 w-36 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 mb-8">Error loading dashboard data</div>;
  }
  
  // Add default values if any expected properties are missing
  const dashboardData = {
    objectives: {
      total: data?.objectives?.total || 0,
      completed: data?.objectives?.completed || 0,
      inProgress: data?.objectives?.inProgress || 0,
      progress: data?.objectives?.progress || 0,
    },
    keyResults: {
      total: data?.keyResults?.total || 0,
      completed: data?.keyResults?.completed || 0,
      completionRate: data?.keyResults?.completionRate || 0,
    },
    teamPerformance: {
      average: data?.teamPerformance?.average || 0,
      improvement: data?.teamPerformance?.improvement || 0,
    },
    timeRemaining: {
      days: data?.timeRemaining?.days || 0,
      percentage: data?.timeRemaining?.percentage || 0,
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <QuickStat
        icon={<Zap className="h-6 w-6" />}
        iconColor="text-primary-600"
        bgColor="bg-primary-100"
        title="Company Objectives"
        value={`${dashboardData.objectives.total}`}
        progress={dashboardData.objectives.progress}
        description={`${dashboardData.objectives.inProgress} in progress, ${dashboardData.objectives.completed} completed`}
      />
      
      <QuickStat
        icon={<Users className="h-6 w-6" />}
        iconColor="text-accent-500"
        bgColor="bg-accent-100"
        title="Team Performance"
        value={`${Math.round(dashboardData.teamPerformance.average)}%`}
        progress={dashboardData.teamPerformance.average}
        description={`${dashboardData.teamPerformance.improvement}% increase from last month`}
      />
      
      <QuickStat
        icon={<CheckCircle className="h-6 w-6" />}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Completed Key Results"
        value={`${dashboardData.keyResults.completed}/${dashboardData.keyResults.total}`}
        progress={dashboardData.keyResults.completionRate}
        description={`${Math.round(dashboardData.keyResults.completionRate)}% completion rate`}
      />
      
      <QuickStat
        icon={<Clock className="h-6 w-6" />}
        iconColor="text-amber-600"
        bgColor="bg-amber-100"
        title="Time Remaining"
        value={`${dashboardData.timeRemaining.days} days`}
        progress={dashboardData.timeRemaining.percentage}
        description={`${dashboardData.timeRemaining.percentage}% of Q2 remaining`}
      />
    </div>
  );
}
