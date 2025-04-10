import { 
  User, InsertUser, Team, InsertTeam, Objective, InsertObjective, 
  KeyResult, InsertKeyResult, Meeting, InsertMeeting, Resource, InsertResource,
  users, teams, objectives, keyResults, meetings, resources
} from "@shared/schema";
import { db } from './db';
import { eq, and, gt, sql } from 'drizzle-orm';
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
      .set(userData)
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
      .set(teamData)
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
    return objective;
  }
  
  async updateObjective(id: number, objectiveData: Partial<InsertObjective>): Promise<Objective | undefined> {
    const [updatedObjective] = await db
      .update(objectives)
      .set(objectiveData)
      .where(eq(objectives.id, id))
      .returning();
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
    const [updatedKeyResult] = await db
      .update(keyResults)
      .set(keyResultData)
      .where(eq(keyResults.id, id))
      .returning();
    return updatedKeyResult;
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
        sql`${meetings.userId1} = ${userId} OR ${meetings.userId2} = ${userId}`
      );
  }
  
  async getUpcomingMeetings(): Promise<Meeting[]> {
    return db
      .select()
      .from(meetings)
      .where(gt(meetings.startTime, new Date()))
      .orderBy(meetings.startTime);
  }
  
  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const [meeting] = await db.insert(meetings).values(insertMeeting).returning();
    return meeting;
  }
  
  async updateMeeting(id: number, meetingData: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const [updatedMeeting] = await db
      .update(meetings)
      .set(meetingData)
      .where(eq(meetings.id, id))
      .returning();
    return updatedMeeting;
  }
  
  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }
  
  async updateResource(id: number, resourceData: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updatedResource] = await db
      .update(resources)
      .set(resourceData)
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }
}