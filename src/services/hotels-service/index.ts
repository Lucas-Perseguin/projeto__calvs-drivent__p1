import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-respository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function userValidations(id: number) {
  const enrollment = await enrollmentRepository.findByUserId(id);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === TicketStatus.RESERVED || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw paymentRequiredError();
  }
  return;
}

async function getAllHotels(id: number) {
  await this.userValidations(id);
  const hotels = await hotelsRepository.getAllHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelWithRooms(userId: number, id: number) {
  await this.userValidations(userId);
  const hotel = await hotelsRepository.getHotelWithRomms(id);
  if (!hotel) throw notFoundError();
  return hotel;
}

const hotelsService = {
  getAllHotels,
  getHotelWithRooms,
  userValidations,
};

export default hotelsService;
