import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTeamSchema, insertObjectiveSchema, insertKeyResultSchema, insertMeetingSchema, insertResourceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for OKR system
  const apiRouter = app.route('/api');

  // Users endpoints
  app.get('/api/users', async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });
  
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // If sendInvite flag is true in the request, we would send an invitation email here
      // This would require SendGrid API key or similar for implementation
      if (req.body.sendInvite) {
        console.log("Would send invitation email to:", userData.email);
        // For actual implementation, we'd use SendGrid or similar service
      }
      
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Teams endpoints
  app.get('/api/teams', async (req, res) => {
    const teams = await storage.getAllTeams();
    res.json(teams);
  });

  app.get('/api/teams/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);
    if (isNaN(teamId)) {
      return res.status(400).json({ message: "Invalid team ID" });
    }
    
    const team = await storage.getTeam(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    res.json(team);
  });
  
  app.post('/api/teams', async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const newTeam = await storage.createTeam(validatedData);
      res.status(201).json(newTeam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  // Objectives endpoints
  app.get('/api/objectives', async (req, res) => {
    const objectives = await storage.getAllObjectives();
    res.json(objectives);
  });

  app.get('/api/objectives/company', async (req, res) => {
    const objectives = await storage.getCompanyObjectives();
    res.json(objectives);
  });

  app.get('/api/objectives/team/:teamId', async (req, res) => {
    const teamId = parseInt(req.params.teamId);
    if (isNaN(teamId)) {
      return res.status(400).json({ message: "Invalid team ID" });
    }
    
    const objectives = await storage.getTeamObjectives(teamId);
    res.json(objectives);
  });

  app.get('/api/objectives/:id', async (req, res) => {
    const objectiveId = parseInt(req.params.id);
    if (isNaN(objectiveId)) {
      return res.status(400).json({ message: "Invalid objective ID" });
    }
    
    const objective = await storage.getObjective(objectiveId);
    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }
    
    res.json(objective);
  });

  app.post('/api/objectives', async (req, res) => {
    try {
      const objectiveData = insertObjectiveSchema.parse(req.body);
      const objective = await storage.createObjective(objectiveData);
      res.status(201).json(objective);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid objective data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create objective" });
    }
  });

  app.patch('/api/objectives/:id', async (req, res) => {
    const objectiveId = parseInt(req.params.id);
    if (isNaN(objectiveId)) {
      return res.status(400).json({ message: "Invalid objective ID" });
    }
    
    try {
      const updateData = req.body;
      const updatedObjective = await storage.updateObjective(objectiveId, updateData);
      
      if (!updatedObjective) {
        return res.status(404).json({ message: "Objective not found" });
      }
      
      res.json(updatedObjective);
    } catch (error) {
      res.status(500).json({ message: "Failed to update objective" });
    }
  });

  // Key Results endpoints
  app.get('/api/objectives/:objectiveId/key-results', async (req, res) => {
    const objectiveId = parseInt(req.params.objectiveId);
    if (isNaN(objectiveId)) {
      return res.status(400).json({ message: "Invalid objective ID" });
    }
    
    const keyResults = await storage.getKeyResultsByObjective(objectiveId);
    res.json(keyResults);
  });

  app.post('/api/key-results', async (req, res) => {
    try {
      const keyResultData = insertKeyResultSchema.parse(req.body);
      const keyResult = await storage.createKeyResult(keyResultData);
      res.status(201).json(keyResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid key result data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create key result" });
    }
  });

  app.patch('/api/key-results/:id', async (req, res) => {
    const keyResultId = parseInt(req.params.id);
    if (isNaN(keyResultId)) {
      return res.status(400).json({ message: "Invalid key result ID" });
    }
    
    try {
      const updateData = req.body;
      const updatedKeyResult = await storage.updateKeyResult(keyResultId, updateData);
      
      if (!updatedKeyResult) {
        return res.status(404).json({ message: "Key result not found" });
      }
      
      res.json(updatedKeyResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to update key result" });
    }
  });

  // Meetings endpoints
  app.get('/api/meetings', async (req, res) => {
    const meetings = await storage.getAllMeetings();
    res.json(meetings);
  });

  app.get('/api/meetings/upcoming', async (req, res) => {
    const meetings = await storage.getUpcomingMeetings();
    res.json(meetings);
  });

  app.get('/api/meetings/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const meetings = await storage.getUserMeetings(userId);
    res.json(meetings);
  });

  app.post('/api/meetings', async (req, res) => {
    try {
      const meetingData = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(meetingData);
      res.status(201).json(meeting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid meeting data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create meeting" });
    }
  });

  // Resources endpoints
  app.get('/api/resources', async (req, res) => {
    const resources = await storage.getAllResources();
    res.json(resources);
  });

  app.post('/api/resources', async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Dashboard data endpoint for quick stats
  app.get('/api/dashboard', async (req, res) => {
    try {
      const companyObjectives = await storage.getCompanyObjectives();
      const teams = await storage.getAllTeams();
      const objectives = await storage.getAllObjectives();
      const meetings = await storage.getUpcomingMeetings();
      const resources = await storage.getAllResources();
      
      const totalObjectives = companyObjectives.length;
      const completedObjectives = companyObjectives.filter(o => o.progress === 100).length;
      const inProgressObjectives = totalObjectives - completedObjectives;
      
      // Calculate average team performance
      const avgTeamPerformance = teams.reduce((sum, team) => sum + team.performance, 0) / (teams.length || 1);
      
      // Calculate key results progress
      const totalKeyResults = 45; // This would come from actual key results count
      const completedKeyResults = 24; // This would be calculated from actual data
      
      // Time remaining calculation (example: 35% of Q2 remaining)
      const timeRemainingPercentage = 35;
      const timeRemainingDays = 32;
      
      const dashboardData = {
        objectives: {
          total: totalObjectives,
          completed: completedObjectives,
          inProgress: inProgressObjectives,
          progress: (completedObjectives / totalObjectives) * 100
        },
        teamPerformance: {
          average: avgTeamPerformance,
          improvement: 5 // Percentage improvement from last month
        },
        keyResults: {
          total: totalKeyResults,
          completed: completedKeyResults,
          completionRate: (completedKeyResults / totalKeyResults) * 100
        },
        timeRemaining: {
          days: timeRemainingDays,
          percentage: timeRemainingPercentage
        },
        upcomingMeetings: meetings.slice(0, 3),
        recentResources: resources.slice(0, 3)
      };
      
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
