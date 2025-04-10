import { 
  User, InsertUser, Team, InsertTeam, Objective, InsertObjective, 
  KeyResult, InsertKeyResult, Meeting, InsertMeeting, Resource, InsertResource,
  FinancialData, InsertFinancialData
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  getAllTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined>;
  
  // Objective operations
  getObjective(id: number): Promise<Objective | undefined>;
  getAllObjectives(): Promise<Objective[]>;
  getCompanyObjectives(): Promise<Objective[]>;
  getTeamObjectives(teamId: number): Promise<Objective[]>;
  createObjective(objective: InsertObjective): Promise<Objective>;
  updateObjective(id: number, objective: Partial<InsertObjective>): Promise<Objective | undefined>;
  
  // Key Result operations
  getKeyResult(id: number): Promise<KeyResult | undefined>;
  getKeyResultsByObjective(objectiveId: number): Promise<KeyResult[]>;
  createKeyResult(keyResult: InsertKeyResult): Promise<KeyResult>;
  updateKeyResult(id: number, keyResult: Partial<InsertKeyResult>): Promise<KeyResult | undefined>;
  
  // Meeting operations
  getMeeting(id: number): Promise<Meeting | undefined>;
  getAllMeetings(): Promise<Meeting[]>;
  getUserMeetings(userId: number): Promise<Meeting[]>;
  getUpcomingMeetings(): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  
  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  
  // Financial Data operations
  getFinancialData(id: number): Promise<FinancialData | undefined>;
  getAllFinancialData(): Promise<FinancialData[]>;
  getFinancialDataByDate(startDate: Date, endDate: Date): Promise<FinancialData[]>;
  getFinancialDataByObjective(objectiveId: number): Promise<FinancialData[]>;
  createFinancialData(financialData: InsertFinancialData): Promise<FinancialData>;
  updateFinancialData(id: number, financialData: Partial<InsertFinancialData>): Promise<FinancialData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private objectives: Map<number, Objective>;
  private keyResults: Map<number, KeyResult>;
  private meetings: Map<number, Meeting>;
  private resources: Map<number, Resource>;
  private financialData: Map<number, FinancialData>;
  
  private userCurrentId: number;
  private teamCurrentId: number;
  private objectiveCurrentId: number;
  private keyResultCurrentId: number;
  private meetingCurrentId: number;
  private resourceCurrentId: number;
  private financialDataCurrentId: number;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.objectives = new Map();
    this.keyResults = new Map();
    this.meetings = new Map();
    this.resources = new Map();
    this.financialData = new Map();
    
    this.userCurrentId = 1;
    this.teamCurrentId = 1;
    this.objectiveCurrentId = 1;
    this.keyResultCurrentId = 1;
    this.meetingCurrentId = 1;
    this.resourceCurrentId = 1;
    this.financialDataCurrentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed Teams
    const teams = [
      { name: "Product Team", description: "Responsible for product development", memberCount: 8, performance: 94 },
      { name: "Engineering", description: "Technical development team", memberCount: 12, performance: 78 },
      { name: "Marketing", description: "Market research and promotion", memberCount: 6, performance: 85 },
      { name: "Sales", description: "Sales and customer relationship", memberCount: 9, performance: 62 }
    ];

    teams.forEach(team => this.createTeam(team));

    // Seed Users
    const users = [
      { username: "alex.morgan", password: "password", fullName: "Alex Morgan", email: "alex@example.com", role: "Product Manager", teamId: 1 },
      { username: "sarah.thompson", password: "password", fullName: "Sarah Thompson", email: "sarah@example.com", role: "UI/UX Designer", teamId: 1 },
      { username: "michael.chen", password: "password", fullName: "Michael Chen", email: "michael@example.com", role: "Software Engineer", teamId: 2 },
      { username: "james.wilson", password: "password", fullName: "James Wilson", email: "james@example.com", role: "Product Manager", teamId: 1 }
    ];

    users.forEach(user => this.createUser(user));

    // Seed Objectives
    const objectives = [
      { title: "Increase Customer Retention", description: "Focus on customer satisfaction and retention", progress: 72, isCompanyObjective: true, startDate: new Date(), endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { title: "Launch New Product Line", description: "Develop and launch new product offerings", progress: 45, isCompanyObjective: true, startDate: new Date(), endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { title: "Improve Team Engagement", description: "Increase team satisfaction and productivity", progress: 89, isCompanyObjective: true, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { title: "Increase Revenue by 20%", description: "Focus on sales growth and efficiency", progress: 63, isCompanyObjective: true, startDate: new Date(), endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
    ];

    objectives.forEach(objective => this.createObjective(objective));

    // Seed Meetings
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);

    const meetings = [
      { 
        title: "OKR Review", 
        description: "Weekly performance review", 
        userId1: 1, 
        userId2: 2, 
        startTime: new Date(currentDate.setHours(14, 0, 0, 0)), 
        endTime: new Date(currentDate.setHours(14, 30, 0, 0))
      },
      { 
        title: "Project Planning", 
        description: "Discuss next sprint", 
        userId1: 1, 
        userId2: 3, 
        startTime: new Date(tomorrow.setHours(10, 0, 0, 0)), 
        endTime: new Date(tomorrow.setHours(10, 30, 0, 0))
      },
      { 
        title: "Product Strategy", 
        description: "Roadmap discussion", 
        userId1: 1, 
        userId2: 4, 
        startTime: new Date(nextWeek.setHours(15, 30, 0, 0)), 
        endTime: new Date(nextWeek.setHours(16, 0, 0, 0))
      }
    ];

    meetings.forEach(meeting => this.createMeeting(meeting));

    // Seed Resources
    const resources = [
      { title: "OKR Best Practices Guide", description: "Learn how to write effective objectives and key results", type: "article", url: "/resources/okr-best-practices.pdf" },
      { title: "Video Tutorial Series", description: "Watch our step-by-step guide to implementing OKRs", type: "video", url: "/resources/okr-video-tutorial.mp4" },
      { title: "OKR Templates", description: "Download ready-to-use templates for different departments", type: "template", url: "/resources/okr-templates.zip" }
    ];

    resources.forEach(resource => this.createResource(resource));
  }

  // User implementations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Team implementations
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.teamCurrentId++;
    const team: Team = { ...insertTeam, id };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined> {
    const existingTeam = this.teams.get(id);
    if (!existingTeam) return undefined;
    
    const updatedTeam = { ...existingTeam, ...team };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  // Objective implementations
  async getObjective(id: number): Promise<Objective | undefined> {
    return this.objectives.get(id);
  }

  async getAllObjectives(): Promise<Objective[]> {
    return Array.from(this.objectives.values());
  }

  async getCompanyObjectives(): Promise<Objective[]> {
    return Array.from(this.objectives.values()).filter(
      objective => objective.isCompanyObjective
    );
  }

  async getTeamObjectives(teamId: number): Promise<Objective[]> {
    return Array.from(this.objectives.values()).filter(
      objective => objective.teamId === teamId
    );
  }

  async createObjective(insertObjective: InsertObjective): Promise<Objective> {
    const id = this.objectiveCurrentId++;
    const objective: Objective = { ...insertObjective, id };
    this.objectives.set(id, objective);
    return objective;
  }

  async updateObjective(id: number, objective: Partial<InsertObjective>): Promise<Objective | undefined> {
    const existingObjective = this.objectives.get(id);
    if (!existingObjective) return undefined;
    
    const updatedObjective = { ...existingObjective, ...objective };
    this.objectives.set(id, updatedObjective);
    return updatedObjective;
  }

  // Key Result implementations
  async getKeyResult(id: number): Promise<KeyResult | undefined> {
    return this.keyResults.get(id);
  }

  async getKeyResultsByObjective(objectiveId: number): Promise<KeyResult[]> {
    return Array.from(this.keyResults.values()).filter(
      keyResult => keyResult.objectiveId === objectiveId
    );
  }

  async createKeyResult(insertKeyResult: InsertKeyResult): Promise<KeyResult> {
    const id = this.keyResultCurrentId++;
    const keyResult: KeyResult = { ...insertKeyResult, id };
    this.keyResults.set(id, keyResult);
    return keyResult;
  }

  async updateKeyResult(id: number, keyResult: Partial<InsertKeyResult>): Promise<KeyResult | undefined> {
    const existingKeyResult = this.keyResults.get(id);
    if (!existingKeyResult) return undefined;
    
    const updatedKeyResult = { ...existingKeyResult, ...keyResult };
    this.keyResults.set(id, updatedKeyResult);
    return updatedKeyResult;
  }

  // Meeting implementations
  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async getAllMeetings(): Promise<Meeting[]> {
    return Array.from(this.meetings.values());
  }

  async getUserMeetings(userId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      meeting => meeting.userId1 === userId || meeting.userId2 === userId
    );
  }

  async getUpcomingMeetings(): Promise<Meeting[]> {
    const now = new Date();
    return Array.from(this.meetings.values())
      .filter(meeting => new Date(meeting.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.meetingCurrentId++;
    const meeting: Meeting = { ...insertMeeting, id };
    this.meetings.set(id, meeting);
    return meeting;
  }

  async updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const existingMeeting = this.meetings.get(id);
    if (!existingMeeting) return undefined;
    
    const updatedMeeting = { ...existingMeeting, ...meeting };
    this.meetings.set(id, updatedMeeting);
    return updatedMeeting;
  }

  // Resource implementations
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceCurrentId++;
    const resource: Resource = { ...insertResource, id, createdAt: new Date() };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined> {
    const existingResource = this.resources.get(id);
    if (!existingResource) return undefined;
    
    const updatedResource = { ...existingResource, ...resource };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  // Financial Data implementations
  async getFinancialData(id: number): Promise<FinancialData | undefined> {
    return this.financialData.get(id);
  }

  async getAllFinancialData(): Promise<FinancialData[]> {
    return Array.from(this.financialData.values());
  }

  async getFinancialDataByDate(startDate: Date, endDate: Date): Promise<FinancialData[]> {
    return Array.from(this.financialData.values()).filter(
      financialData => {
        const dataDate = new Date(financialData.date);
        return dataDate >= startDate && dataDate <= endDate;
      }
    );
  }

  async getFinancialDataByObjective(objectiveId: number): Promise<FinancialData[]> {
    return Array.from(this.financialData.values()).filter(
      financialData => financialData.objectiveId === objectiveId
    );
  }

  async createFinancialData(insertFinancialData: InsertFinancialData): Promise<FinancialData> {
    const id = this.financialDataCurrentId++;
    const financialData: FinancialData = { ...insertFinancialData, id, uploadedAt: new Date() };
    this.financialData.set(id, financialData);
    return financialData;
  }

  async updateFinancialData(id: number, financialData: Partial<InsertFinancialData>): Promise<FinancialData | undefined> {
    const existingFinancialData = this.financialData.get(id);
    if (!existingFinancialData) return undefined;
    
    const updatedFinancialData = { ...existingFinancialData, ...financialData };
    this.financialData.set(id, updatedFinancialData);
    return updatedFinancialData;
  }
}

import { DatabaseStorage } from './database-storage';

// Use DatabaseStorage instead of MemStorage for persistent data
export const storage = new DatabaseStorage();
