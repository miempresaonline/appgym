import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get distinct exercises for the user
    // @ts-ignore
    const userId = session.user.id;
    
    const exercises = await prisma.exercise.findMany({
      where: { userId },
      select: {
        name: true,
        trackingType: true
      },
      distinct: ['name']
    });

    return NextResponse.json({ exercises }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching exercises" }, { status: 500 });
  }
}
