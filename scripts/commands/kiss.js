const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
  name: "kiss",
  version: "1.1.0",
  permission: 0,
  credits: "",
  description: "kiss your crush 💋",
  prefix: true,
  category: "image",
  usages: "[@mention]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args, Users }) => {
  const { threadID, messageID, senderID, mentions } = event;

  let mentionID = Object.keys(mentions)[0];
  if (!mentionID) {
    return api.sendMessage("💋 Tag someone to kiss!", threadID, messageID);
  }

  const one = senderID;
  const two = mentionID;

  const pathImg = __dirname + "/cache/kissbg.jpg";
  const pathAvt1 = __dirname + "/cache/avt1.png";
  const pathAvt2 = __dirname + "/cache/avt2.png";

  const bgURL = "https://i.postimg.cc/PxFpRznJ/5a0b80220ea7e62930aa1ced805a3270.jpg";
  const avt1 = `https://graph.facebook.com/${one}/picture?width=512&height=512`;
  const avt2 = `https://graph.facebook.com/${two}/picture?width=512&height=512`;

  const download = async (url, path) => {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(path, res.data);
  };

  try {
    await download(bgURL, pathImg);
    await download(avt1, pathAvt1);
    await download(avt2, pathAvt2);

    const background = await loadImage(pathImg);
    const avatar1 = await loadImage(pathAvt1);
    const avatar2 = await loadImage(pathAvt2);

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // 🎯 Adjusted avatar positions (face-to-face kiss)
    ctx.drawImage(avatar1, 100, 160, 100, 100); // left person
    ctx.drawImage(avatar2, 280, 160, 100, 100); // right person

    const outPath = __dirname + "/cache/kiss_result.png";
    const out = fs.createWriteStream(outPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => {
      api.sendMessage({
        body: `💋 ${Users.getName(one)} kissed ${Users.getName(two)}!`,
        attachment: fs.createReadStream(outPath)
      }, threadID, () => {
        fs.unlinkSync(pathImg);
        fs.unlinkSync(pathAvt1);
        fs.unlinkSync(pathAvt2);
        fs.unlinkSync(outPath);
      }, messageID);
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Failed to generate kiss image.", threadID, messageID);
  }
};
