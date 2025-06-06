import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import experto from "../models/modelo.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEN_KEY });

async function experto1(req, res) {
  try {
    const lastConver = await experto.find().sort({ createdAt: 1 });
    let historial = lastConver.map(item => ({
      role: item.role,
      content: item.content
    }));

    const allMessages = await experto.find().sort({ createdAt: -1 });
    const lastExpert2Msg = allMessages.find(msg =>
      msg.content !== lastConver?.content
    );

    const contexto = lastExpert2Msg ?
      `Refuta este argumento: "${lastExpert2Msg.content}"` :
      "Inicia el debate";


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
    });

    await newEntry.save();

    res.json({
      respuesta1: resp1.text,
      message: "Respuesta generada y guardada en la base de datos",
      history: newEntry.history
    });

  } catch (error) {
    console.error("Error en experto1:", error);
    res.status(500).json({ error: "Error en la solicitud" });
  }
}

async function experto2(req, res) {
  try {
    const lastConver = await experto.find().sort({ createdAt: 1 });
    let historial = lastConver.map(item => ({
      role: item.role,
      content: item.content
    }));

    const allMessages = await experto.find().sort({ createdAt: -1 });
    const lastExpert1Msg = allMessages.find(msg =>
      msg.content !== lastConver?.content
    );

    if (!lastExpert1Msg && historial.length === 0) {
      return res.status(400).json({ error: "Debe iniciar el debate con Experto1" });
    }

    const contexto = lastExpert1Msg ?
      `Como maquiavelo, refuto específicamente: "${lastExpert1Msg.content}"` :
      "";


    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: process.env.PROMPT2,
      },
      history: historial,
    });

    const resp2 = await chat.sendMessage({
      message: contexto
    });

    const newEntry = new experto({
      role: "model",
      content: resp2.text,
    });

    await newEntry.save();

    res.json({
      respuesta2: resp2.text,
      message: "Respuesta generada y guardada en la base de datos",
      history: newEntry.history,

    });


  } catch (error) {
    console.error("Error en experto2:", error);
    res.status(500).json({ error: "Error en la solicitud" });
  }
}

export { experto1, experto2 };