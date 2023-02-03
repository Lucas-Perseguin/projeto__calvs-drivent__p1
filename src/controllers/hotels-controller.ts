import { Hotel } from "@prisma/client";
import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";

export async function getAllHotels(req: AuthenticatedRequest, res: Response): Promise<Response<Hotel[]>> {
  const id = req.userId;
  try {
    const hotels = await hotelsService.getAllHotels(id);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelWithRooms(req: AuthenticatedRequest, res: Response): Promise<Response<Hotel[]>> {
  const { userId } = req;
  const { id } = req.params;
  if (isNaN(Number(id))) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const hotel = await hotelsService.getHotelWithRooms(userId, Number(id));
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
