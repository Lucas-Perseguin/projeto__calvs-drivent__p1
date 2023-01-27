import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payments-service";
import { Payment } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postPayment(req: AuthenticatedRequest, res: Response): Promise<Response<Payment>> {
  const { userId } = req;
  try {
    const payment = await paymentService.postPayment(req.body, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.message === "Unauthorized") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.message === "NOT_FOUND") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response): Promise<Response<Payment>> {
  const { userId } = req;
  const { ticketId } = req.query;
  if (!ticketId || isNaN(Number(ticketId))) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const payment = await paymentService.getPayment(Number(ticketId), userId);
    if (!payment) return res.sendStatus(httpStatus.NO_CONTENT);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.message === "Unauthorized") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.message === "NOT_FOUND") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
