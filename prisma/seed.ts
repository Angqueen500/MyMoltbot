import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data to avoid duplicates in seed dev
  // Delete related models first
  await prisma.reportUpdate.deleteMany();
  await prisma.helpOffer.deleteMany();
  await prisma.report.deleteMany();
  await prisma.vet.deleteMany();

  const vets = [
    {
      name: 'City Vet Clinic',
      address: '123 Main St, New York, NY',
      phone: '555-0101',
      hours: 'Mon-Fri 9am-6pm',
      locationLat: 40.7128,
      locationLng: -74.0060,
      specialties: JSON.stringify(['General Practice', 'Dental']),
      emergency: false,
      verified: true
    },
    {
      name: 'Happy Paws Hospital',
      address: '456 Elm St, Los Angeles, CA',
      phone: '555-0102',
      hours: '24/7 Emergency',
      locationLat: 34.0522,
      locationLng: -118.2437,
      specialties: JSON.stringify(['Emergency', 'Surgery', 'Orthopedics']),
      emergency: true,
      verified: true
    },
    {
      name: 'Uptown Pet Care',
      address: '789 Broadway, New York, NY',
      phone: '555-0103',
      hours: 'Mon-Sat 10am-8pm',
      locationLat: 40.7580,
      locationLng: -73.9855,
      specialties: JSON.stringify(['Cats', 'Exotics']),
      emergency: false,
      verified: false
    },
  ];

  for (const vet of vets) {
    await prisma.vet.create({ data: vet });
  }

  const reports = [
    {
      imagePath: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
      description: 'Found this beagle wandering near the park. Looks friendly but hungry.',
      breed: 'Beagle',
      animalType: 'Dog',
      age: 'Adult',
      status: 'REPORTED',
      tags: JSON.stringify(['Friendly', 'Hungry']),
      locationLat: 40.7200,
      locationLng: -74.0100,
      condition: JSON.stringify(['Friendly', 'Hungry']),
      collar: true,
      privacy: false
    },
    {
      imagePath: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      description: 'Small kitten hiding under a car. Seems scared.',
      breed: 'Tabby',
      animalType: 'Cat',
      age: 'Kitten',
      status: 'IN_REVIEW',
      tags: JSON.stringify(['Scared', 'Kitten']),
      locationLat: 40.7150,
      locationLng: -74.0020,
      condition: JSON.stringify(['Scared']),
      collar: false,
      privacy: true
    },
    {
      imagePath: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
      description: 'Golden Retriever spotted running loose. No collar.',
      breed: 'Golden Retriever',
      animalType: 'Dog',
      age: 'Adult',
      status: 'RESCUED',
      tags: JSON.stringify(['Friendly', 'No Collar']),
      locationLat: 34.0500,
      locationLng: -118.2400,
      condition: JSON.stringify(['Friendly']),
      collar: false,
      privacy: false
    },
  ];

  for (const report of reports) {
    const r = await prisma.report.create({ data: report });

    // Add sample comments/updates
    if (r.status === 'IN_REVIEW') {
        await prisma.reportUpdate.create({
            data: {
                text: 'A volunteer is on the way to check the location.',
                type: 'OFFICIAL',
                reportId: r.id
            }
        });
    }
    if (r.status === 'RESCUED') {
        await prisma.reportUpdate.create({
            data: {
                text: 'Update: The owner has been found! Reunited safely.',
                type: 'OFFICIAL',
                reportId: r.id
            }
        });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
