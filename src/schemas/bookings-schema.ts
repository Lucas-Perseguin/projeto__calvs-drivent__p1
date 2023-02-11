import Joi from "joi";

export const createBookingSchema = Joi.object({
  roomId: Joi.number().required(),
});
