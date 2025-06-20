import  {Router}  from "express";
import {experto1,experto2} from "../services/gemini.js";
import { getListarchat, getListarExpert, postAgregarExpert, putModificarExpert, delElimnarExpert,deltHistorial } from "../controllers/peticiones.js";

const router = new Router;
router.get("/experto1",experto1);
router.get("/experto2",experto2);
router.get("/listar", getListarchat);
router.get("/listar/:id", getListarExpert);
router.post("/agregar", postAgregarExpert);
router.put("/modificar/:id", putModificarExpert);   
router.delete("/eliminar/:id", delElimnarExpert);
router.delete("/delthistorial", deltHistorial);

export default router;