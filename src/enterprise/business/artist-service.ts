import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetch artist profile and analytics by artist ID
 * Includes tracks, revenue, geo performance, lost revenue, AI insights, collaborators
 * @param artistId string
 */
export async function getArtistProfile(artistId: string) {
  return prisma.artist.findUnique({
    where: { id: artistId },
    include: {
      tracks: {
        include: {
          revenues: true,
          geoPerformances: true,
          lostRevenueEvents: true,
          aiInsights: true,
          collaborators: true,
        },
      },
      geoPerformances: true,
      lostRevenueEvents: true,
      aiInsights: true,
      collaborators: true,
    },
  });
} 