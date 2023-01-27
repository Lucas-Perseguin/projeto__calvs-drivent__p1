import { PaymentRequestBody } from "@/protocols";
import paymentsRepository from "@/repositories/payments-repository";
import { Payment } from "@prisma/client";

async function postPayment(body: PaymentRequestBody, userId: number): Promise<Payment> {
  const ticketExists = await paymentsRepository.verifyTicketExistence(body.ticketId);
  if (!ticketExists) throw new Error("NOT_FOUND");
  const ticket = await paymentsRepository.verifyUserTicketOwnership(body.ticketId, userId);
  if (!ticket) throw new Error("Unauthorized");
  const value = await paymentsRepository.getTicketValue(body.ticketId);
  await paymentsRepository.updateTicketPaidStatus(body.ticketId);
  return await paymentsRepository.createPayment(body, value.TicketType.price);
}

async function getPayment(ticketId: number, userId: number): Promise<Payment> {
  const ticketExists = await paymentsRepository.verifyTicketExistence(ticketId);
  if (!ticketExists) throw new Error("NOT_FOUND");
  const ticket = await paymentsRepository.verifyUserTicketOwnership(ticketId, userId);
  if (!ticket) throw new Error("Unauthorized");
  return await paymentsRepository.getPayment(ticketId);
}

const paymentService = {
  postPayment,
  getPayment,
};

export default paymentService;
