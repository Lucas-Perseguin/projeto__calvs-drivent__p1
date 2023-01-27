import { prisma } from "@/config/database";
import { Ticket, TicketStatus, TicketType } from "@prisma/client";

function getTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

function getUserTicket(id: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId: id,
      },
    },
    include: {
      TicketType: true,
    },
  });
}

function getEnrollmentId(userId: number): Promise<{ id: number }> {
  return prisma.enrollment.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
}

function createTicket(ticketTypeId: number, enrollmentId: number): Promise<Ticket> {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: TicketStatus.RESERVED,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  getTicketTypes,
  getUserTicket,
  getEnrollmentId,
  createTicket,
};

export default ticketsRepository;
