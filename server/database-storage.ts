import { 
  User, InsertUser, Team, InsertTeam, Objective, InsertObjective, 
  KeyResult, InsertKeyResult, Meeting, InsertMeeting, Resource, InsertResource,
  FinancialData, InsertFinancialData, Cycle, InsertCycle, SystemSetting,
  users, teams, objectives, keyResults, meetings, resources, financialData, cycles,
  checkIns, comments, userCycles, teamCycles, notifications, meetingAgendaItems,
  companySettings, systemSettings
} from "@shared/schema";
import { db } from './db';
import { eq, and, gt, gte, lte, between, sql, desc, asc, isNull, not, or } from 'drizzle-orm';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Team operations
  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }
  
  async getAllTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }
  
  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }
  
  async updateTeam(id: number, teamData: Partial<InsertTeam>): Promise<Team | undefined> {
    const [updatedTeam] = await db
      .update(teams)
      .set({
        ...teamData,
        updatedAt: new Date()
      })
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  }
  
  // Objective operations
  async getObjective(id: number): Promise<Objective | undefined> {
    const [objective] = await db.select().from(objectives).where(eq(objectives.id, id));
    return objective;
  }
  
  async getAllObjectives(): Promise<Objective[]> {
    return db.select().from(objectives);
  }
  
  async getCompanyObjectives(): Promise<Objective[]> {
    return db.select().from(objectives).where(eq(objectives.isCompanyObjective, true));
  }
  
  async getTeamObjectives(teamId: number): Promise<Objective[]> {
    return db.select().from(objectives).where(eq(objectives.teamId, teamId));
  }
  
  async createObjective(insertObjective: InsertObjective): Promise<Objective> {
    const [objective] = await db.insert(objectives).values(insertObjective).returning();
    
    // If this objective belongs to a team, update the team_cycles count
    if (insertObjective.teamId && insertObjective.cycleId) {
      await db
        .update(teamCycles)
        .set({ 
          objectiveCount: sql`${teamCycles.objectiveCount} + 1` 
        })
        .where(
          and(
            eq(teamCycles.teamId, insertObjective.teamId),
            eq(teamCycles.cycleId, insertObjective.cycleId)
          )
        );
    }
    
    // If this objective has an owner and cycle, update the user_cycles count
    if (insertObjective.ownerId && insertObjective.cycleId) {
      await db
        .update(userCycles)
        .set({ 
          objectiveCount: sql`${userCycles.objectiveCount} + 1` 
        })
        .where(
          and(
            eq(userCycles.userId, insertObjective.ownerId),
            eq(userCycles.cycleId, insertObjective.cycleId)
          )
        );
    }
    
    return objective;
  }
  
  async updateObjective(id: number, objectiveData: Partial<InsertObjective>): Promise<Objective | undefined> {
    // Get the original objective first
    const [originalObjective] = await db
      .select()
      .from(objectives)
      .where(eq(objectives.id, id));
      
    if (!originalObjective) {
      return undefined;
    }
    
    // Update the objective
    const [updatedObjective] = await db
      .update(objectives)
      .set({
        ...objectiveData,
        updatedAt: new Date()
      })
      .where(eq(objectives.id, id))
      .returning();
      
    // Handle completion status change
    if (
      objectiveData.status === 'completed' && 
      originalObjective.status !== 'completed' &&
      updatedObjective.cycleId
    ) {
      // If team objective, update team_cycles
      if (updatedObjective.teamId) {
        await db
          .update(teamCycles)
          .set({ 
            completedObjectives: sql`${teamCycles.completedObjectives} + 1` 
          })
          .where(
            and(
              eq(teamCycles.teamId, updatedObjective.teamId),
              eq(teamCycles.cycleId, updatedObjective.cycleId)
            )
          );
      }
      
      // If user owned, update user_cycles
      if (updatedObjective.ownerId) {
        await db
          .update(userCycles)
          .set({ 
            completedObjectives: sql`${userCycles.completedObjectives} + 1` 
          })
          .where(
            and(
              eq(userCycles.userId, updatedObjective.ownerId),
              eq(userCycles.cycleId, updatedObjective.cycleId)
            )
          );
      }
    }
      
    return updatedObjective;
  }
  
  // Key Result operations
  async getKeyResult(id: number): Promise<KeyResult | undefined> {
    const [keyResult] = await db.select().from(keyResults).where(eq(keyResults.id, id));
    return keyResult;
  }
  
  async getKeyResultsByObjective(objectiveId: number): Promise<KeyResult[]> {
    return db.select().from(keyResults).where(eq(keyResults.objectiveId, objectiveId));
  }
  
  async createKeyResult(insertKeyResult: InsertKeyResult): Promise<KeyResult> {
    const [keyResult] = await db.insert(keyResults).values(insertKeyResult).returning();
    return keyResult;
  }
  
  async updateKeyResult(id: number, keyResultData: Partial<InsertKeyResult>): Promise<KeyResult | undefined> {
    // Get original key result
    const [originalKeyResult] = await db
      .select()
      .from(keyResults)
      .where(eq(keyResults.id, id));
      
    if (!originalKeyResult) {
      return undefined;
    }
    
    // Update the key result
    const [updatedKeyResult] = await db
      .update(keyResults)
      .set({
        ...keyResultData,
        lastUpdated: new Date(),
        updatedAt: new Date()
      })
      .where(eq(keyResults.id, id))
      .returning();
      
    // If the value has changed, create a check-in record
    if (
      keyResultData.currentValue !== undefined && 
      keyResultData.currentValue !== originalKeyResult.currentValue &&
      originalKeyResult.ownerId
    ) {
      await db.insert(checkIns).values({
        keyResultId: id,
        objectiveId: originalKeyResult.objectiveId,
        authorId: originalKeyResult.ownerId,
        newValue: keyResultData.currentValue,
        previousValue: originalKeyResult.currentValue,
        progressDelta: keyResultData.progress 
          ? keyResultData.progress - (originalKeyResult.progress || 0)
          : undefined,
        checkInDate: new Date()
      });
    }
    
    // If completion status changed, update the objective progress
    if (
      keyResultData.isCompleted !== undefined && 
      keyResultData.isCompleted !== originalKeyResult.isCompleted
    ) {
      // Get all key results for the objective
      const allKeyResults = await db
        .select()
        .from(keyResults)
        .where(eq(keyResults.objectiveId, originalKeyResult.objectiveId));
        
      // Calculate new progress
      const completedCount = allKeyResults.filter(kr => 
        kr.id === id ? keyResultData.isCompleted : kr.isCompleted
      ).length;
      
      const newProgress = (completedCount / allKeyResults.length) * 100;
      
      // Update the objective progress
      await db
        .update(objectives)
        .set({
          progress: newProgress,
          updatedAt: new Date()
        })
        .where(eq(objectives.id, originalKeyResult.objectiveId));
    }
      
    return updatedKeyResult;
  }
  
  // Check-In operations
  async getCheckIn(id: number): Promise<CheckIn | undefined> {
    const [checkIn] = await db.select().from(checkIns).where(eq(checkIns.id, id));
    return checkIn;
  }
  
  async getCheckInsByKeyResult(keyResultId: number): Promise<CheckIn[]> {
    return db
      .select()
      .from(checkIns)
      .where(eq(checkIns.keyResultId, keyResultId))
      .orderBy(desc(checkIns.checkInDate));
  }
  
  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const [checkIn] = await db.insert(checkIns).values({
      ...insertCheckIn,
      createdAt: new Date(),
      checkInDate: new Date()
    }).returning();
    
    // If a key result is associated, update its last updated timestamp
    if (checkIn.keyResultId) {
      await db
        .update(keyResults)
        .set({
          lastUpdated: new Date(),
          updatedAt: new Date()
        })
        .where(eq(keyResults.id, checkIn.keyResultId));
    }
    
    return checkIn;
  }
  
  // Meeting operations
  async getMeeting(id: number): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting;
  }
  
  async getAllMeetings(): Promise<Meeting[]> {
    return db.select().from(meetings);
  }
  
  async getUserMeetings(userId: number): Promise<Meeting[]> {
    return db
      .select()
      .from(meetings)
      .where(
        or(
          eq(meetings.userId1, userId), 
          eq(meetings.userId2, userId)
        )
      );
  }
  
  async getUpcomingMeetings(): Promise<Meeting[]> {
    return db
      .select()
      .from(meetings)
      .where(
        and(
          gt(meetings.startTime, new Date()),
          eq(meetings.status, 'scheduled')
        )
      )
      .orderBy(meetings.startTime);
  }
  
  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const [meeting] = await db.insert(meetings).values(insertMeeting).returning();
    
    // Create notifications for participants
    await db.insert(notifications).values([
      {
        recipientId: meeting.userId1,
        title: 'New Meeting Scheduled',
        content: `A meeting "${meeting.title}" has been scheduled for ${new Date(meeting.startTime).toLocaleString()}`,
        type: 'meeting_scheduled',
        entityType: 'meeting',
        entityId: meeting.id,
        priority: 'normal'
      },
      {
        recipientId: meeting.userId2,
        title: 'New Meeting Scheduled',
        content: `A meeting "${meeting.title}" has been scheduled for ${new Date(meeting.startTime).toLocaleString()}`,
        type: 'meeting_scheduled',
        entityType: 'meeting',
        entityId: meeting.id,
        priority: 'normal'
      }
    ]);
    
    return meeting;
  }
  
  async updateMeeting(id: number, meetingData: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        ...meetingData,
        updatedAt: new Date()
      })
      .where(eq(meetings.id, id))
      .returning();
      
    // If status changed to cancelled, notify participants
    if (meetingData.status === 'cancelled') {
      await db.insert(notifications).values([
        {
          recipientId: updatedMeeting.userId1,
          title: 'Meeting Cancelled',
          content: `The meeting "${updatedMeeting.title}" has been cancelled`,
          type: 'meeting_cancelled',
          entityType: 'meeting',
          entityId: updatedMeeting.id,
          priority: 'high'
        },
        {
          recipientId: updatedMeeting.userId2,
          title: 'Meeting Cancelled',
          content: `The meeting "${updatedMeeting.title}" has been cancelled`,
          type: 'meeting_cancelled',
          entityType: 'meeting',
          entityId: updatedMeeting.id,
          priority: 'high'
        }
      ]);
    }
      
    return updatedMeeting;
  }
  
  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources).orderBy(desc(resources.createdAt));
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }
  
  async updateResource(id: number, resourceData: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updatedResource] = await db
      .update(resources)
      .set({
        ...resourceData,
        updatedAt: new Date()
      })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }
  
  // Financial Data operations
  async getFinancialData(id: number): Promise<FinancialData | undefined> {
    const [data] = await db.select().from(financialData).where(eq(financialData.id, id));
    return data;
  }
  
  async getAllFinancialData(): Promise<FinancialData[]> {
    return db.select().from(financialData).orderBy(desc(financialData.date));
  }
  
  async getFinancialDataByDate(startDate: Date, endDate: Date): Promise<FinancialData[]> {
    return db
      .select()
      .from(financialData)
      .where(
        and(
          gte(financialData.date, startDate),
          lte(financialData.date, endDate)
        )
      )
      .orderBy(asc(financialData.date));
  }
  
  async getFinancialDataByObjective(objectiveId: number): Promise<FinancialData[]> {
    return db
      .select()
      .from(financialData)
      .where(eq(financialData.objectiveId, objectiveId))
      .orderBy(asc(financialData.date));
  }
  
  async createFinancialData(insertFinancialData: InsertFinancialData): Promise<FinancialData> {
    const [data] = await db.insert(financialData).values(insertFinancialData).returning();
    return data;
  }
  
  async updateFinancialData(id: number, data: Partial<InsertFinancialData>): Promise<FinancialData | undefined> {
    const [updatedData] = await db
      .update(financialData)
      .set(data)
      .where(eq(financialData.id, id))
      .returning();
    return updatedData;
  }
  
  // Cycle operations
  async getCycle(id: number): Promise<Cycle | undefined> {
    const [cycle] = await db.select().from(cycles).where(eq(cycles.id, id));
    return cycle;
  }
  
  async getAllCycles(): Promise<Cycle[]> {
    return db.select().from(cycles).orderBy(desc(cycles.startDate));
  }
  
  async getActiveCycles(): Promise<Cycle[]> {
    const now = new Date();
    return db
      .select()
      .from(cycles)
      .where(
        and(
          lte(cycles.startDate, now),
          gte(cycles.endDate, now)
        )
      )
      .orderBy(desc(cycles.startDate));
  }
  
  async createCycle(insertCycle: InsertCycle): Promise<Cycle> {
    // If setting this as default cycle, clear other defaults
    if (insertCycle.isDefault) {
      await db
        .update(cycles)
        .set({ isDefault: false })
        .where(eq(cycles.isDefault, true));
    }
    
    const [cycle] = await db.insert(cycles).values(insertCycle).returning();
    
    // Create cycle relationships with users and teams
    if (cycle.id) {
      // Create user_cycles for all users
      const allUsers = await db.select().from(users);
      if (allUsers.length > 0) {
        const userCycleValues = allUsers.map(user => ({
          userId: user.id,
          cycleId: cycle.id,
        }));
        
        await db.insert(userCycles).values(userCycleValues);
      }
      
      // Create team_cycles for all teams
      const allTeams = await db.select().from(teams);
      if (allTeams.length > 0) {
        const teamCycleValues = allTeams.map(team => ({
          teamId: team.id,
          cycleId: cycle.id,
        }));
        
        await db.insert(teamCycles).values(teamCycleValues);
      }
    }
    
    return cycle;
  }
  
  async updateCycle(id: number, cycleData: Partial<InsertCycle>): Promise<Cycle | undefined> {
    // If setting this as default cycle, clear other defaults
    if (cycleData.isDefault) {
      await db
        .update(cycles)
        .set({ isDefault: false })
        .where(
          and(
            eq(cycles.isDefault, true),
            not(eq(cycles.id, id))
          )
        );
    }
    
    const [updatedCycle] = await db
      .update(cycles)
      .set({
        ...cycleData,
        updatedAt: new Date()
      })
      .where(eq(cycles.id, id))
      .returning();
    return updatedCycle;
  }
  
  async deleteCycle(id: number): Promise<boolean> {
    try {
      // First check if cycle has any associated objectives
      const objectives = await db
        .select()
        .from(objectives)
        .where(eq(objectives.cycleId, id));
        
      if (objectives.length > 0) {
        // Can't delete cycle with associated objectives
        return false;
      }
      
      // Delete cycle relationships
      await db.delete(userCycles).where(eq(userCycles.cycleId, id));
      await db.delete(teamCycles).where(eq(teamCycles.cycleId, id));
      
      // Delete the cycle
      await db.delete(cycles).where(eq(cycles.id, id));
      
      return true;
    } catch (error) {
      console.error("Error deleting cycle:", error);
      return false;
    }
  }
  
  // Company Settings operations
  async getCompanySettings(): Promise<any> {
    try {
      const [settings] = await db.select().from(companySettings);
      return settings || {};
    } catch (error) {
      console.error("Error fetching company settings:", error);
      return {};
    }
  }
  
  async updateCompanyLogo(logoUrl: string): Promise<any> {
    try {
      const [settings] = await db.select().from(companySettings);
      
      if (settings) {
        // Update existing settings
        const [updatedSettings] = await db
          .update(companySettings)
          .set({
            logoUrl,
            updatedAt: new Date()
          })
          .where(eq(companySettings.id, settings.id))
          .returning();
          
        return updatedSettings;
      } else {
        // Create settings if they don't exist
        const [newSettings] = await db
          .insert(companySettings)
          .values({
            logoUrl,
            name: "My Company",
            primaryColor: "#4f46e5",
          })
          .returning();
          
        return newSettings;
      }
    } catch (error) {
      console.error("Error updating company logo:", error);
      return {};
    }
  }
  
  async updateCompanySettings(settings: Partial<any>): Promise<any> {
    try {
      const [existingSettings] = await db.select().from(companySettings);
      
      if (existingSettings) {
        // Update existing settings
        const [updatedSettings] = await db
          .update(companySettings)
          .set({
            ...settings,
            updatedAt: new Date()
          })
          .where(eq(companySettings.id, existingSettings.id))
          .returning();
          
        return updatedSettings;
      } else {
        // Create settings if they don't exist
        const [newSettings] = await db
          .insert(companySettings)
          .values({
            ...settings,
            name: settings.name || "My Company",
            primaryColor: settings.primaryColor || "#4f46e5",
          })
          .returning();
          
        return newSettings;
      }
    } catch (error) {
      console.error("Error updating company settings:", error);
      return {};
    }
  }
  
  async updateSystemSetting(key: string, value: string, description: string = '', category: string = 'general'): Promise<any> {
    try {
      // Check if the setting exists
      const [existingSetting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, key));
      
      if (existingSetting) {
        // Update existing setting
        const [updatedSetting] = await db
          .update(systemSettings)
          .set({
            value,
            updatedAt: new Date()
          })
          .where(eq(systemSettings.id, existingSetting.id))
          .returning();
          
        return updatedSetting;
      } else {
        // Create new setting
        const [newSetting] = await db
          .insert(systemSettings)
          .values({
            key,
            value,
            description,
            category,
            isPublic: true
          })
          .returning();
          
        return newSetting;
      }
    } catch (error) {
      console.error(`Error updating system setting (${key}):`, error);
      return {};
    }
  }
}