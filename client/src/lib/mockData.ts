// This file contains mock data structures to simulate API responses
// when the external API is not available or during development

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  teamId?: number;
  position?: string;
  avatarUrl?: string;
}

export interface Team {
  id: number;
  name: string;
  leaderId: number;
  description?: string;
  parentTeamId?: number;
}

export interface Objective {
  id: number;
  title: string;
  description?: string;
  progress: number;
  teamId?: number;
  ownerId?: number;
  isCompanyObjective: boolean;
  startDate: string;
  endDate: string;
  cycleId?: number;
  status: string;
  priority: string;
  parentObjectiveId?: number;
  createdById?: number;
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
  confidenceScore: number;
}

export interface KeyResult {
  id: number;
  title: string;
  description?: string;
  progress: number;
  objectiveId: number;
  ownerId?: number;
  startValue: number;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  unit?: string;
  format: string;
  direction: string;
  confidenceScore: number;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: number;
  objectiveId?: number;
  keyResultId?: number;
  authorId: number;
  newValue?: number;
  previousValue?: number;
  progressDelta?: number;
  note?: string;
  confidenceScore?: number;
  checkInDate: string;
  createdAt: string;
}

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  userId1: number;
  userId2: number;
  status: string;
  meetingType: string;
  location?: string;
  notes?: string;
  recordingUrl?: string;
  recurrence?: string;
  objectiveId?: number;
  isVirtual: boolean;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: number;
  title: string;
  description?: string;
  type: string;
  url?: string;
  category?: string;
  tags?: string[];
  authorId?: number;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  createdById?: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface CompanySettings {
  id: number;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  objectives: {
    total: number;
    completed: number;
    inProgress: number;
    atRisk: number;
    overdue: number;
    progress: number;
  };
  keyResults: {
    total: number;
    completed: number;
    inProgress: number;
    atRisk: number;
    completionRate: number;
  };
  checkIns: {
    total: number;
    lastWeek: number;
    thisWeek: number;
  };
  teamPerformance: {
    average: number;
    improvement: number;
  };
  timeRemaining: {
    days: number;
    percentage: number;
    cycleId: number;
  };
  upcomingMeetings: number;
}

// Mock data values
export const mockUsers: User[] = [
  {
    id: 1,
    username: "testuser",
    fullName: "Alex Morgan",
    email: "alex@example.com",
    role: "admin",
    position: "Product Manager",
    avatarUrl: "/uploads/logo.png"
  },
  {
    id: 2,
    username: "janesmith",
    fullName: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    teamId: 1,
    position: "Designer"
  },
  {
    id: 3,
    username: "johndoe",
    fullName: "John Doe",
    email: "john@example.com",
    role: "user",
    teamId: 1,
    position: "Developer"
  }
];

export const mockTeams: Team[] = [
  {
    id: 1,
    name: "Test Team",
    leaderId: 1,
    description: "This is a test team for development purposes."
  },
  {
    id: 2,
    name: "Engineering",
    leaderId: 3,
    description: "Engineering department responsible for product development."
  },
  {
    id: 3,
    name: "Design",
    leaderId: 2,
    description: "Design department responsible for UI/UX."
  }
];

export const mockObjectives: Objective[] = [
  {
    id: 1,
    title: "Improve Customer Satisfaction",
    description: "Enhance overall customer experience to increase satisfaction scores",
    progress: 65,
    ownerId: 1,
    isCompanyObjective: true,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-03-31T00:00:00.000Z",
    status: "active",
    priority: "high",
    createdById: 1,
    createdAt: "2024-12-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
    aiGenerated: false,
    confidenceScore: 8
  },
  {
    id: 2,
    title: "Increase Revenue by 25%",
    description: "Implement strategies to boost revenue across all product lines",
    progress: 40,
    teamId: 1,
    ownerId: 1,
    isCompanyObjective: false,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-03-31T00:00:00.000Z",
    status: "active",
    priority: "high",
    createdById: 1,
    createdAt: "2024-12-20T10:00:00.000Z",
    updatedAt: "2025-01-20T10:00:00.000Z",
    aiGenerated: false,
    confidenceScore: 7
  }
];

export const mockKeyResults: KeyResult[] = [
  {
    id: 1,
    title: "Achieve NPS score of 8+",
    description: "Improve Net Promoter Score to 8 or higher",
    progress: 75,
    objectiveId: 1,
    ownerId: 1,
    startValue: 6.5,
    targetValue: 8,
    currentValue: 7.6,
    isCompleted: false,
    format: "number",
    direction: "increasing",
    confidenceScore: 8,
    lastUpdated: "2025-01-20T10:00:00.000Z",
    createdAt: "2024-12-15T10:00:00.000Z",
    updatedAt: "2025-01-20T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Reduce customer support tickets by 30%",
    description: "Decrease the number of support tickets through product improvements",
    progress: 50,
    objectiveId: 1,
    ownerId: 3,
    startValue: 450,
    targetValue: 315,
    currentValue: 380,
    isCompleted: false,
    unit: "tickets",
    format: "number",
    direction: "decreasing",
    confidenceScore: 6,
    lastUpdated: "2025-01-18T10:00:00.000Z",
    createdAt: "2024-12-15T10:00:00.000Z",
    updatedAt: "2025-01-18T10:00:00.000Z"
  }
];

export const mockCheckIns: CheckIn[] = [
  {
    id: 1,
    keyResultId: 1,
    authorId: 1,
    newValue: 7.2,
    previousValue: 7.0,
    progressDelta: 15,
    note: "Implemented new user onboarding flow that has improved initial satisfaction scores.",
    confidenceScore: 7,
    checkInDate: "2025-01-10T10:00:00.000Z",
    createdAt: "2025-01-10T10:00:00.000Z"
  },
  {
    id: 2,
    keyResultId: 1,
    authorId: 1,
    newValue: 7.6,
    previousValue: 7.2,
    progressDelta: 20,
    note: "Customer feedback implementation has shown good results in recent satisfaction surveys.",
    confidenceScore: 8,
    checkInDate: "2025-01-20T10:00:00.000Z",
    createdAt: "2025-01-20T10:00:00.000Z"
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 3,
    title: "Weekly Check-in Meeting",
    description: "Regular weekly check-in to discuss progress and obstacles",
    startTime: "2025-04-20T14:00:00.000Z",
    endTime: "2025-04-20T15:00:00.000Z",
    userId1: 1,
    userId2: 2,
    status: "scheduled",
    meetingType: "1on1",
    isVirtual: true,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z"
  }
];

export const mockResources: Resource[] = [
  {
    id: 1,
    title: "Quarterly OKR Template for Product Teams",
    description: "A comprehensive template for product teams to set and track quarterly objectives and key results.",
    type: "template",
    url: "/resources/templates/product-team-okr-template.xlsx",
    category: "templates",
    tags: ["product", "quarterly", "template"],
    authorId: 1,
    isPublic: true,
    downloadCount: 124,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Annual Planning OKR Template",
    description: "Strategic OKR template for annual planning with guidelines and examples.",
    type: "template",
    url: "/resources/templates/annual-planning-okr-template.xlsx",
    category: "templates",
    tags: ["annual", "planning", "strategic"],
    authorId: 1,
    isPublic: true,
    downloadCount: 98,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 3,
    title: "Marketing Team OKR Template",
    description: "OKR template specifically designed for marketing teams with metrics tracking.",
    type: "template",
    url: "/resources/templates/marketing-okr-template.xlsx",
    category: "templates",
    tags: ["marketing", "metrics", "template"],
    authorId: 1,
    isPublic: true,
    downloadCount: 76,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 4,
    title: "OKR System Introduction Video",
    description: "A comprehensive introduction to using the OKR system platform.",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "tutorials",
    tags: ["introduction", "basics", "getting-started"],
    authorId: 1,
    isPublic: true,
    downloadCount: 256,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 5,
    title: "How to Write Effective Key Results",
    description: "Learn the best practices for writing measurable and impactful key results.",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "tutorials",
    tags: ["key-results", "best-practices", "tutorial"],
    authorId: 1,
    isPublic: true,
    downloadCount: 187,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 6,
    title: "OKR Check-in Process Explained",
    description: "Step-by-step tutorial on conducting effective OKR check-in meetings.",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "tutorials",
    tags: ["check-ins", "meetings", "tutorial"],
    authorId: 1,
    isPublic: true,
    downloadCount: 145,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 7,
    title: "OKR Best Practices Guide",
    description: "Comprehensive guide on OKR best practices gathered from industry leaders.",
    type: "article",
    url: "/resources/guides/okr-best-practices.pdf",
    category: "best-practices",
    tags: ["guide", "best-practices", "implementation"],
    authorId: 1,
    isPublic: true,
    downloadCount: 312,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 8,
    title: "Common OKR Pitfalls and How to Avoid Them",
    description: "Learn about the most common mistakes when implementing OKRs and strategies to avoid them.",
    type: "article",
    url: "/resources/guides/okr-pitfalls.pdf",
    category: "best-practices",
    tags: ["pitfalls", "mistakes", "solutions"],
    authorId: 1,
    isPublic: true,
    downloadCount: 241,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 9,
    title: "OKR Scoring and Progress Tracking",
    description: "Guidelines for scoring OKRs and tracking progress consistently.",
    type: "article",
    url: "/resources/guides/okr-scoring.pdf",
    category: "best-practices",
    tags: ["scoring", "tracking", "measurement"],
    authorId: 1,
    isPublic: true,
    downloadCount: 198,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 10,
    title: "OKR Implementation Handbook",
    description: "A comprehensive handbook for implementing OKRs in your organization.",
    type: "article",
    url: "/resources/guides/okr-implementation-handbook.pdf",
    category: "general",
    tags: ["implementation", "handbook", "guide"],
    authorId: 1,
    isPublic: true,
    downloadCount: 345,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 11,
    title: "Executive Guide to OKRs",
    description: "A focused guide for executives on leveraging OKRs for strategic alignment.",
    type: "article",
    url: "/resources/guides/executive-okr-guide.pdf",
    category: "general",
    tags: ["executive", "strategic", "alignment"],
    authorId: 1,
    isPublic: true,
    downloadCount: 278,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: 12,
    title: "OKR Case Studies Collection",
    description: "Real-world case studies of successful OKR implementations across different industries.",
    type: "article",
    url: "/resources/guides/okr-case-studies.pdf",
    category: "general",
    tags: ["case-studies", "examples", "success-stories"],
    authorId: 1,
    isPublic: true,
    downloadCount: 231,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  }
];

export const mockCycles: Cycle[] = [
  {
    id: 1,
    name: "Q1 2025",
    description: "First quarter of 2025",
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-03-31T00:00:00.000Z",
    status: "active",
    type: "quarterly",
    createdById: 1,
    createdAt: "2024-12-15T10:00:00.000Z",
    updatedAt: "2024-12-15T10:00:00.000Z",
    isDefault: true
  },
  {
    id: 2,
    name: "Q2 2025",
    description: "Second quarter of 2025",
    startDate: "2025-04-01T00:00:00.000Z",
    endDate: "2025-06-30T00:00:00.000Z",
    status: "upcoming",
    type: "quarterly",
    createdById: 1,
    createdAt: "2024-12-15T10:00:00.000Z",
    updatedAt: "2024-12-15T10:00:00.000Z",
    isDefault: false
  }
];

export const mockDashboardStats: DashboardStats = {
  objectives: {
    total: 2,
    completed: 0,
    inProgress: 2,
    atRisk: 0,
    overdue: 0,
    progress: 52 // Average progress percentage across all objectives
  },
  keyResults: {
    total: 2,
    completed: 0,
    inProgress: 2,
    atRisk: 0,
    completionRate: 62.5 // Average completion percentage
  },
  checkIns: {
    total: 2,
    lastWeek: 1,
    thisWeek: 1
  },
  teamPerformance: {
    average: 68,
    improvement: 12
  },
  timeRemaining: {
    days: 76,
    percentage: 83,
    cycleId: 1
  },
  upcomingMeetings: 1
};

export const mockCompanySettings: CompanySettings = {
  id: 1,
  name: "My Company",
  logoUrl: "/uploads/logo.png",
  primaryColor: "#4f46e5",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
};

// Mock integrations data
export const mockIntegrations = [
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Connect your OKR system with Microsoft Teams to send notifications, updates and create meetings directly within Teams.",
    icon: "microsoft-teams",
    isConnected: false,
    status: "inactive",
    features: [
      "Send OKR progress notifications to Teams channels",
      "Schedule check-in meetings through Teams",
      "Share OKR updates in team channels",
      "Access OKR dashboards within Teams"
    ],
    category: "communication",
    connectionUrl: "https://login.microsoftonline.com/oauth2/authorize",
    configOptions: [
      {
        name: "Default Channel ID",
        type: "text",
        value: ""
      },
      {
        name: "Send Notifications",
        type: "toggle",
        value: true
      },
      {
        name: "Notification Frequency",
        type: "select",
        value: "Daily",
        options: ["Daily", "Weekly", "Only on updates"]
      }
    ]
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Integrate with Google Workspace to sync with Google Calendar, access Google Drive documents, and collaborate using Google Meet.",
    icon: "google-workspace",
    isConnected: true,
    status: "active",
    features: [
      "Schedule check-in meetings in Google Calendar",
      "Store OKR documents in Google Drive",
      "Start Google Meet calls for OKR discussions",
      "Attach relevant Google Docs to objectives"
    ],
    category: "productivity",
    connectionUrl: "https://accounts.google.com/o/oauth2/auth",
    configOptions: [
      {
        name: "Default Calendar",
        type: "text",
        value: "Primary"
      },
      {
        name: "Auto-create Google Docs",
        type: "toggle",
        value: true
      },
      {
        name: "Drive Folder ID",
        type: "text",
        value: "1Abc2DefGHijKLmnOPqr"
      }
    ]
  },
  {
    id: "odoo",
    name: "Odoo",
    description: "Connect with Odoo ERP to align objectives with financial data, employee management, and business processes.",
    icon: "odoo",
    isConnected: false,
    status: "inactive",
    features: [
      "Import financial KPIs from Odoo",
      "Link objectives to Odoo projects",
      "Sync employee data between systems",
      "Push OKR results to Odoo dashboards"
    ],
    category: "erp",
    connectionUrl: "https://myodoo.example.com/web/login",
    configOptions: [
      {
        name: "Odoo Instance URL",
        type: "text",
        value: ""
      },
      {
        name: "Database Name",
        type: "text",
        value: ""
      },
      {
        name: "Import Financial Data",
        type: "toggle",
        value: true
      }
    ]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Integrate with Slack to get OKR updates, notifications, and facilitate team discussions about objectives.",
    icon: "slack",
    isConnected: true,
    status: "active",
    features: [
      "Receive OKR updates in Slack channels",
      "Use slash commands to check progress",
      "Get reminders for pending check-ins",
      "Interactive OKR bot for updates"
    ],
    category: "communication",
    connectionUrl: "https://slack.com/oauth/authorize",
    configOptions: [
      {
        name: "Default Channel",
        type: "text",
        value: "#okr-updates"
      },
      {
        name: "Bot Username",
        type: "text",
        value: "OKRBot"
      },
      {
        name: "Enable Reminders",
        type: "toggle",
        value: true
      }
    ]
  },
  {
    id: "jira",
    name: "Jira",
    description: "Connect your OKR system with Jira to align objectives with software development tasks and sprints.",
    icon: "jira",
    isConnected: false,
    status: "inactive",
    features: [
      "Link key results to Jira tickets",
      "Monitor sprint progress as key results",
      "Create Jira tickets from key results",
      "Synchronize completion status"
    ],
    category: "project-management",
    connectionUrl: "https://auth.atlassian.com/authorize",
    configOptions: [
      {
        name: "Jira Instance URL",
        type: "text",
        value: ""
      },
      {
        name: "Default Project Key",
        type: "text",
        value: ""
      },
      {
        name: "Two-way Sync",
        type: "toggle",
        value: false
      }
    ]
  },
  {
    id: "asana",
    name: "Asana",
    description: "Integrate with Asana to connect objectives with projects and tasks for better alignment.",
    icon: "asana",
    isConnected: false,
    status: "inactive",
    features: [
      "Create Asana tasks from key results",
      "Track Asana project progress as objectives",
      "Link objectives to Asana projects",
      "Update progress automatically"
    ],
    category: "project-management",
    connectionUrl: "https://app.asana.com/-/oauth_authorize",
    configOptions: [
      {
        name: "Default Workspace",
        type: "text",
        value: ""
      },
      {
        name: "Create Tasks for New KRs",
        type: "toggle",
        value: true
      },
      {
        name: "Task Template",
        type: "select",
        value: "Basic",
        options: ["Basic", "Detailed", "Custom"]
      }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connect with GitHub to align OKRs with development milestones, issues, and pull requests.",
    icon: "github",
    isConnected: false,
    status: "inactive",
    features: [
      "Link key results to GitHub issues",
      "Track PR completion rates as metrics",
      "Connect milestones to objectives",
      "Update progress based on issue status"
    ],
    category: "development",
    connectionUrl: "https://github.com/login/oauth/authorize",
    configOptions: [
      {
        name: "Organization Name",
        type: "text",
        value: ""
      },
      {
        name: "Default Repository",
        type: "text",
        value: ""
      },
      {
        name: "Sync Issues",
        type: "toggle",
        value: true
      }
    ]
  },
  {
    id: "miro",
    name: "Miro",
    description: "Integrate with Miro to visualize and collaborate on OKRs using virtual whiteboards.",
    icon: "miro",
    isConnected: true,
    status: "error",
    features: [
      "Visualize OKRs on Miro boards",
      "Collaborate on objective planning",
      "Export OKR tree diagrams to Miro",
      "Conduct OKR workshops using templates"
    ],
    category: "productivity",
    connectionUrl: "https://miro.com/oauth/authorize",
    configOptions: [
      {
        name: "Team ID",
        type: "text",
        value: "team12345"
      },
      {
        name: "Default Board Template",
        type: "select",
        value: "OKR Framework",
        options: ["OKR Framework", "Strategy Map", "Blank"]
      },
      {
        name: "Auto-create Boards",
        type: "toggle",
        value: true
      }
    ]
  }
];

// Export all mock data as a single object for easy import
export const mockData = {
  "/api/users": mockUsers,
  "/api/teams": mockTeams,
  "/api/objectives": mockObjectives,
  "/api/objectives/company": mockObjectives.filter(obj => obj.isCompanyObjective),
  "/api/key-results": mockKeyResults,
  "/api/check-ins": mockCheckIns,
  "/api/meetings": mockMeetings,
  "/api/meetings/upcoming": mockMeetings.filter(m => new Date(m.startTime) > new Date()),
  "/api/resources": mockResources,
  "/api/cycles": mockCycles,
  "/api/dashboard": mockDashboardStats,
  "/api/company-settings": mockCompanySettings,
  "/api/integrations": mockIntegrations
};

export default mockData;