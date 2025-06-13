import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import experto from "../models/modelo.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEN_KEY });

async function obtenerHistorialCompleto() {
  return await experto.find().sort({ createdAt: 1 });
}

async function experto1(req, res) {
  try {
    const historialCompleto = await obtenerHistorialCompleto();
    let historial = historialCompleto.map(item => ({
      role: item.role,
      content: item.content
    }));

    const lastExpert2Msg = historialCompleto.reverse().find(msg => 
      msg.role === "model" 
    );

    const contexto = lastExpert2Msg ? 
      `Refuta este argumento: "${lastExpert2Msg.content}"` : 
      "Inicia el debate sobre el tema";

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: process.env.PROMPT1,
      },
      history: historial,
    });

    const resp1 = await chat.sendMessage({
      message: contexto,
    });

    const newEntry = new experto({
      role: "model",
      content: resp1.text,
      experto: "experto1"
    });

    await newEntry.save();

    res.json({
      respuesta1: resp1.text,
      message: "Respuesta generada por Experto 1"
    });

  } catch (error) {
    console.error("Error en experto1:", error);
    res.status(500).json({ error: "Error en la solicitud" });
  }
}

async function experto2(req, res) {
  try {
    const historialCompleto = await obtenerHistorialCompleto();
    let historial = historialCompleto.map(item => ({
      role: item.role,
      content: item.content
    }));

   
    const lastExpert1Msg = historialCompleto.reverse().find(msg => 
      msg.role === "model"
    );

   
    const contexto = lastExpert1Msg ? 
      `Contraargumenta esto: "${lastExpert1Msg.content}"` : 
      "Inicia el debate sobre el tema";

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: process.env.PROMPT2,
      },
      history: historial,
    });

    const resp2 = await chat.sendMessage({
      message: contexto,
    });

    const newEntry = new experto({
      role: "model",
      content: resp2.text,
      experto: "experto2" 
    });

    await newEntry.save();

    res.json({
      respuesta2: resp2.text,
      message: "Respuesta generada por Experto 2"
    });

  } catch (error) {
    console.error("Error en experto2:", error);
    res.status(500).json({ error: "Error en la solicitud" });
  }
}

export { experto1, experto2 };
