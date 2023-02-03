import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-respository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function userValidations(id: number) {
  const enrollment = await enrollmentRepository.findByUserId(id);
  if (!enrollment) return notFoundError();
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) return notFoundError();
  if (ticket.status === TicketStatus.RESERVED || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw new Error("PaymentRequiredError");
  }
  return;
}

async function getAllHotels(id: number) {
  await userValidations(id);
  const hotels = await hotelsRepository.getAllHotels();
  if (hotels.length === 0) return notFoundError();
  return hotels;
}

async function getHotelWithRooms(userId: number, id: number) {
  await userValidations(userId);
  const hotel = await hotelsRepository.getHotelWithRomms(id);
  if (!hotel) return notFoundError();
  return hotel;
}

const hotelsService = {
  getAllHotels,
  getHotelWithRooms,
};

export default hotelsService;
