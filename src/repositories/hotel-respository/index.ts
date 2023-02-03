import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

function getAllHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany({});
}

function getHotelWithRomms(id: number) {
  return prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getAllHotels,
  getHotelWithRomms,
};

export default hotelsRepository;
