import { getPayment, postPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares";
import { CreatePaymentSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .post("/process", validateBody(CreatePaymentSchema), postPayment)
  .get("/", getPayment);

export { paymentsRouter };
