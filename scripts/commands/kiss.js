const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "kiss",
  version: "1.0.1",
  permission: 0,
  prefix: true,
  credits: "Fixed by ChatGPT",
  description: "Send a kiss with anime style 💋",
  category: "img",
  usages: "[@mention]",
  cooldowns: 5
};

const templateURL = "https://raw.githubusercontent.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/refs/heads/main/img/anime_kiss_resized_700x440.png";

async function downloadFile(url, filePath) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, Buffer.from(res.data));
}

module.exports.onLoad = async () => {
  const folder = path.join(__dirname, "cache", "img");
  const templatePath = path.join(folder, "anime_kiss_resized_700x440.png");

  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  if (!fs.existsSync(templatePath)) {
    await downloadFile(templateURL, templatePath);
  }
};

async function circle(imagePath) {
  const img = await jimp.read(imagePath);
  img.circle();
  return img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const folder = path.join(__dirname, "cache", "img");
  const template = await jimp.read(path.join(folder, "anime_kiss_resized_700x440.png"));

  const onePath = path.join(folder, `avt_${one}.png`);
  const twoPath = path.join(folder, `avt_${two}.png`);
  const outPath = path.join(folder, `kiss_${one}_${two}.png`);

  const avt1 = await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(onePath, Buffer.from(avt1.data));

  const avt2 = await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(twoPath, Buffer.from(avt2.data));

  const circled2 = await jimp.read(await circle(onePath));
  const circled1 = await jimp.read(await circle(twoPath));

  // Adjust avatar positions & sizes based on new image size (700x440)
  template.composite(circled1.resize(140, 140), 90, 170);  // Left avatar
  template.composite(circled2.resize(140, 140), 400, 60); // Right avatar

  const buffer = await template.getBufferAsync("image/png");
  fs.writeFileSync(outPath, buffer);

  fs.unlinkSync(onePath);
  fs.unlinkSync(twoPath);

  return outPath;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length === 0) {
    return api.sendMessage("Please mention someone to kiss 😘", threadID, messageID);
  }

  const targetID = mentionIDs[0];

  try {
    const imagePath = await makeImage({ one: senderID, two: targetID });

    api.sendMessage(
      {
        body: "💋 Mwah~ Here's your kiss!",
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      () => fs.unlinkSync(imagePath),
      messageID
    );
  } catch (err) {
    console.error("❌ Kiss command error:", err);
    api.sendMessage("Something went wrong 😓", threadID, messageID);
  }
};
