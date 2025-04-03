import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save, User2, Building, Flag, CalendarRange, Settings, Bell, Lock, Mail } from "lucide-react";

export default function Configure() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Configure</h1>
        <p className="text-neutral-600">Customize your OKR system settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-5 md:grid-flow-col md:auto-cols-max gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User2 className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Teams</span>
          </TabsTrigger>
          <TabsTrigger value="objectives" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            <span>Objectives</span>
          </TabsTrigger>
          <TabsTrigger value="cycles" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span>Cycles</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 pt-4">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" defaultValue="admin@acmecorp.com" type="email" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-8">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-12">UTC-12:00</SelectItem>
                      <SelectItem value="utc-11">UTC-11:00</SelectItem>
                      <SelectItem value="utc-10">UTC-10:00</SelectItem>
                      <SelectItem value="utc-9">UTC-09:00</SelectItem>
                      <SelectItem value="utc-8">UTC-08:00 (Pacific)</SelectItem>
                      <SelectItem value="utc-7">UTC-07:00 (Mountain)</SelectItem>
                      <SelectItem value="utc-6">UTC-06:00 (Central)</SelectItem>
                      <SelectItem value="utc-5">UTC-05:00 (Eastern)</SelectItem>
                      <SelectItem value="utc-4">UTC-04:00</SelectItem>
                      <SelectItem value="utc-3">UTC-03:00</SelectItem>
                      <SelectItem value="utc-2">UTC-02:00</SelectItem>
                      <SelectItem value="utc-1">UTC-01:00</SelectItem>
                      <SelectItem value="utc">UTC+00:00</SelectItem>
                      <SelectItem value="utc+1">UTC+01:00</SelectItem>
                      <SelectItem value="utc+2">UTC+02:00</SelectItem>
                      <SelectItem value="utc+3">UTC+03:00</SelectItem>
                      <SelectItem value="utc+4">UTC+04:00</SelectItem>
                      <SelectItem value="utc+5">UTC+05:00</SelectItem>
                      <SelectItem value="utc+6">UTC+06:00</SelectItem>
                      <SelectItem value="utc+7">UTC+07:00</SelectItem>
                      <SelectItem value="utc+8">UTC+08:00</SelectItem>
                      <SelectItem value="utc+9">UTC+09:00</SelectItem>
                      <SelectItem value="utc+10">UTC+10:00</SelectItem>
                      <SelectItem value="utc+11">UTC+11:00</SelectItem>
                      <SelectItem value="utc+12">UTC+12:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-neutral-500">Receive updates via email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="meeting-reminders" className="text-base">Meeting Reminders</Label>
                  <p className="text-sm text-neutral-500">Get reminders before scheduled meetings</p>
                </div>
                <Switch id="meeting-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="objective-updates" className="text-base">Objective Updates</Label>
                  <p className="text-sm text-neutral-500">Be notified when objectives are updated</p>
                </div>
                <Switch id="objective-updates" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest" className="text-base">Weekly Digest</Label>
                  <p className="text-sm text-neutral-500">Receive a weekly summary of progress</p>
                </div>
                <Switch id="weekly-digest" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
          
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-neutral-500">Add an extra layer of security</p>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="session-timeout" className="text-base">Session Timeout</Label>
                  <p className="text-sm text-neutral-500">How long until inactive users are logged out</p>
                </div>
                <Select defaultValue="60">
                  <SelectTrigger id="session-timeout" className="w-40">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Users Settings */}
        <TabsContent value="users" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>
                Configure user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>View OKRs</TableHead>
                    <TableHead>Edit OKRs</TableHead>
                    <TableHead>Manage Users</TableHead>
                    <TableHead>Manage Teams</TableHead>
                    <TableHead>Admin Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Admin</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Team Lead</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Limited</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Member</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Limited</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Viewer</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Permission Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize notification emails sent to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-email">Welcome Email</Label>
                <div className="border rounded-md p-4 bg-neutral-50">
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-neutral-500 mr-2" />
                    <h4 className="font-medium">Welcome to the OKR System</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Hello {'{user}'},
                  </p>
                  <p className="text-sm text-neutral-600 mb-2">
                    Welcome to the OKR System! We're excited to have you on board. Here are your account details:
                  </p>
                  <ul className="list-disc list-inside text-sm text-neutral-600 mb-2">
                    <li>Username: {'{username}'}</li>
                    <li>Temporary Password: {'{password}'}</li>
                  </ul>
                  <p className="text-sm text-neutral-600">
                    Please log in and change your password at your earliest convenience. If you have any questions, don't hesitate to reach out.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder-email">Meeting Reminder</Label>
                <div className="border rounded-md p-4 bg-neutral-50">
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-neutral-500 mr-2" />
                    <h4 className="font-medium">Upcoming Meeting Reminder</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Reminder content preview...
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Email Templates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Teams Settings */}
        <TabsContent value="teams" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Configuration</CardTitle>
              <CardDescription>
                Manage team structure and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-6">
                Team configuration settings would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Objectives Settings */}
        <TabsContent value="objectives" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Objective Settings</CardTitle>
              <CardDescription>
                Configure OKR settings and defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-6">
                Objective configuration settings would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Cycles Settings */}
        <TabsContent value="cycles" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>OKR Cycles</CardTitle>
              <CardDescription>
                Configure time periods for OKR cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-6">
                OKR cycle configuration would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect with other tools and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108c-1.3136-2.3365-3.8857-3.1816-6.0223-1.931-2.4523-1.9584-6.1182-.3718-7.6027 2.6692-2.5416-.4451-4.7559 1.7565-4.7599 4.3684l-.0003.0349c0 2.9077 2.3804 5.289 5.2877 5.289l-.0027.0002c.0481 0 .0961-.0016.1441-.0032 5.5264-.1313 10.7797-1.3682 14.9148-3.5031 1.1869-.6125 1.2928-2.306.2027-3.0647z" fill="#2684FF" />
                  <path d="M14.0923 8.4243c-.4574.0218-.743.0682-1.0989.1881-1.2692.43-1.8199 1.9439-1.2352 3.1632.2941.6127.8263 1.0781 1.4721 1.3165.7099.2625 1.5119.2892 2.3078.0764 1.4466-.3892 2.1954-1.979 1.6542-3.3894-.335-.875-1.1703-1.4401-2.1-1.4548z" fill="url(#slack-icon-gradient)" />
                  <defs>
                    <linearGradient id="slack-icon-gradient" x1="82.8361" y1="30.7012" x2="51.8462" y2="58.8581" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#156BB1" />
                      <stop offset="1" stopColor="#2684FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Slack</h3>
                <p className="text-sm text-neutral-500">Not connected</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Connect
              </Button>
            </div>
            
            <div className="border rounded-md p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M0 12C0 5.373 5.373 0 12 0c4.127 0 7.786 2.036 10 5.166V0h2v12H12V9.977h7.935C18.27 6.082 15.474 3 12 3a9 9 0 0 0-9 9c0 4.962 4.037 9 9 9 3.298 0 6.193-1.777 7.749-4.432l2.257 1.305A12 12 0 0 1 12 24C5.373 24 0 18.627 0 12z" fill="#5865F2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Google Calendar</h3>
                <p className="text-sm text-neutral-500">Not connected</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Connect
              </Button>
            </div>
            
            <div className="border rounded-md p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M10.9042 2.1001C12.8639 2.1001 15.156 2.53351 16.5776 3.72255C19.5948 6.0085 19.5466 10.9648 19.5466 14.0023C19.5466 17.0398 19.5948 21.9961 16.5776 24.282C15.156 25.4711 12.8639 25.9045 10.9042 25.9045C8.93844 25.9045 6.63846 25.4711 5.217 24.282C2.19994 21.9961 2.24827 17.0398 2.24827 14.0023C2.24827 10.9648 2.19994 6.0085 5.217 3.72255C6.63846 2.53351 8.93844 2.1001 10.9042 2.1001Z" fill="#3074F0" />
                  <path d="M16.1924 7.65722C16.6151 7.65722 16.9663 8.00844 16.9663 8.43112C16.9663 8.8538 16.6151 9.20502 16.1924 9.20502C15.7697 9.20502 15.4185 8.8538 15.4185 8.43112C15.4185 8.00844 15.7697 7.65722 16.1924 7.65722Z" fill="white" />
                  <path d="M7.69781 12.3999C7.69781 10.6266 9.13088 9.19354 10.9042 9.19354C12.6775 9.19354 14.1105 10.6266 14.1105 12.3999C14.1105 14.1732 12.6775 15.6063 10.9042 15.6063C9.13088 15.6063 7.69781 14.1732 7.69781 12.3999Z" fill="white" />
                  <path d="M7.62506 19.2935C7.37236 19.2935 7.12545 19.1877 6.95096 18.9981C6.63387 18.6503 6.66127 18.1145 7.00906 17.7974C7.68618 17.1814 9.29666 16.2446 10.9041 16.2446C12.5115 16.2446 14.1219 17.1814 14.7991 17.7974C15.1469 18.1145 15.1743 18.6503 14.8572 18.9981C14.5401 19.3459 14.0043 19.3733 13.6565 19.0562C13.142 18.5853 11.8946 17.8184 10.9041 17.8184C9.9136 17.8184 8.66612 18.5853 8.15162 19.0562C7.99902 19.2137 7.81307 19.2935 7.62506 19.2935Z" fill="white" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Jira</h3>
                <p className="text-sm text-neutral-500">Not connected</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
