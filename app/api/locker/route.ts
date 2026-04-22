import { NextResponse } from 'next/server'

// Availability levels and their bar counts (out of 4)
type AvailabilityLevel = 'NORMAL' | 'LOW' | 'VERY_LOW' | 'FULL'

function randomAvailability(): AvailabilityLevel {
  const levels: AvailabilityLevel[] = ['NORMAL', 'NORMAL', 'LOW', 'VERY_LOW', 'FULL']
  return levels[Math.floor(Math.random() * levels.length)]
}

// Returns randomised locker availability on every request.
// The candidate must mock this endpoint (page.route) to get deterministic data
// for visual snapshot tests — otherwise screenshots will always differ.
export async function GET() {
  return NextResponse.json({
    name: 'UK00009605',
    locationName: 'Hind Grove Food and Wine',
    address: {
      line1: '212 Hind Grove',
      line2: 'London, E14 6HP',
    },
    description: 'Outdoor locker, in front of the shop entrance.',
    openingHours: '24/7',
    status: 'Operating',
    image_url: 'https://static.easypack24.net/points/gb/images/UK00009605.jpg',
    // A = S, B = M, C = L  (mapped from InPost internal naming to user-facing sizes)
    locker_availability: {
      status: 'NORMAL',
      details: {
        S: randomAvailability(),
        M: randomAvailability(),
        L: randomAvailability(),
      },
    },
    // Dynamic review count — another element requiring masking in visual tests
    trustpilot_reviews: Math.floor(Math.random() * 500) + 1200,
    trustpilot_score: 4.6,
  })
}
