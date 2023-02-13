import { createBooking, getBooking, updateBooking } from "@/controllers/bookings-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBookingSchema } from "@/schemas/bookings-schema";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(createBookingSchema), createBooking)
  .put("/:bookingId", validateBody(createBookingSchema), updateBooking);

export { bookingsRouter };
