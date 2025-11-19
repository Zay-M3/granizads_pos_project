import { Router } from "express";
import {
  getInsumos,
  getInsumoById,
  getInsumosBajoStock,
  createInsumo,
  updateInsumo,
  deleteInsumo
} from "../controllers/insumos.controller.js";

const router = Router();

router.get("/", getInsumos);
router.get("/bajo-stock", getInsumosBajoStock);
router.get("/:id", getInsumoById);
router.post("/", createInsumo);
router.put("/:id", updateInsumo);
router.delete("/:id", deleteInsumo);

export default router;
