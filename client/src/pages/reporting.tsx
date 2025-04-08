import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart, LineChart, FilePieChart, FileBarChart, FileLineChart, Download } from "lucide-react";
import { useState } from "react";

export default function Reporting() {
  const [selectedTab, setSelectedTab] = useState<"charts" | "exports">("charts");

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>
            <p className="text-muted-foreground">
              Generate reports and visualizations for your OKRs and team performance.
            </p>
          </div>

          <div className="flex space-x-2 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === "charts" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"
              }`}
              onClick={() => setSelectedTab("charts")}
            >
              Charts & Visualizations
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === "exports" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"
              }`}
              onClick={() => setSelectedTab("exports")}
            >
              Exports & Downloads
            </button>
          </div>

          {selectedTab === "charts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">OKR Completion Rate</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-slate-100 rounded-md flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-slate-100 rounded-md flex items-center justify-center">
                    <BarChart className="h-16 w-16 text-slate-300" />
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Progress Over Time</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-slate-100 rounded-md flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-slate-300" />
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "exports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">OKR Summary</CardTitle>
                  <FilePieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="mt-2 mb-4">
                    Export a comprehensive summary of all OKRs and their progress status.
                  </CardDescription>
                  <Button size="sm" className="w-full flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
                  <FileBarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="mt-2 mb-4">
                    Export detailed performance metrics for all teams in your organization.
                  </CardDescription>
                  <Button size="sm" className="w-full flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Historical Data</CardTitle>
                  <FileLineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="mt-2 mb-4">
                    Export historical OKR progress data for trend analysis and reporting.
                  </CardDescription>
                  <Button size="sm" className="w-full flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}