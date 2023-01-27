import { prisma } from "@/config/database";
import { PaymentRequestBody } from "@/protocols";
import { Payment, Ticket, TicketStatus } from "@prisma/client";

function getTicketValue(ticketId: number): Promise<{ TicketType: { price: number } }> {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    select: {
      TicketType: {
        select: {
          price: true,
        },
      },
    },
  });
}

async function updateTicketPaidStatus(ticketId: number): Promise<Ticket> {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

function createPayment(body: PaymentRequestBody, value: number): Promise<Payment> {
  return prisma.payment.create({
    data: {
      ticketId: body.ticketId,
      value,
      cardIssuer: body.cardData.issuer,
      cardLastDigits: `${body.cardData.number}`.slice(-3),
    },
  });
}

const paymentsRepository = {
  getTicketValue,
  updateTicketPaidStatus,
  createPayment,
};

export default paymentsRepository;
