import { notFoundError } from "@/errors";
import { ApplicationError } from "@/protocols";
import bookingRepository from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Booking, TicketStatus } from "@prisma/client";

async function getBooking(userId: number): Promise<Booking | ApplicationError> {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function createBooking(
  userId: number,
  roomId: number,
): Promise<{ id: number } | { message: string } | ApplicationError> {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === TicketStatus.PAID)
    throw new Error("Forbidden");
  const room = await bookingRepository.getRoomWithBookings(roomId);
  if (!room) throw notFoundError();
  else if (room.Booking.length >= room.capacity) throw new Error("Forbidden");
  const bookingId = await bookingRepository.createBooking(userId, roomId);
  return bookingId;
}

async function updateBooking(
  roomId: number,
  bookingId: number,
  userId: number,
): Promise<{ id: number } | { message: string } | ApplicationError> {
  const oldBooking = await bookingRepository.findBookingById(bookingId);
  if (oldBooking.userId !== userId) throw new Error("Forbidden");
  const room = await bookingRepository.getRoomWithBookings(roomId);
  if (!room) throw notFoundError();
  else if (room.Booking.length >= room.capacity) throw new Error("Forbidden");
  const booking = await bookingRepository.updateBooking(roomId, bookingId);
  return booking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingService;