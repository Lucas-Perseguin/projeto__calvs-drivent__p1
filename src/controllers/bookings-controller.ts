import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/bookings-service";
import { Booking } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response): Promise<Response<Booking>> {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response): Promise<Response<{ id: number }>> {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const bookingId = await bookingService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(bookingId);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response): Promise<Response<{ id: number }>> {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;
  if (!bookingId || isNaN(Number(bookingId))) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const booking = await bookingService.updateBooking(roomId, Number(bookingId), userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
