import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const vets = [
    {
      name: 'City Vet Clinic',
      address: '123 Main St, New York, NY',
      phone: '555-0101',
      hours: 'Mon-Fri 9am-6pm',
      locationLat: 40.7128,
      locationLng: -74.0060,
    },
    {
      name: 'Happy Paws Hospital',
      address: '456 Elm St, Los Angeles, CA',
      phone: '555-0102',
      hours: '24/7 Emergency',
      locationLat: 34.0522,
      locationLng: -118.2437,
    },
  ]

  for (const vet of vets) {
    await prisma.vet.create({
      data: vet,
    })
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
