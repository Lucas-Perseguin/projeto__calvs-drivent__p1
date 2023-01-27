import { Payment } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postPayment(req: Request, res: Response): Promise<any> {
  try {
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
