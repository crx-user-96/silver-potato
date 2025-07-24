const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "hug",
  version: "3.1.1",
  permssion: 0,
  prefix: true,
  credits: "CYBER BOT TEAM (Fixed by ChatGPT)",
  description: "Send a hug image 🥰",
  category: "img",
  usages: "[@mention]",
  cooldowns: 5,
  dependencies: {
    axios: "",
    "fs-extra": "",
    path: "",
    jimp: ""
  }
};

const templateURL = "https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg";

async function downloadFile(url, filePath) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, Buffer.from(res.data));
}

module.exports.onLoad = async () => {
  const folderPath = path.join(__dirname, "cache", "canvas");
  const templatePath = path.join(folderPath, "hugv1.png");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

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
  const bg = await jimp.read(path.join(folder, "hugv1.png"));

  const onePath = path.join(folder, `avt_${one}.png`);
  const twoPath = path.join(folder, `avt_${two}.png`);
  const outPath = path.join(folder, `hug_${one}_${two}.png`);

  const avtOne = await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(onePath, Buffer.from(avtOne.data));

  const avtTwo = await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(twoPath, Buffer.from(avtTwo.data));

  const circledOne = await jimp.read(await circle(onePath));
  const circledTwo = await jimp.read(await circle(twoPath));

  bg.composite(circledOne.resize(150, 150), 320, 100);
  bg.composite(circledTwo.resize(130, 130), 280, 280);

  const finalBuffer = await bg.getBufferAsync("image/png");
  fs.writeFileSync(outPath, finalBuffer);

  fs.unlinkSync(onePath);
  fs.unlinkSync(twoPath);

  return outPath;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length === 0) {
    return api.sendMessage("Please mention someone to hug 🥺", threadID, messageID);
  }

  const targetID = mentionIDs[0];

  try {
    const imagePath = await makeImage({ one: senderID, two: targetID });

    api.sendMessage(
      {
        body: "Aww 🫂 Here's your hug 💞",
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      () => fs.unlinkSync(imagePath),
      messageID
    );
  } catch (err) {
    console.error("❌ Hug command error:", err);
    api.sendMessage("Something went wrong 😓", threadID, messageID);
  }
};







