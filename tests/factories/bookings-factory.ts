import { prisma } from "@/config";

export function createBookingWithRoomId(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}
