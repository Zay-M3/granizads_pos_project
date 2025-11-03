import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
app.use(express.json());

// Usar las variables del .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Ruta de prueba
app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
