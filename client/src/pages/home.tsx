import { QuickStats } from "@/components/dashboard/quick-stats";
import { GetStartedGuide } from "@/components/quick-start/get-started-guide";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { TeamPerformance } from "@/components/dashboard/team-performance";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import { StrategyMap } from "@/components/dashboard/strategy-map";
import { ResourcesSection } from "@/components/dashboard/resources-section";

export default function Home() {
  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome to your OKR Dashboard</h1>
        <p className="text-neutral-600">Track your objectives and key results in one place</p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Quick Get Started Guide */}
      <GetStartedGuide />

      {/* Recent Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ProgressChart />
        <TeamPerformance />
        <UpcomingMeetings />
      </div>

      {/* Strategy Map Preview */}
      <StrategyMap />

      {/* Resources Section */}
      <ResourcesSection />
    </div>
  );
}
