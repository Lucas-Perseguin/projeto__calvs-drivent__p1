import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Ticket, TicketType } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketTypes(req: Request, res: Response): Promise<Response<TicketType[]>> {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.status(httpStatus.NO_CONTENT).send([]);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response): Promise<Response<Ticket>> {
  const { userId } = req;
  try {
    const ticket = await ticketsService.getUserTicket(userId);
    if (!ticket) return res.sendStatus(404);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NO_CONTENT).send([]);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response): Promise<Response<Ticket>> {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  try {
    const ticket = await ticketsService.postTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    return res.status(404).send([]);
  }
}
