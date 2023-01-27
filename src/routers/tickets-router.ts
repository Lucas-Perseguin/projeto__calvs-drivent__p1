import { getTicketTypes, getUserTicket, postTicket } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { validateBody } from "@/middlewares/validation-middleware";
import { CreateTicketSchema } from "@/schemas/tickets-schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getUserTicket)
  .post("/", validateBody(CreateTicketSchema), postTicket);

export { ticketsRouter };
