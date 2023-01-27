import { PaymentRequestBody } from "@/protocols.js";
import paymentsRepository from "@/repositories/payments-repository/index.js";
import { Payment } from "@prisma/client";

async function postPayment(body: PaymentRequestBody): Promise<Payment> {
  const value = await paymentsRepository.getTicketValue(body.ticketId);
  await paymentsRepository.updateTicketPaidStatus(body.ticketId);
  return await paymentsRepository.createPayment(body, value.TicketType.price);
}

async function getPayment(ticketId: number, userId: number): Promise<Payment> {
  const ticket = await paymentsRepository.verifyUserTicketOwnership(ticketId, userId);
  if (!Object.keys(ticket)) throw new Error("Unauthorized");
  return await paymentsRepository.getPayment(ticketId);
}

const paymentService = {
  postPayment,
  getPayment,
};

export default paymentService;
