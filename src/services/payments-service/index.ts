import { PaymentRequestBody } from "@/protocols.js";
import paymentsRepository from "@/repositories/payments-repository/index.js";
import { Payment } from "@prisma/client";

async function postPayment(body: PaymentRequestBody): Promise<Payment> {
  const value = await paymentsRepository.getTicketValue(body.ticketId);
  await paymentsRepository.updateTicketPaidStatus(body.ticketId);
  return await paymentsRepository.createPayment(body, value.TicketType.price);
}

const paymentService = {
  postPayment,
};

export default paymentService;
