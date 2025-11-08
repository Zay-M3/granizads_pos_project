import { pool } from "./config/db.js";

const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conectado a PostgreSQL:", result.rows[0]);
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error.message);
  } finally {
    pool.end();
  }
};

testConnection();
