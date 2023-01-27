import { authenticateToken } from "@/middlewares/authentication-middleware";
import { validateBody } from "@/middlewares/validation-middleware";
import { CreatePaymentSchema } from "@/schemas/payments-schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).post("/process", validateBody(CreatePaymentSchema)).get("/");

export { paymentsRouter };
