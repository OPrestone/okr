import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTeamSchema, insertObjectiveSchema, insertKeyResultSchema, insertMeetingSchema, insertResourceSchema, insertFinancialDataSchema, insertCycleSchema, insertCheckInSchema, insertCadenceSchema, insertTimeframeSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  handleExcelReportGeneration, 
  handlePowerPointReportGeneration, 
  handleReportPreview 
} from "./reports";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
      return cb(null, false);
    }
    cb(null, true);
  }
});

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
  
  // Check-Ins endpoints
  app.get('/api/check-ins/key-result/:keyResultId', async (req, res) => {
    try {
      const keyResultId = parseInt(req.params.keyResultId);
      if (isNaN(keyResultId)) {
        return res.status(400).json({ message: "Invalid key result ID" });
      }
      
      const checkIns = await storage.getCheckInsByKeyResult(keyResultId);
      res.json(checkIns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch check-ins" });
    }
  });

  app.post('/api/check-ins', async (req, res) => {
    try {
      const checkInData = insertCheckInSchema.parse(req.body);
      const checkIn = await storage.createCheckIn(checkInData);
      
      // Update the key result with the new value
      if (checkInData.keyResultId) {
        const keyResult = await storage.getKeyResult(checkInData.keyResultId);
        if (keyResult) {
          await storage.updateKeyResult(keyResult.id, {
            currentValue: checkInData.newValue,
            lastUpdated: new Date()
          });
        }
      }
      
      res.status(201).json(checkIn);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid check-in data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create check-in" });
    }
  });

  // Financial Data endpoints
  app.get('/api/financial-data', async (req, res) => {
    const financialData = await storage.getAllFinancialData();
    res.json(financialData);
  });

  app.get('/api/financial-data/:id', async (req, res) => {
    const dataId = parseInt(req.params.id);
    if (isNaN(dataId)) {
      return res.status(400).json({ message: "Invalid financial data ID" });
    }
    
    const data = await storage.getFinancialData(dataId);
    if (!data) {
      return res.status(404).json({ message: "Financial data not found" });
    }
    
    res.json(data);
  });

  app.get('/api/financial-data/objective/:objectiveId', async (req, res) => {
    const objectiveId = parseInt(req.params.objectiveId);
    if (isNaN(objectiveId)) {
      return res.status(400).json({ message: "Invalid objective ID" });
    }
    
    const data = await storage.getFinancialDataByObjective(objectiveId);
    res.json(data);
  });

  app.get('/api/financial-data/date-range', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const data = await storage.getFinancialDataByDate(start, end);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial data by date range" });
    }
  });

  app.post('/api/financial-data', async (req, res) => {
    try {
      const financialData = insertFinancialDataSchema.parse(req.body);
      const data = await storage.createFinancialData(financialData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid financial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial data" });
    }
  });

  app.patch('/api/financial-data/:id', async (req, res) => {
    const dataId = parseInt(req.params.id);
    if (isNaN(dataId)) {
      return res.status(400).json({ message: "Invalid financial data ID" });
    }
    
    try {
      const updateData = req.body;
      const updatedData = await storage.updateFinancialData(dataId, updateData);
      
      if (!updatedData) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      
      res.json(updatedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial data" });
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

  // Cycles endpoints
  app.get('/api/cycles', async (req, res) => {
    const cycles = await storage.getAllCycles();
    res.json(cycles);
  });

  app.get('/api/cycles/active', async (req, res) => {
    const cycles = await storage.getActiveCycles();
    res.json(cycles);
  });

  app.get('/api/cycles/:id', async (req, res) => {
    const cycleId = parseInt(req.params.id);
    if (isNaN(cycleId)) {
      return res.status(400).json({ message: "Invalid cycle ID" });
    }
    
    const cycle = await storage.getCycle(cycleId);
    if (!cycle) {
      return res.status(404).json({ message: "Cycle not found" });
    }
    
    res.json(cycle);
  });

  app.post('/api/cycles', async (req, res) => {
    try {
      const cycleData = insertCycleSchema.parse(req.body);
      const cycle = await storage.createCycle(cycleData);
      res.status(201).json(cycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cycle data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cycle" });
    }
  });

  app.patch('/api/cycles/:id', async (req, res) => {
    const cycleId = parseInt(req.params.id);
    if (isNaN(cycleId)) {
      return res.status(400).json({ message: "Invalid cycle ID" });
    }
    
    try {
      const updateData = req.body;
      const updatedCycle = await storage.updateCycle(cycleId, updateData);
      
      if (!updatedCycle) {
        return res.status(404).json({ message: "Cycle not found" });
      }
      
      res.json(updatedCycle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cycle" });
    }
  });

  app.delete('/api/cycles/:id', async (req, res) => {
    const cycleId = parseInt(req.params.id);
    if (isNaN(cycleId)) {
      return res.status(400).json({ message: "Invalid cycle ID" });
    }
    
    try {
      const result = await storage.deleteCycle(cycleId);
      
      if (!result) {
        return res.status(404).json({ message: "Cycle not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cycle" });
    }
  });

  // Company Settings endpoints
  app.get('/api/company-settings', async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching company settings:', error);
      res.status(500).json({ message: 'Failed to fetch company settings' });
    }
  });

  app.patch('/api/company-settings', async (req, res) => {
    try {
      const settings = req.body;
      const updatedSettings = await storage.updateCompanySettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating company settings:', error);
      res.status(500).json({ message: 'Failed to update company settings' });
    }
  });

  // Company logo upload endpoint
  app.post('/api/company-logo', upload.single('logo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Create URL to the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      
      // Update company settings with the new logo URL
      const updatedSettings = await storage.updateCompanyLogo(fileUrl);
      
      res.json({ 
        success: true, 
        logoUrl: fileUrl,
        settings: updatedSettings
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({ message: 'Failed to upload logo' });
    }
  });
  
  // System logo upload endpoint
  app.post('/api/system-logo', upload.single('logo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Create URL to the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      
      // Update system settings with the new logo URL
      const updatedSetting = await storage.updateSystemSetting(
        'systemLogo', 
        fileUrl, 
        'System logo displayed in the dashboard header', 
        'appearance'
      );
      
      res.json({ 
        success: true, 
        logoUrl: fileUrl,
        setting: updatedSetting
      });
    } catch (error) {
      console.error('Error uploading system logo:', error);
      res.status(500).json({ message: 'Failed to upload system logo' });
    }
  });
  
  // Report generation endpoints
  app.post('/api/reports/excel', async (req, res) => {
    await handleExcelReportGeneration(req, res);
  });
  
  app.post('/api/reports/powerpoint', async (req, res) => {
    await handlePowerPointReportGeneration(req, res);
  });
  
  app.post('/api/reports/preview', async (req, res) => {
    await handleReportPreview(req, res);
  });
  
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Set cache headers for uploaded images
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
    next();
  }, express.static(uploadsDir));

  // Cadence endpoints
  app.get('/api/cadences', async (req, res) => {
    try {
      // Add debugging for storage object
      console.log('Storage type:', storage.constructor.name);
      console.log('Cadence methods available:', 'getAllCadences' in storage);
      
      const cadences = await storage.getAllCadences();
      res.json(cadences);
    } catch (error) {
      console.error('Error fetching cadences:', error);
      res.status(500).json({ message: "Failed to fetch cadences", error: String(error) });
    }
  });

  app.get('/api/cadences/:id', async (req, res) => {
    try {
      const cadenceId = parseInt(req.params.id);
      if (isNaN(cadenceId)) {
        return res.status(400).json({ message: "Invalid cadence ID" });
      }
      
      const cadence = await storage.getCadence(cadenceId);
      if (!cadence) {
        return res.status(404).json({ message: "Cadence not found" });
      }
      
      res.json(cadence);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cadence" });
    }
  });

  app.post('/api/cadences', async (req, res) => {
    try {
      const cadenceData = insertCadenceSchema.parse(req.body);
      const cadence = await storage.createCadence(cadenceData);
      res.status(201).json(cadence);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cadence data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cadence" });
    }
  });

  app.patch('/api/cadences/:id', async (req, res) => {
    try {
      const cadenceId = parseInt(req.params.id);
      if (isNaN(cadenceId)) {
        return res.status(400).json({ message: "Invalid cadence ID" });
      }
      
      const updateData = req.body;
      const updatedCadence = await storage.updateCadence(cadenceId, updateData);
      
      if (!updatedCadence) {
        return res.status(404).json({ message: "Cadence not found" });
      }
      
      res.json(updatedCadence);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cadence" });
    }
  });

  app.delete('/api/cadences/:id', async (req, res) => {
    try {
      const cadenceId = parseInt(req.params.id);
      if (isNaN(cadenceId)) {
        return res.status(400).json({ message: "Invalid cadence ID" });
      }
      
      const success = await storage.deleteCadence(cadenceId);
      if (!success) {
        return res.status(400).json({ 
          message: "Cannot delete cadence. It might have associated timeframes or may not exist." 
        });
      }
      
      res.status(200).json({ message: "Cadence deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cadence" });
    }
  });

  // Timeframe endpoints
  app.get('/api/timeframes', async (req, res) => {
    try {
      // Add debugging for storage object
      console.log('Storage type:', storage.constructor.name);
      console.log('Timeframe methods available:', 'getAllTimeframes' in storage);
      
      // Check if filtering by cadence ID
      const cadenceId = req.query.cadenceId ? parseInt(req.query.cadenceId as string) : null;
      
      if (cadenceId && !isNaN(cadenceId)) {
        console.log('Fetching timeframes for cadence ID:', cadenceId);
        const timeframes = await storage.getTimeframesByCadence(cadenceId);
        return res.json(timeframes);
      }
      
      // Otherwise return all timeframes
      console.log('Fetching all timeframes');
      const timeframes = await storage.getAllTimeframes();
      res.json(timeframes);
    } catch (error) {
      console.error('Error fetching timeframes:', error);
      res.status(500).json({ message: "Failed to fetch timeframes", error: String(error) });
    }
  });

  app.get('/api/timeframes/active', async (req, res) => {
    try {
      const timeframes = await storage.getActiveTimeframes();
      res.json(timeframes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active timeframes" });
    }
  });

  app.get('/api/timeframes/:id', async (req, res) => {
    try {
      const timeframeId = parseInt(req.params.id);
      if (isNaN(timeframeId)) {
        return res.status(400).json({ message: "Invalid timeframe ID" });
      }
      
      const timeframe = await storage.getTimeframe(timeframeId);
      if (!timeframe) {
        return res.status(404).json({ message: "Timeframe not found" });
      }
      
      res.json(timeframe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeframe" });
    }
  });

  app.post('/api/timeframes', async (req, res) => {
    try {
      const timeframeData = insertTimeframeSchema.parse(req.body);
      
      // If setting this timeframe as active, deactivate other timeframes in the same cadence
      if (timeframeData.isActive) {
        const existingTimeframes = await storage.getTimeframesByCadence(timeframeData.cadenceId);
        for (const timeframe of existingTimeframes) {
          if (timeframe.isActive) {
            await storage.setTimeframeActive(timeframe.id, false);
          }
        }
      }
      
      const timeframe = await storage.createTimeframe(timeframeData);
      res.status(201).json(timeframe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid timeframe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create timeframe" });
    }
  });

  app.patch('/api/timeframes/:id', async (req, res) => {
    try {
      const timeframeId = parseInt(req.params.id);
      if (isNaN(timeframeId)) {
        return res.status(400).json({ message: "Invalid timeframe ID" });
      }
      
      const updateData = req.body;
      
      // If updating active status to true, deactivate other timeframes in the same cadence
      if (updateData.isActive === true) {
        const timeframe = await storage.getTimeframe(timeframeId);
        if (timeframe) {
          const existingTimeframes = await storage.getTimeframesByCadence(timeframe.cadenceId);
          for (const tf of existingTimeframes) {
            if (tf.id !== timeframeId && tf.isActive) {
              await storage.setTimeframeActive(tf.id, false);
            }
          }
        }
      }
      
      const updatedTimeframe = await storage.updateTimeframe(timeframeId, updateData);
      
      if (!updatedTimeframe) {
        return res.status(404).json({ message: "Timeframe not found" });
      }
      
      res.json(updatedTimeframe);
    } catch (error) {
      res.status(500).json({ message: "Failed to update timeframe" });
    }
  });

  app.patch('/api/timeframes/:id/active', async (req, res) => {
    try {
      const timeframeId = parseInt(req.params.id);
      if (isNaN(timeframeId)) {
        return res.status(400).json({ message: "Invalid timeframe ID" });
      }
      
      const { isActive } = req.body;
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: "isActive must be a boolean value" });
      }
      
      // If setting to active, deactivate others in the same cadence
      if (isActive) {
        const timeframe = await storage.getTimeframe(timeframeId);
        if (timeframe) {
          const existingTimeframes = await storage.getTimeframesByCadence(timeframe.cadenceId);
          for (const tf of existingTimeframes) {
            if (tf.id !== timeframeId && tf.isActive) {
              await storage.setTimeframeActive(tf.id, false);
            }
          }
        }
      }
      
      const updatedTimeframe = await storage.setTimeframeActive(timeframeId, isActive);
      
      if (!updatedTimeframe) {
        return res.status(404).json({ message: "Timeframe not found" });
      }
      
      res.json(updatedTimeframe);
    } catch (error) {
      res.status(500).json({ message: "Failed to update timeframe active status" });
    }
  });

  app.delete('/api/timeframes/:id', async (req, res) => {
    try {
      const timeframeId = parseInt(req.params.id);
      if (isNaN(timeframeId)) {
        return res.status(400).json({ message: "Invalid timeframe ID" });
      }
      
      const success = await storage.deleteTimeframe(timeframeId);
      if (!success) {
        return res.status(404).json({ message: "Timeframe not found" });
      }
      
      res.status(200).json({ message: "Timeframe deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete timeframe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
