import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";

// 🔹 Importar rutas
import router from "./routes/index.js"; 
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// =======================
// 🧩 MIDDLEWARES
// =======================
app.use(cors({
  origin: "*", // Cambia esto por tu dominio del frontend en producción
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// =======================
// 🔐 RUTAS
// =======================
app.use("/api/auth", authRoutes); // Login
app.use("/api", router);          // Rutas principales (usuarios, productos, etc.)

// =======================
// 🧪 VERIFICAR CONEXIÓN DB
// =======================
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conectado a PostgreSQL:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
  }
})();

// =======================
// 🚀 INICIAR SERVIDOR
// =======================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});
