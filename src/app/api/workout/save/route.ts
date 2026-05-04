import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });

    const body = await req.json();
    const { name, duration, exercises } = body; 
    // exercises: { name: string, sets: { weight: number, reps: number }[] }[]

    // Create the workout
    const workout = await prisma.workout.create({
      data: {
        name: name || "Entrenamiento Libre",
        duration: duration || 0,
        userId: user.id,
      }
    });

    // Process exercises and sets
    for (const ex of exercises) {
      if (ex.sets.length === 0) continue;

      // Find or create exercise for this user
      let exerciseDb = await prisma.exercise.findUnique({
        where: {
          userId_name: { userId: user.id, name: ex.name }
        }
      });

      if (!exerciseDb) {
        exerciseDb = await prisma.exercise.create({
          data: {
            name: ex.name,
            userId: user.id,
            trackingType: "WEIGHT_REPS"
          }
        });
      }

      // Create sets
      const setsData = ex.sets.map((set: any) => ({
        workoutId: workout.id,
        exerciseId: exerciseDb.id,
        weight: Number(set.weight) || 0,
        reps: Number(set.reps) || 0,
        completed: true
      }));

      await prisma.set.createMany({
        data: setsData
      });
    }

    return NextResponse.json({ message: "Entrenamiento guardado", workoutId: workout.id }, { status: 200 });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
