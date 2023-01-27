import ticketsRepository from "@/repositories/tickets-repository/index";
import { Ticket, TicketType } from "@prisma/client";

async function getTicketTypes(): Promise<TicketType[]> {
  return await ticketsRepository.getTicketTypes();
}

async function getUserTicket(id: number): Promise<Ticket> {
  return await ticketsRepository.getUserTicket(id);
}

async function postTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollmentId = await ticketsRepository.getEnrollmentId(userId);
  return await ticketsRepository.createTicket(ticketTypeId, enrollmentId.id);
}

const ticketsService = {
  getTicketTypes,
  getUserTicket,
  postTicket,
};

export default ticketsService;
