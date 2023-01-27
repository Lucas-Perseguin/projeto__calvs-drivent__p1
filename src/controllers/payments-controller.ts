import paymentService from "@/services/payments-service/index.js";
import { Payment } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postPayment(req: Request, res: Response): Promise<Response<Payment>> {
  try {
    const payment = paymentService.postPayment(req.body);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
