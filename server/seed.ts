/**
 * Database seeding script for initial setup
 * 
 * Run with: npm run seed
 */

import { pool, db } from './db';
import { 
  statusLabels, 
  cadences, 
  timeframes, 
  users, 
  teams 
} from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedStatusLabels() {
  console.log('Seeding status labels...');
  
  // Check if status labels already exist
  const existingLabels = await db.select().from(statusLabels);
  if (existingLabels.length > 0) {
    console.log('Status labels already exist, skipping...');
    return;
  }

  const objectiveStatusLabels = [
    {
      name: 'Not Started',
      description: 'This objective has not been started yet',
      color: '#6c757d',
      type: 'objective',
      isDefault: true,
      isActive: true,
      sortOrder: 10
    },
    {
      name: 'In Progress',
      description: 'Work on this objective is currently in progress',
      color: '#0d6efd',
      type: 'objective',
      isDefault: false,
      isActive: true,
      sortOrder: 20
    },
    {
      name: 'At Risk',
      description: 'This objective is at risk of not being completed on time',
      color: '#dc3545',
      type: 'objective',
      isDefault: false,
      isActive: true,
      sortOrder: 30
    },
    {
      name: 'On Track',
      description: 'This objective is progressing as expected',
      color: '#198754',
      type: 'objective',
      isDefault: false,
      isActive: true,
      sortOrder: 40
    },
    {
      name: 'Completed',
      description: 'This objective has been completed',
      color: '#20c997',
      type: 'objective',
      isDefault: false,
      isActive: true,
      sortOrder: 50
    }
  ];

  const keyResultStatusLabels = [
    {
      name: 'Not Started',
      description: 'This key result has not been started yet',
      color: '#6c757d',
      type: 'key_result',
      isDefault: true,
      isActive: true,
      sortOrder: 10
    },
    {
      name: 'Behind',
      description: 'This key result is behind schedule',
      color: '#fd7e14',
      type: 'key_result',
      isDefault: false,
      isActive: true,
      sortOrder: 20
    },
    {
      name: 'At Risk',
      description: 'This key result is at risk of not being achieved',
      color: '#dc3545',
      type: 'key_result',
      isDefault: false,
      isActive: true,
      sortOrder: 30
    },
    {
      name: 'On Track',
      description: 'This key result is on track to be achieved',
      color: '#198754',
      type: 'key_result',
      isDefault: false,
      isActive: true,
      sortOrder: 40
    },
    {
      name: 'Achieved',
      description: 'This key result has been achieved',
      color: '#20c997',
      type: 'key_result',
      isDefault: false,
      isActive: true,
      sortOrder: 50
    }
  ];

  await db.insert(statusLabels).values([...objectiveStatusLabels, ...keyResultStatusLabels]);
  console.log('Status labels seeded successfully');
}

async function seedCadences() {
  console.log('Seeding cadences...');
  
  // Check if cadences already exist
  const existingCadences = await db.select().from(cadences);
  if (existingCadences.length > 0) {
    console.log('Cadences already exist, skipping...');
    return;
  }

  const cadenceData = [
    {
      name: 'Quarterly',
      description: 'Standard quarterly OKR planning cycle',
      color: '#4f46e5'
    },
    {
      name: 'Monthly',
      description: 'Monthly planning cycle for rapid iteration',
      color: '#0ea5e9'
    },
    {
      name: 'Annual',
      description: 'Annual strategic planning cycle',
      color: '#8b5cf6'
    },
    {
      name: 'Custom',
      description: 'Custom timeframe for special projects',
      color: '#ec4899'
    }
  ];

  await db.insert(cadences).values(cadenceData);
  console.log('Cadences seeded successfully');
}

async function seedTimeframes() {
  console.log('Seeding timeframes...');
  
  // Check if timeframes already exist
  const existingTimeframes = await db.select().from(timeframes);
  if (existingTimeframes.length > 0) {
    console.log('Timeframes already exist, skipping...');
    return;
  }

  // Get cadence IDs
  const cadenceList = await db.select().from(cadences);
  if (cadenceList.length === 0) {
    console.log('No cadences found, please seed cadences first');
    return;
  }

  const cadenceMap = new Map(cadenceList.map(c => [c.name, c.id]));

  const quarterlyId = cadenceMap.get('Quarterly');
  const monthlyId = cadenceMap.get('Monthly');
  const annualId = cadenceMap.get('Annual');
  const customId = cadenceMap.get('Custom');

  if (!quarterlyId || !monthlyId || !annualId || !customId) {
    console.log('Missing cadences, cannot seed timeframes');
    return;
  }

  const timeframeData = [
    {
      name: 'Q1 2025',
      cadenceId: quarterlyId,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      isActive: true
    },
    {
      name: 'Q2 2025',
      cadenceId: quarterlyId,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-06-30'),
      isActive: false
    },
    {
      name: 'Q3 2025',
      cadenceId: quarterlyId,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-09-30'),
      isActive: false
    },
    {
      name: 'Q4 2025',
      cadenceId: quarterlyId,
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-31'),
      isActive: false
    },
    {
      name: 'January 2025',
      cadenceId: monthlyId,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      isActive: true
    },
    {
      name: 'February 2025',
      cadenceId: monthlyId,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
      isActive: false
    },
    {
      name: 'March 2025',
      cadenceId: monthlyId,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      isActive: false
    },
    {
      name: '2025',
      cadenceId: annualId,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true
    },
    {
      name: 'Marketing Campaign',
      cadenceId: customId,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-05-31'),
      isActive: true
    }
  ];

  await db.insert(timeframes).values(timeframeData);
  console.log('Timeframes seeded successfully');
}

async function seedBasicTeams() {
  console.log('Seeding basic teams...');
  
  // Check if teams already exist
  const existingTeams = await db.select().from(teams);
  if (existingTeams.length > 0) {
    console.log('Teams already exist, skipping...');
    return;
  }

  const teamData = [
    {
      name: 'Product Team',
      description: 'Responsible for product development'
    },
    {
      name: 'Engineering',
      description: 'Technical development team'
    },
    {
      name: 'Marketing',
      description: 'Market research and promotion'
    },
    {
      name: 'Sales',
      description: 'Sales and customer relationship'
    }
  ];

  await db.insert(teams).values(teamData);
  console.log('Basic teams seeded successfully');
}

async function seedDemoUser() {
  console.log('Seeding demo user...');
  
  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.username, 'demo'));
  if (existingUser.length > 0) {
    console.log('Demo user already exists, skipping...');
    return;
  }

  // Get first team
  const team = await db.select().from(teams).limit(1);
  const teamId = team.length > 0 ? team[0].id : null;

  const userData = {
    username: 'demo',
    password: '$2b$10$rGnCbja8dP8kXJ4GlbLOVOyAB0xJL2ExY5sLgQpY.VuVjNlLEu/Ai', // hashed 'password123'
    fullName: 'Demo User',
    email: 'demo@example.com',
    role: 'Product Manager',
    teamId: teamId
  };

  await db.insert(users).values(userData);
  console.log('Demo user seeded successfully');
}

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Seed in sequence
    await seedStatusLabels();
    await seedCadences();
    await seedTimeframes();
    await seedBasicTeams();
    await seedDemoUser();
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// Run the seed function if this file is executed directly
if (process.argv[1] === import.meta.url) {
  seed().catch(console.error);
}

export { seed };