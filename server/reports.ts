import exceljs from 'exceljs';
const { Workbook } = exceljs;
import PptxGenJS from 'pptxgenjs';
import { storage } from './storage';
import { Objective, KeyResult, Team, User } from '@shared/schema';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request, Response } from 'express';

// Ensure reports directory exists
const reportsDir = join(process.cwd(), 'uploads', 'reports');
if (!existsSync(reportsDir)) {
  mkdirSync(reportsDir, { recursive: true });
}

interface ReportFilters {
  timePeriod: string;
  teamId?: number;
  reportType: 'detailed' | 'summary' | 'highlights';
}

/**
 * Generate Excel report based on filters
 */
export async function generateExcelReport(filters: ReportFilters): Promise<string> {
  const { timePeriod, teamId, reportType } = filters;
  
  // Create a new workbook
  const workbook = new Workbook();
  
  // Add a worksheet
  const worksheet = workbook.addWorksheet('OKR Report');
  
  // Add company info
  const companySettings = await storage.getCompanySettings();
  worksheet.addRow(['Company:', companySettings?.companyName || 'OKR Dashboard']);
  worksheet.addRow(['Report Period:', timePeriod]);
  worksheet.addRow(['Report Type:', reportType]);
  
  // Add space
  worksheet.addRow([]);
  
  // Get objectives
  let objectives: Objective[] = [];
  
  if (teamId) {
    const team = await storage.getTeam(teamId);
    worksheet.addRow(['Team:', team?.name || 'Unknown Team']);
    objectives = await storage.getTeamObjectives(teamId);
  } else {
    worksheet.addRow(['Team:', 'All Teams']);
    objectives = await storage.getAllObjectives();
  }
  
  // Add objectives data
  worksheet.addRow(['Objectives Overview']);
  worksheet.addRow(['ID', 'Title', 'Description', 'Progress', 'Status', 'Start Date', 'End Date', 'Owner']);
  
  // Format the header row
  const headerRow = worksheet.lastRow;
  if (headerRow) {
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    });
  }
  
  // Add all objectives
  for (const objective of objectives) {
    let ownerName = 'N/A';
    if (objective.ownerId) {
      const owner = await storage.getUser(objective.ownerId);
      ownerName = owner?.fullName || owner?.username || 'N/A';
    }
    
    worksheet.addRow([
      objective.id,
      objective.title,
      objective.description || '',
      `${objective.progress || 0}%`,
      objective.status || 'Not Started',
      objective.startDate ? new Date(objective.startDate).toLocaleDateString() : 'N/A',
      objective.endDate ? new Date(objective.endDate).toLocaleDateString() : 'N/A',
      ownerName
    ]);
  }
  
  // Add key results for each objective
  if (reportType === 'detailed') {
    worksheet.addRow([]);
    worksheet.addRow(['Key Results Breakdown']);
    
    const keyResultsSheet = workbook.addWorksheet('Key Results');
    keyResultsSheet.addRow(['Objective ID', 'Objective Title', 'Key Result ID', 'Title', 'Progress', 'Target', 'Current', 'Owner']);
    
    // Format header
    const krHeaderRow = keyResultsSheet.lastRow;
    if (krHeaderRow) {
      krHeaderRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
      });
    }
    
    for (const objective of objectives) {
      const keyResults = await storage.getKeyResultsByObjective(objective.id);
      
      for (const kr of keyResults) {
        let ownerName = 'N/A';
        if (kr.ownerId) {
          const owner = await storage.getUser(kr.ownerId);
          ownerName = owner?.fullName || owner?.username || 'N/A';
        }
        
        keyResultsSheet.addRow([
          objective.id,
          objective.title,
          kr.id,
          kr.title,
          `${kr.progress || 0}%`,
          kr.targetValue || 'Not set',
          kr.currentValue || 'Not set',
          ownerName
        ]);
      }
    }
    
    // Auto fit columns
    keyResultsSheet.columns.forEach((column: Column) => {
      column.width = 20;
    });
  }
  
  // Auto fit columns
  worksheet.columns.forEach((column: Column) => {
    column.width = 20;
  });
  
  // Add team performance if this is a summary report
  if (reportType === 'summary' || reportType === 'detailed') {
    const teamsSheet = workbook.addWorksheet('Team Performance');
    
    teamsSheet.addRow(['Team Performance Summary']);
    teamsSheet.addRow(['Team', 'Objectives Count', 'Completed', 'At Risk', 'Progress']);
    
    // Format header
    const teamHeaderRow = teamsSheet.lastRow;
    if (teamHeaderRow) {
      teamHeaderRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
      });
    }
    
    // Get all teams
    const teams = await storage.getAllTeams();
    
    for (const team of teams) {
      const teamObjectives = await storage.getTeamObjectives(team.id);
      
      const completedCount = teamObjectives.filter(o => o.status === 'completed').length;
      const atRiskCount = teamObjectives.filter(o => o.status === 'at-risk').length;
      
      // Calculate average progress
      const avgProgress = teamObjectives.length > 0
        ? teamObjectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / teamObjectives.length
        : 0;
      
      teamsSheet.addRow([
        team.name,
        teamObjectives.length,
        completedCount,
        atRiskCount,
        `${Math.round(avgProgress)}%`
      ]);
    }
    
    // Auto fit columns
    teamsSheet.columns.forEach((column: Column) => {
      column.width = 20;
    });
  }
  
  // Generate a unique filename
  const timestamp = new Date().getTime();
  const filename = `okr_report_${timePeriod}_${timestamp}.xlsx`;
  const filepath = join(reportsDir, filename);
  
  // Write the file
  await workbook.xlsx.writeFile(filepath);
  
  // Return the relative path
  return `/uploads/reports/${filename}`;
}

/**
 * Generate PowerPoint report based on filters
 */
export async function generatePowerPointReport(filters: ReportFilters): Promise<string> {
  const { timePeriod, teamId, reportType } = filters;
  
  // Create a new presentation
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.layout = 'LAYOUT_WIDE';
  
  // Get company settings
  const companySettings = await storage.getCompanySettings();
  const companyName = companySettings?.companyName || 'OKR Dashboard';
  
  // Title slide
  const titleSlide = pptx.addSlide();
  
  titleSlide.addText(
    [
      { text: 'OKR Report\n', options: { fontSize: 36, color: '0088CC', bold: true } },
      { text: `${timePeriod}`, options: { fontSize: 28, color: '404040' } },
    ],
    { x: 0.5, y: 1.0, w: 9.0, h: 1.5, align: 'center' }
  );
  
  titleSlide.addText(
    `${companyName}`,
    { x: 0.5, y: 2.5, w: 9.0, h: 0.5, align: 'center', fontSize: 18, color: '666666' }
  );
  
  // Add the current date
  titleSlide.addText(
    `Generated on ${new Date().toLocaleDateString()}`,
    { x: 0.5, y: 5.0, w: 9.0, h: 0.5, align: 'center', fontSize: 12, color: '888888' }
  );
  
  // Executive Summary slide
  const summarySlide = pptx.addSlide();
  summarySlide.addText(
    'Executive Summary',
    { x: 0.5, y: 0.5, w: 9.0, h: 0.5, fontSize: 24, color: '0088CC', bold: true }
  );
  
  // Get objectives
  let objectives: Objective[] = [];
  let teamName = 'All Teams';
  
  if (teamId) {
    const team = await storage.getTeam(teamId);
    teamName = team?.name || 'Unknown Team';
    objectives = await storage.getTeamObjectives(teamId);
  } else {
    objectives = await storage.getAllObjectives();
  }
  
  // Calculate statistics
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(o => o.status === 'completed').length;
  const avgProgress = totalObjectives > 0
    ? objectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / totalObjectives
    : 0;
  
  summarySlide.addText(
    [
      { text: `Team: ${teamName}\n`, options: { fontSize: 16, color: '404040', bold: true } },
      { text: `Reporting Period: ${timePeriod}\n`, options: { fontSize: 14, color: '404040' } },
      { text: `\nOverall Progress: ${Math.round(avgProgress)}%\n`, options: { fontSize: 18, color: '0088CC', bold: true } },
      { text: `\nTotal Objectives: ${totalObjectives}\n`, options: { fontSize: 14, color: '404040' } },
      { text: `Completed Objectives: ${completedObjectives}\n`, options: { fontSize: 14, color: '404040' } },
      { text: `Completion Rate: ${totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0}%\n`, options: { fontSize: 14, color: '404040' } },
    ],
    { x: 0.5, y: 1.2, w: 9.0, h: 3.0, align: 'left' }
  );
  
  // Add objectives overview slide
  const objectivesSlide = pptx.addSlide();
  objectivesSlide.addText(
    'Objectives Overview',
    { x: 0.5, y: 0.5, w: 9.0, h: 0.5, fontSize: 24, color: '0088CC', bold: true }
  );
  
  // Create table rows for objectives
  const tableRows = [
    [
      { text: 'Title', options: { bold: true, fill: 'E0E0E0' } },
      { text: 'Progress', options: { bold: true, fill: 'E0E0E0' } },
      { text: 'Status', options: { bold: true, fill: 'E0E0E0' } }
    ]
  ];
  
  // Only include top objectives based on report type
  const limitObjectives = reportType === 'highlights' ? 5 : objectives.length;
  const sortedObjectives = [...objectives].sort((a, b) => (b.progress || 0) - (a.progress || 0));
  
  for (let i = 0; i < Math.min(sortedObjectives.length, limitObjectives); i++) {
    const objective = sortedObjectives[i];
    tableRows.push([
      { text: objective.title },
      { text: `${objective.progress || 0}%` },
      { text: objective.status || 'Not Started' }
    ]);
  }
  
  objectivesSlide.addTable(tableRows, { x: 0.5, y: 1.2, w: 9.0, colW: [5, 2, 2] });
  
  // Add key achievements slide if this is a detailed or highlights report
  if (reportType === 'detailed' || reportType === 'highlights') {
    const achievementsSlide = pptx.addSlide();
    achievementsSlide.addText(
      'Key Achievements',
      { x: 0.5, y: 0.5, w: 9.0, h: 0.5, fontSize: 24, color: '0088CC', bold: true }
    );
    
    // Get completed key results
    let completedKRs: KeyResult[] = [];
    for (const objective of objectives) {
      const keyResults = await storage.getKeyResultsByObjective(objective.id);
      completedKRs = completedKRs.concat(keyResults.filter(kr => kr.isCompleted));
    }
    
    if (completedKRs.length > 0) {
      const krListItems = completedKRs.slice(0, 5).map(kr => `• ${kr.title}`).join('\n');
      
      achievementsSlide.addText(
        krListItems,
        { x: 0.5, y: 1.2, w: 9.0, h: 4.0, fontSize: 16, color: '404040', bullet: { type: 'bullet' } }
      );
    } else {
      achievementsSlide.addText(
        'No completed key results found for this period.',
        { x: 0.5, y: 1.2, w: 9.0, h: 1.0, fontSize: 16, color: '888888', italic: true }
      );
    }
  }
  
  // Add next quarter planning slide
  const planningSlide = pptx.addSlide();
  planningSlide.addText(
    'Next Quarter Planning',
    { x: 0.5, y: 0.5, w: 9.0, h: 0.5, fontSize: 24, color: '0088CC', bold: true }
  );
  
  planningSlide.addText(
    'Focus Areas for Next Quarter:',
    { x: 0.5, y: 1.2, w: 9.0, h: 0.3, fontSize: 16, color: '404040', bold: true }
  );
  
  // Find in-progress objectives as suggestions for next quarter
  const inProgressObjectives = objectives.filter(o => o.progress && o.progress < 100 && o.progress > 0);
  
  if (inProgressObjectives.length > 0) {
    const focusAreas = inProgressObjectives
      .slice(0, 4)
      .map((obj, index) => `${index + 1}. Continue work on: ${obj.title} (Current: ${obj.progress}%)`)
      .join('\n\n');
    
    planningSlide.addText(
      focusAreas,
      { x: 0.5, y: 1.6, w: 9.0, h: 3.0, fontSize: 14, color: '404040' }
    );
  } else {
    planningSlide.addText(
      'No in-progress objectives found to suggest for next quarter planning.',
      { x: 0.5, y: 1.6, w: 9.0, h: 1.0, fontSize: 14, color: '888888', italic: true }
    );
  }
  
  // Generate a unique filename
  const timestamp = new Date().getTime();
  const filename = `okr_presentation_${timePeriod}_${timestamp}.pptx`;
  const filepath = join(reportsDir, filename);
  
  // Write the file
  await pptx.writeFile({ fileName: filepath });
  
  // Return the relative path
  return `/uploads/reports/${filename}`;
}

/**
 * Generate report preview data (a JSON representation of what will be in the report)
 */
export async function generateReportPreview(filters: ReportFilters): Promise<any> {
  const { timePeriod, teamId, reportType } = filters;
  
  // Get objectives
  let objectives: Objective[] = [];
  let teamName = 'All Teams';
  
  if (teamId) {
    const team = await storage.getTeam(teamId);
    teamName = team?.name || 'Unknown Team';
    objectives = await storage.getTeamObjectives(teamId);
  } else {
    objectives = await storage.getAllObjectives();
  }
  
  // Calculate statistics
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(o => o.status === 'completed').length;
  const atRiskObjectives = objectives.filter(o => o.status === 'at-risk').length;
  const avgProgress = totalObjectives > 0
    ? objectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / totalObjectives
    : 0;
  
  // Get a preview of key results
  let keyResultsPreview: any[] = [];
  if (objectives.length > 0 && objectives[0]) {
    const firstObjectiveKRs = await storage.getKeyResultsByObjective(objectives[0].id);
    keyResultsPreview = firstObjectiveKRs.slice(0, 3).map(kr => ({
      id: kr.id,
      title: kr.title,
      progress: kr.progress,
      isCompleted: kr.isCompleted
    }));
  }
  
  return {
    reportInfo: {
      timePeriod,
      teamName,
      reportType,
      generatedAt: new Date().toISOString()
    },
    summary: {
      totalObjectives,
      completedObjectives,
      atRiskObjectives,
      avgProgress: Math.round(avgProgress)
    },
    previewData: {
      objectivesCount: objectives.length,
      objectives: objectives.slice(0, 3).map(obj => ({
        id: obj.id,
        title: obj.title,
        progress: obj.progress,
        status: obj.status
      })),
      keyResultsPreview
    }
  };
}

/**
 * Handle Excel report generation request
 */
export async function handleExcelReportGeneration(req: Request, res: Response) {
  try {
    const { timePeriod, teamId, reportType } = req.body;
    
    if (!timePeriod || !reportType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const filters: ReportFilters = {
      timePeriod,
      reportType,
      ...(teamId && { teamId: parseInt(teamId) })
    };
    
    const reportPath = await generateExcelReport(filters);
    
    res.json({
      success: true,
      reportUrl: reportPath
    });
  } catch (error) {
    console.error('Error generating Excel report:', error);
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
}

/**
 * Handle PowerPoint report generation request
 */
export async function handlePowerPointReportGeneration(req: Request, res: Response) {
  try {
    const { timePeriod, teamId, reportType } = req.body;
    
    if (!timePeriod || !reportType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const filters: ReportFilters = {
      timePeriod,
      reportType,
      ...(teamId && { teamId: parseInt(teamId) })
    };
    
    const reportPath = await generatePowerPointReport(filters);
    
    res.json({
      success: true,
      reportUrl: reportPath
    });
  } catch (error) {
    console.error('Error generating PowerPoint report:', error);
    res.status(500).json({ error: 'Failed to generate PowerPoint report' });
  }
}

/**
 * Handle report preview request
 */
export async function handleReportPreview(req: Request, res: Response) {
  try {
    const { timePeriod, teamId, reportType } = req.body;
    
    if (!timePeriod || !reportType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const filters: ReportFilters = {
      timePeriod,
      reportType,
      ...(teamId && { teamId: parseInt(teamId) })
    };
    
    const previewData = await generateReportPreview(filters);
    
    res.json({
      success: true,
      preview: previewData
    });
  } catch (error) {
    console.error('Error generating report preview:', error);
    res.status(500).json({ error: 'Failed to generate report preview' });
  }
}