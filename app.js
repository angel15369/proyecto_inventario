// Importar módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración del middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a la base de datos MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Rutas
app.get("/", (req, res) => {
  res.send("¡La aplicación está corriendo correctamente!");
});

// Definir puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
