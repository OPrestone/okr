import { ReportLayout } from "@/components/dashboard/report-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar, 
  Filter, 
  ChevronDown, 
  Download, 
  FileText, 
  Presentation,
  Share2,
  Play,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Team } from "@shared/schema";

export default function Reporting() {
  const { toast } = useToast();
  const [timePeriod, setTimePeriod] = useState('2025-q1');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [reportType, setReportType] = useState('detailed');
  const [previewData, setPreviewData] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Fetch teams for the team filter
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    refetchOnWindowFocus: false
  });
  
  // Preview report data mutation
  const previewMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/reports/preview', data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.success && data.preview) {
        setPreviewData(data.preview);
      } else {
        toast({
          title: "Error generating preview",
          description: "Failed to generate report preview. Please try again.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error generating preview",
        description: "Failed to generate report preview. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Excel export mutation
  const excelMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/reports/excel', data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.success && data.reportUrl) {
        // Open the report in a new tab
        window.open(data.reportUrl, '_blank');
      } else {
        toast({
          title: "Error exporting report",
          description: "Failed to generate Excel report. Please try again.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error exporting report",
        description: "Failed to generate Excel report. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // PowerPoint export mutation
  const pptMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/reports/powerpoint', data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.success && data.reportUrl) {
        // Open the report in a new tab
        window.open(data.reportUrl, '_blank');
      } else {
        toast({
          title: "Error exporting presentation",
          description: "Failed to generate PowerPoint presentation. Please try again.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error exporting presentation",
        description: "Failed to generate PowerPoint presentation. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Generate preview when filter changes
  useEffect(() => {
    const generatePreview = async () => {
      const filters = {
        timePeriod,
        reportType,
        ...(teamId && { teamId })
      };
      
      previewMutation.mutate(filters);
    };
    
    generatePreview();
  }, [timePeriod, teamId, reportType]);
  
  // Handle Excel export
  const handleExcelExport = () => {
    const filters = {
      timePeriod,
      reportType,
      ...(teamId && { teamId })
    };
    
    excelMutation.mutate(filters);
  };
  
  // Handle PowerPoint export
  const handlePowerPointExport = () => {
    const filters = {
      timePeriod,
      reportType,
      ...(teamId && { teamId })
    };
    
    pptMutation.mutate(filters);
  };
  
  // Get selected team name
  const getTeamName = () => {
    if (!teamId || !teams) return 'All Teams';
    
    const team = teams.find((team: Team) => team.id.toString() === teamId);
    return team ? team.name : 'All Teams';
  };
  
  return (
    <ReportLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">OKR Reports</h1>
          <p className="text-gray-500 mt-1">Generate and export OKR reports in different formats</p>
        </div>
        
        {/* Filters - Integrated directly into the main content */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Report Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time Period Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                Time Period
              </label>
              <Select 
                defaultValue="2025-q1" 
                onValueChange={(value) => setTimePeriod(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="2025 Q1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-q1">2025 Q1</SelectItem>
                  <SelectItem value="2024-q4">2024 Q4</SelectItem>
                  <SelectItem value="2024-q3">2024 Q3</SelectItem>
                  <SelectItem value="2024-q2">2024 Q2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                Department/Team
              </label>
              <Select 
                defaultValue="all" 
                onValueChange={(value) => setTeamId(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams && teams.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                Report Type
              </label>
              <Select 
                defaultValue="detailed" 
                onValueChange={(value) => setReportType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Detailed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="highlights">Highlights</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Excel Export Card */}
          <Card className="border">
            <CardContent className="p-5">
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 rounded-md bg-green-50 flex items-center justify-center mr-4 flex-shrink-0">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mt-1">Excel Export</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Export your OKR data to Excel format for detailed analysis and reporting.
              </p>

              <div className="space-y-1 mb-6">
                <h4 className="text-sm text-gray-500">Includes:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Objective and Key Results breakdown</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Progress tracking metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Department-wise analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Historical data comparison</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={handleExcelExport}
                  disabled={excelMutation.isPending}
                >
                  {excelMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {excelMutation.isPending ? 'Generating...' : 'Export'}
                </Button>
                <Button variant="outline" className="border-gray-300">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PowerPoint Export Card */}
          <Card className="border">
            <CardContent className="p-5">
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                  <Presentation className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mt-1">PowerPoint Export</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Generate presentation-ready slides showcasing your OKR progress and achievements.
              </p>

              <div className="space-y-1 mb-6">
                <h4 className="text-sm text-gray-500">Includes:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Executive summary</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Visual progress indicators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Key achievements highlights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">•</span> 
                    <span>Next quarter planning</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Present
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={handlePowerPointExport}
                  disabled={pptMutation.isPending}
                >
                  {pptMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {pptMutation.isPending ? 'Generating...' : 'Export'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h3 className="font-semibold">Report Preview</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'} 
              <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50">
            {previewMutation.isPending ? (
              <div className="flex justify-center items-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
                <p className="text-gray-500">Generating preview...</p>
              </div>
            ) : previewMutation.isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to generate report preview. Please try again.</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-500">Selected filters:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <p><span className="font-medium">Time Period:</span> {timePeriod.toUpperCase()}</p>
                    <p><span className="font-medium">Department:</span> {getTeamName()}</p>
                    <p><span className="font-medium">Report Type:</span> {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</p>
                  </div>
                </div>
                
                {previewData && showDetails && (
                  <div className="mt-6 bg-white rounded-md border p-4">
                    <h4 className="font-medium mb-3">Report Summary Preview</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-md shadow-sm border border-blue-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-blue-600 text-xl font-bold">{previewData.summary?.totalObjectives || 0}</span>
                        </div>
                        <p className="text-xs text-blue-600 uppercase font-medium text-center">Total Objectives</p>
                        <div className="w-full mt-2 h-1 bg-blue-100 rounded-full">
                          <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-md shadow-sm border border-green-100 flex flex-col items-center justify-center">
                        <div className="relative w-12 h-12 mb-2">
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 36 36" className="w-12 h-12">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#E2F6E8"
                                strokeWidth="2"
                                strokeDasharray="100, 100"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                strokeDasharray={`${(previewData.summary?.completedObjectives || 0) / (previewData.summary?.totalObjectives || 1) * 100}, 100`}
                                className="animate-dashoffset"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-green-600 text-sm font-bold">{previewData.summary?.completedObjectives || 0}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 uppercase font-medium text-center">Completed</p>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-md shadow-sm border border-amber-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 relative">
                          <span className="text-amber-600 text-xl font-bold">{previewData.summary?.atRiskObjectives || 0}</span>
                          <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-xs text-amber-600 uppercase font-medium text-center">At Risk</p>
                        <div className="w-full mt-2 h-1 bg-amber-100 rounded-full">
                          <div 
                            className="h-1 bg-amber-500 rounded-full transition-all duration-1000" 
                            style={{ 
                              width: `${(previewData.summary?.atRiskObjectives || 0) / (previewData.summary?.totalObjectives || 1) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-md shadow-sm border border-purple-100 flex flex-col items-center justify-center">
                        <div className="relative w-12 h-12 mb-2">
                          <svg className="w-12 h-12" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#F3E8FF" strokeWidth="2"></circle>
                            <circle 
                              cx="18" 
                              cy="18" 
                              r="16" 
                              fill="none" 
                              stroke="#9333EA" 
                              strokeWidth="2" 
                              strokeDasharray={`${previewData.summary?.avgProgress || 0}, 100`} 
                              strokeDashoffset="25"
                              className="transition-all duration-1000"
                            ></circle>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-purple-600 text-sm font-bold">{previewData.summary?.avgProgress || 0}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-purple-600 uppercase font-medium text-center">Avg Progress</p>
                      </div>
                    </div>
                    
                    <style jsx>{`
                      @keyframes dashoffset {
                        0% {
                          stroke-dasharray: 0, 100;
                        }
                      }
                      .animate-dashoffset {
                        animation: dashoffset 1s ease-out forwards;
                      }
                    `}</style>
                    
                    {previewData.previewData?.objectives?.length > 0 ? (
                      <>
                        <h5 className="font-medium text-sm mb-2">Objectives Preview (Top 3)</h5>
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">Title</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">Progress</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {previewData.previewData.objectives.map((obj: any) => (
                                <tr key={obj.id}>
                                  <td className="px-3 py-2">{obj.title}</td>
                                  <td className="px-3 py-2">{obj.progress}%</td>
                                  <td className="px-3 py-2">{obj.status || 'Not Started'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 mb-4 bg-gray-50 text-center text-gray-500 rounded-md">
                        No objectives found for the selected filters.
                      </div>
                    )}
                    
                    {previewData.previewData?.keyResultsPreview?.length > 0 && (
                      <>
                        <h5 className="font-medium text-sm mb-2">Key Results Preview</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">Title</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">Progress</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {previewData.previewData.keyResultsPreview.map((kr: any) => (
                                <tr key={kr.id}>
                                  <td className="px-3 py-2">{kr.title}</td>
                                  <td className="px-3 py-2">{kr.progress}%</td>
                                  <td className="px-3 py-2">{kr.status || 'Not Started'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ReportLayout>
  );
}