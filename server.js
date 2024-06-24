const express = require("express");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const Jimp = require("jimp");
const app = express();
dotenv.config();
const pathh = path.join(__dirname, "./views");
app.set("view engine", "hbs");
app.set("views", pathh);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/post", async (req, res) => {
  try {
    let imgRaw = path.join(__dirname, "public/raw/ramadan.jpg");
    let imgActive = path.join(__dirname, "active/ramadan.jpg");
    let imgExport = path.join(__dirname, "public/export/image.jpg");
    let textData = {
      text: `${req.body.name}`.toLocaleUpperCase(),
      maxWidth: 606,
      maxHeight: 400,
      placementX: 10,
      placementY: 265,
    };
    const clone = await Jimp.read(imgRaw);
    await clone.clone().write(imgActive);

    const active = await Jimp.read(imgActive);
    const font = await Jimp.loadFont(
      path.join(__dirname, "public/fonts/Lj9IL2GwkopiHomVovn1UfuT.ttf.fnt")
    );
    const image = await active.print(
      font,
      textData.placementX,
      textData.placementY,
      {
        text: textData.text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      },
      textData.maxWidth
    );
    await image.quality(100).write(imgExport);
    res.redirect("/success");
  } catch (err) {
    console.log(err);
  }
});
app.get("/success", (req, res) => {
  res.render("success");
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on ${port} port...`);
});
