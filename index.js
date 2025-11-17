require("dotenv").config();
const express = require("express");
const app = express();
const qrcode = require("qrcode");
const fs = require("fs");

const port = process.env.PORT || 3000;

const urlData = JSON.parse(fs.readFileSync("./data/urls.json", "utf-8"));

app.get("/urls", (req, res) => {
  if (!urlData) {
    return res.status(404).json({
      status: "fail",
      message: "data not found!",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      urls: urlData,
    },
  });
});

app.get("/urls/:key", async (req, res) => {
  const key = req.params.key;

  if (urlData[key] === undefined) {
    return res.status(404).json({
      status: "fail",
      message: "data not found!",
    });
  }

  const urlEncode = await qrcode.toDataURL(urlData[key], {
    type: "image/png",
    errorCorrectionLevel: "H",
    width: 250,
  });

  res.status(200).send(`<div><h1><img src = ${urlEncode}></img></h1></div>`);
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
