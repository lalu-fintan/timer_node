const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "danz8ugpr",
  api_key: "624757829732576",
  api_secret: "NFgeEY54D0irV_uTQXzmtPmSmaw",
  secure: true,
});

module.exports = cloudinary;
