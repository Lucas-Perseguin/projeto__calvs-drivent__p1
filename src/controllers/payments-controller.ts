import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payments-service";
import { Payment } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postPayment(req: Request, res: Response): Promise<Response<Payment>> {
  try {
    const payment = paymentService.postPayment(req.body);
    return res.status(httpStatus.CREATED).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response): Promise<Response<Payment>> {
  const { userId } = req;
  const { ticketId } = req.query;
  if (!ticketId || isNaN(Number(ticketId))) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const payment = paymentService.getPayment(Number(ticketId), userId);
    if (!Object.keys(payment)) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error === "Unauthorized") return res.sendStatus(401);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
