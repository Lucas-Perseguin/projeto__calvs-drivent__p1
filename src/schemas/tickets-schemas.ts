import Joi from "joi";

export const CreateTicketSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});
