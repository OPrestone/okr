import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Filter, 
  ChevronDown, 
  Download, 
  FileText, 
  Presentation,
  Share2,
  Play
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Reporting() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">OKR Report Export</h1>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex flex-wrap gap-4">
              {/* Time Period Filter */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative inline-block w-full">
                  <div className="flex items-center border rounded-md bg-white">
                    <div className="px-3 py-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <Select defaultValue="2025-q1">
                      <SelectTrigger className="border-0 w-full">
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
                </div>
              </div>

              {/* Filter Button */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative inline-block w-full">
                  <div className="flex items-center border rounded-md bg-white">
                    <div className="px-3 py-2">
                      <Filter className="h-5 w-5 text-gray-500" />
                    </div>
                    <Select defaultValue="ict-team">
                      <SelectTrigger className="border-0 w-full">
                        <SelectValue placeholder="ICT Team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ict-team">ICT Team</SelectItem>
                        <SelectItem value="product-team">Product Team</SelectItem>
                        <SelectItem value="marketing-team">Marketing Team</SelectItem>
                        <SelectItem value="sales-team">Sales Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Report Type */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative inline-block w-full">
                  <div className="flex items-center border rounded-md bg-white">
                    <Select defaultValue="detailed">
                      <SelectTrigger className="border-0 w-full">
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
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Excel Export Card */}
            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-md bg-green-50 flex items-center justify-center mr-4">
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
                      <span className="mr-2">•</span> Objective and Key Results breakdown
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Progress tracking metrics
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Department-wise analysis
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Historical data comparison
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Present Team Dashboard
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button className="bg-green-600 hover:bg-green-700 flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PowerPoint Export Card */}
            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center mr-4">
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
                      <span className="mr-2">•</span> Executive summary
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Visual progress indicators
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Key achievements highlights
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Next quarter planning
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span> Present Team Dashboard
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Present
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="border rounded-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Preview</h3>
              <Button variant="outline" size="sm" className="text-sm">
                Show Details <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="space-y-3 text-sm">
                <p className="text-gray-500">Selected filters:</p>
                <div>
                  <p><span className="font-medium">Time Period:</span> 2025-Q1</p>
                  <p><span className="font-medium">Department:</span> ICT Team</p>
                  <p><span className="font-medium">View Type:</span> Detailed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}