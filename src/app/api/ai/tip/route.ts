import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { exercise, setNum, weight, reps } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ tip: "Respira, concéntrate y a por la siguiente serie. (AI Desactivada)" });
    }

    const userName = session?.user?.name?.split(" ")[0] || "Gymbro";
    let prompt = `Eres el entrenador AppGym AI de ${userName}. Habla como un entrenador personal estricto pero motivador (estilo moderno, directo, sin florituras). ${userName} está descansando.`;
    
    if (exercise) {
      prompt += ` Acaba de terminar la serie ${setNum} de ${exercise}`;
      if (weight && reps) prompt += ` con ${weight}kg a ${reps} repeticiones.`;
      prompt += ` Dale un único consejo breve de 1 frase (máximo 15 palabras) para motivarle durante el descanso y que mejore la siguiente serie. Sé muy breve y muy directo.`;
    } else {
      prompt += ` Dale una frase motivadora breve (máximo 15 palabras) para que deje el móvil y descanse.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 50
      })
    });

    const data = await response.json();
    let tip = data.choices[0].message.content.trim();
    if (tip.startsWith('"') && tip.endsWith('"')) {
      tip = tip.substring(1, tip.length - 1);
    }

    return NextResponse.json({ tip });
  } catch (error) {
    return NextResponse.json({ tip: "Suelta el móvil, visualiza el músculo y a por la siguiente." });
  }
}
