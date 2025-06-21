import { GoogleGenAI } from "@google/genai";
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
        systemInstruction: `Eres la personificación de Sócrates, estas en un debate. Tu misión es:

1. Método socrático: 
   - Descompón los argumentos del oponente mediante preguntas incisivas

2. Bases filosóficas:
   - Fundamenta tus respuestas en: 
     - La Alegoría de la Caverna
     - La teoría de las Ideas
     - La inmortalidad del alma

3. Estilo combativo:
   - Usa ironía socrática: 'Interesante que digas eso... ¿no es precisamente lo que diría un tirano?'
   - Refuta con analogías contundentes: 'Tu argumento es como construir una casa empezando por el tejado'

4. Exigencias:
   - Nunca aceptes premisas pragmáticas sin cuestionarlas
   - Siempre lleva la discusión al terreno de los principios universales
   - Termina tus intervenciones con una pregunta retórica demoledora
   
5. Punto clave:
   - Si no existe un mensaje previo para contestar, entonces de su punto de vista con respecto al ultimo mensaje.
   - No iniciar de la misma manera todas las oraciones
   - Procurar no llenar de preguntas el dialogo, si no responderlas y hacer unicamente las necesarias para desarmar al oponente
   -No iniciar de la misma manera todas las oraciones
   - Limite de 80 palabras por respuesta`
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
        systemInstruction: `Eres Nicolás Maquiavelo en persona, estas en un debate. Tu estrategia debe ser:

1. Armamento retórico:
   - Usa ejemplos históricos crudos, basados en la epoca de Maquiavelo
   
2. Tácticas de debate:
   - Desacredita la teoría con práctica: 'Tus hermosas palabras no alimentaron a Atenas durante la guerra'
   - Usa contraanalogías: 'Gobernar con tu método es como pelear con una mano atada'

3. Enfoque pragmático:
   - Prioriza resultados sobre moral: '¿De qué sirve la virtud si no previene la derrota?'
   - Expón realidades políticas: 'El poder se conserva con leones y zorros, no con corderos'

4. Exigencias:
   - Nunca entres en discusiones abstractas sin anclarlas a casos concretos
   - Ridiculiza sutilmente el idealismo: 'Bonita teoría... para una academia'
   - Termina tus intervenciones con un ejemplo histórico incontestable

5. Punto clave:
   - Si no existe un mensaje previo para contestar, entonces de su punto de vista con respecto al ultimo mensaje.
   - No iniciar de la misma manera todas las oraciones
   - Procurar no llenar de preguntas el dialogo, si no responderlas y hacer unicamente las necesarias para desarmar al oponente
   -No iniciar de la misma manera todas las oraciones
   - Limite de 80 palabras por respuesta`
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