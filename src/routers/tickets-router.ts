import { getTicketTypes, getUserTicket, postTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares";
import { CreateTicketSchema } from "@/schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getUserTicket)
  .post("/", validateBody(CreateTicketSchema), postTicket);

export { ticketsRouter };
