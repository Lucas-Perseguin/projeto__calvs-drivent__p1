import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

export function createHotels() {
  const hotels: Omit<Hotel, "id" | "createdAt" | "updatedAt">[] = [];

  function createRandomHotel(): Omit<Hotel, "id" | "createdAt" | "updatedAt"> {
    return {
      name: faker.datatype.string(),
      image: faker.internet.url(),
    };
  }

  Array.from({ length: 10 }).forEach(() => {
    hotels.push(createRandomHotel());
  });

  return prisma.hotel.createMany({
    data: hotels,
  });
}

export function createHotelWithRooms() {
  const rooms: Omit<Room, "id" | "createdAt" | "updatedAt" | "hotelId">[] = [];

  function createRandomRooms(): Omit<Room, "id" | "createdAt" | "updatedAt" | "hotelId"> {
    return {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
    };
  }

  Array.from({ length: 10 }).forEach(() => {
    rooms.push(createRandomRooms());
  });

  const hotel = {
    name: faker.datatype.string(),
    image: faker.internet.url(),
  };

  return prisma.hotel.create({
    data: {
      ...hotel,
      Rooms: {
        createMany: {
          data: rooms,
        },
      },
    },
    include: {
      Rooms: true,
    },
  });
}
