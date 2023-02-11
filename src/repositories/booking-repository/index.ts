import { prisma } from "@/config";
import { Booking } from "@prisma/client";

function getBooking(userId: number): Promise<Booking> {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

function getRoomWithBookings(id: number) {
  return prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      Booking: true,
    },
  });
}

function createBooking(userId: number, roomId: number): Promise<{ id: number }> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function updateBooking(roomId: number, id: number): Promise<{ id: number }> {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function findBookingById(id: number): Promise<Booking> {
  return prisma.booking.findUnique({
    where: {
      id,
    },
  });
}

const bookingRepository = {
  getBooking,
  createBooking,
  getRoomWithBookings,
  updateBooking,
  findBookingById,
};

export default bookingRepository;
