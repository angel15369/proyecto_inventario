const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Item = require("../MODELS/item");

// Configuración de multer para fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Ruta para mostrar todos los artículos
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.render("index", { items, message: req.session.message || null });
  req.session.message = null;
});

// Ruta para mostrar formulario de agregar artículo
router.get("/add", (req, res) => {
  res.render("addItem");
});

// Ruta para agregar artículo
router.post("/add", upload.single("photo"), async (req, res) => {
  const { code, name, description, quantity, price } = req.body;
  const photo = req.file ? req.file.filename : null;
  try {
    await new Item({ code, name, photo, description, quantity, price }).save();
    req.session.message = { type: "success", content: "Artículo agregado correctamente." };
    res.redirect("/");
  } catch (error) {
    req.session.message = { type: "danger", content: "Error al agregar el artículo." };
    res.redirect("/add");
  }
});

// Ruta para mostrar formulario de edición
router.get("/edit/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render("editItem", { item });
});

// Ruta para actualizar artículo
router.post("/edit/:id", upload.single("photo"), async (req, res) => {
  const { code, name, description, quantity, price } = req.body;
  const photo = req.file ? req.file.filename : req.body.oldPhoto;
  try {
    await Item.findByIdAndUpdate(req.params.id, { code, name, photo, description, quantity, price });
    req.session.message = { type: "success", content: "Artículo actualizado correctamente." };
    res.redirect("/");
  } catch (error) {
    req.session.message = { type: "danger", content: "Error al actualizar el artículo." };
    res.redirect(`/edit/${req.params.id}`);
  }
});

// Ruta para eliminar artículo
router.get("/delete/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item.photo) {
    fs.unlinkSync(path.join(__dirname, "../../uploads", item.photo));
  }
  await Item.findByIdAndDelete(req.params.id);
  req.session.message = { type: "info", content: "Artículo eliminado correctamente." };
  res.redirect("/");
});

module.exports = router;
