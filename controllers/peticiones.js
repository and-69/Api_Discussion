import experto from "../models/modelo.js";

const getListarchat = async (req, res) => {
    try {
        const chat = await experto.find();
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getListarExpert = async (req, res) => {
    const { id } = req.params;
    try {
        const experto = await experto.findById(id);
        console.log(experto);
        res.json({ experto });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const postAgregarExpert = async (req, res) => {
    try {
        const { nombre, mensaje } = req.body;
        const nuevoExperto = new experto({ nombre, mensaje });
        await nuevoExperto.save();
        res.status(201).json(nuevoExperto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const putModificarExpert = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, mensaje } = req.body;
        const expertoModificado = await experto.findByIdAndUpdate(id, { nombre, mensaje }, { new: true });
        if (!expertoModificado) {
            return res.status(404).json({ message: "Experto no encontrado" });
        }
        res.json(expertoModificado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const delElimnarExpert = async (req, res) => {
    try {
        const { id } = req.params;
        const expertoEliminado = await experto.findByIdAndDelete(id);
        if (!expertoEliminado) {
            return res.status(404).json({ message: "Experto no encontrado" });
        }
        res.json({ message: "Experto eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const deltHistorial = async (req, res) => {
    try {
        await experto.deleteMany({});
        res.status(200).json({ message: "Historial eliminado" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
    export { getListarchat, getListarExpert, postAgregarExpert, putModificarExpert, delElimnarExpert, deltHistorial };