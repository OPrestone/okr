import { db } from './db';
import { 
  users, teams, objectives, keyResults, meetings, resources
} from '@shared/schema';

/**
 * Seeds the database with initial data
 */
async function seedDatabase() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    await db.delete(keyResults);
    await db.delete(objectives);
    await db.delete(meetings);
    await db.delete(resources);
    await db.delete(users);
    await db.delete(teams);

    console.log('Cleared existing data');

    // Teams
    const teamsData = [
      { name: "Product Team", description: "Responsible for product development", memberCount: 8, performance: 94 },
      { name: "Engineering", description: "Technical development team", memberCount: 12, performance: 78 },
      { name: "Marketing", description: "Market research and promotion", memberCount: 6, performance: 85 },
      { name: "Sales", description: "Sales and customer relationship", memberCount: 9, performance: 62 }
    ];

    const insertedTeams = await db.insert(teams).values(teamsData).returning();
    console.log(`Inserted ${insertedTeams.length} teams`);

    // Users
    const usersData = [
      { username: "alex.morgan", password: "password", fullName: "Alex Morgan", email: "alex@example.com", role: "Product Manager", teamId: insertedTeams[0].id },
      { username: "sarah.thompson", password: "password", fullName: "Sarah Thompson", email: "sarah@example.com", role: "UI/UX Designer", teamId: insertedTeams[0].id },
      { username: "michael.chen", password: "password", fullName: "Michael Chen", email: "michael@example.com", role: "Software Engineer", teamId: insertedTeams[1].id },
      { username: "james.wilson", password: "password", fullName: "James Wilson", email: "james@example.com", role: "Product Manager", teamId: insertedTeams[0].id }
    ];

    const insertedUsers = await db.insert(users).values(usersData).returning();
    console.log(`Inserted ${insertedUsers.length} users`);

    // Update teams with leader IDs
    await db.update(teams)
      .set({ leaderId: insertedUsers[0].id })
      .where({ id: insertedTeams[0].id });

    await db.update(teams)
      .set({ leaderId: insertedUsers[2].id })
      .where({ id: insertedTeams[1].id });

    console.log('Updated team leaders');

    // Objectives
    const currentDate = new Date();
    const endDate1 = new Date(currentDate);
    endDate1.setDate(currentDate.getDate() + 90);
    
    const endDate2 = new Date(currentDate);
    endDate2.setDate(currentDate.getDate() + 60);
    
    const endDate3 = new Date(currentDate);
    endDate3.setDate(currentDate.getDate() + 30);

    const objectivesData = [
      { 
        title: "Increase Customer Retention", 
        description: "Focus on customer satisfaction and retention", 
        progress: 72, 
        isCompanyObjective: true, 
        startDate: currentDate, 
        endDate: endDate1,
        teamId: insertedTeams[0].id,
        ownerId: insertedUsers[0].id
      },
      { 
        title: "Launch New Product Line", 
        description: "Develop and launch new product offerings", 
        progress: 45, 
        isCompanyObjective: true, 
        startDate: currentDate, 
        endDate: endDate2,
        teamId: insertedTeams[1].id,
        ownerId: insertedUsers[2].id
      },
      { 
        title: "Improve Team Engagement", 
        description: "Increase team satisfaction and productivity", 
        progress: 89, 
        isCompanyObjective: true, 
        startDate: currentDate, 
        endDate: endDate3,
        teamId: insertedTeams[0].id,
        ownerId: insertedUsers[1].id
      },
      { 
        title: "Increase Revenue by 20%", 
        description: "Focus on sales growth and efficiency", 
        progress: 63, 
        isCompanyObjective: true, 
        startDate: currentDate, 
        endDate: endDate1,
        teamId: insertedTeams[3].id,
        ownerId: insertedUsers[3].id
      }
    ];

    const insertedObjectives = await db.insert(objectives).values(objectivesData).returning();
    console.log(`Inserted ${insertedObjectives.length} objectives`);

    // Key Results
    const keyResultsData = [
      {
        title: "Reduce monthly churn rate to under 2%",
        description: "Improve retention by addressing key customer pain points",
        progress: 40,
        objectiveId: insertedObjectives[0].id,
        ownerId: insertedUsers[0].id,
        startValue: 4.5,
        targetValue: 2,
        currentValue: 3.5,
        isCompleted: false
      },
      {
        title: "Increase NPS score from 35 to 50",
        description: "Implement customer feedback initiatives to improve satisfaction",
        progress: 50,
        objectiveId: insertedObjectives[0].id,
        ownerId: insertedUsers[0].id,
        startValue: 35,
        targetValue: 50,
        currentValue: 42.5,
        isCompleted: false
      },
      {
        title: "Create component library with 50+ elements",
        description: "Build a comprehensive UI component library for designers and developers",
        progress: 75,
        objectiveId: insertedObjectives[1].id,
        ownerId: insertedUsers[1].id,
        startValue: 0,
        targetValue: 50,
        currentValue: 37,
        isCompleted: false
      },
      {
        title: "Implement design system in 5 key products",
        description: "Roll out the new design system across major product lines",
        progress: 60,
        objectiveId: insertedObjectives[1].id,
        ownerId: insertedUsers[2].id,
        startValue: 0,
        targetValue: 5,
        currentValue: 3,
        isCompleted: false
      }
    ];

    const insertedKeyResults = await db.insert(keyResults).values(keyResultsData).returning();
    console.log(`Inserted ${insertedKeyResults.length} key results`);

    // Meetings
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);

    const meetingsData = [
      { 
        title: "OKR Review", 
        description: "Weekly performance review", 
        userId1: insertedUsers[0].id, 
        userId2: insertedUsers[1].id, 
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 14, 0), 
        endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 14, 30),
        status: "scheduled"
      },
      { 
        title: "Project Planning", 
        description: "Discuss next sprint", 
        userId1: insertedUsers[0].id, 
        userId2: insertedUsers[2].id, 
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 10, 0), 
        endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 10, 30),
        status: "scheduled"
      },
      { 
        title: "Product Strategy", 
        description: "Roadmap discussion", 
        userId1: insertedUsers[0].id, 
        userId2: insertedUsers[3].id, 
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7, 15, 30), 
        endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7, 16, 0),
        status: "scheduled"
      }
    ];

    const insertedMeetings = await db.insert(meetings).values(meetingsData).returning();
    console.log(`Inserted ${insertedMeetings.length} meetings`);

    // Resources
    const resourcesData = [
      { 
        title: "OKR Best Practices Guide", 
        description: "Learn how to write effective objectives and key results", 
        type: "article", 
        url: "/resources/okr-best-practices.pdf",
        createdAt: new Date()
      },
      { 
        title: "Video Tutorial Series", 
        description: "Watch our step-by-step guide to implementing OKRs", 
        type: "video", 
        url: "/resources/okr-video-tutorial.mp4",
        createdAt: new Date()
      },
      { 
        title: "OKR Templates", 
        description: "Download ready-to-use templates for different departments", 
        type: "template", 
        url: "/resources/okr-templates.zip",
        createdAt: new Date()
      }
    ];

    const insertedResources = await db.insert(resources).values(resourcesData).returning();
    console.log(`Inserted ${insertedResources.length} resources`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Seed operation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed operation failed:', error);
    process.exit(1);
  });