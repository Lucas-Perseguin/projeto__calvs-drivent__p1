import supertest from "supertest";
import app, { init } from "@/app";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createTicketTypeWithNoHotel,
  createRoomWithHotelIdAndOneCapacity,
  createBookingWithRoomId,
} from "../factories";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /booking", () => {
  describe("When token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.post("/booking");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe("When token is valid", () => {
    it("Should respond with status 403 if user's ticketType is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 if user's ticketType does not inlcude hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithNoHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 if user's ticket has not been paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 404 if there is no room with the specified id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post("/booking")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 403 if the room has no available space", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      await createBookingWithRoomId(room.id, user.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 200 and the booking id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
      });
    });
  });
});

describe("GET /booking", () => {
  describe("When token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/booking");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe("When token is valid", () => {
    it("Should respond with status 404 if user has no booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 200 and the bookingId with room information", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      await createBookingWithRoomId(room.id, user.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          Room: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
          }),
        }),
      );
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  describe("When token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.put("/booking/1");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe("When token is valid", () => {
    it("Should respond with status 400 if the bookingId parameter is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .put("/booking/ola")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond with status 404 if there is no booking with the specified id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .put("/booking/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 403 if the user does not own the specified booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      const booking = await createBookingWithRoomId(room.id, user.id);

      const newUser = await createUser();
      const newToken = await generateValidToken(newUser);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${newToken}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 404 if there is no room with the specified id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      const booking = await createBookingWithRoomId(room.id, user.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 403 if the specified new room is with capacity full", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      const booking = await createBookingWithRoomId(room.id, user.id);

      const newRoom = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      await createBookingWithRoomId(newRoom.id, user.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 200 and the bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelIdAndOneCapacity(hotel.id);
      const booking = await createBookingWithRoomId(room.id, user.id);

      const newRoom = await createRoomWithHotelIdAndOneCapacity(hotel.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
      });
    });
  });
});
