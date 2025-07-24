const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "hug",
  version: "3.1.1",
  permssion: 0,
  prefix: true,
  credits: "",
  description: "Send a hug image",
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

module.exports.onLoad = async () => {
  const cachePath = path.join(__dirname, "cache", "canvas");
  const templatePath = path.join(cachePath, "hugv1.png");

  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

  if (!fs.existsSync(templatePath)) {
    await global.utils.downloadFile("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", templatePath);
  }
};

async function circleImage(imgPath) {
  const image = await jimp.read(imgPath);
  image.circle();
  return image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const cachePath = path.join(__dirname, "cache", "img");
  const template = await jimp.read(path.join(cachePath, "hugv1.png"));

  const oneAvatarPath = path.join(cachePath, `avt_${one}.png`);
  const twoAvatarPath = path.join(cachePath, `avt_${two}.png`);
  const finalImgPath = path.join(cachePath, `hug_${one}_${two}.png`);

  const oneAvatar = (
    await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  const twoAvatar = (
    await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;

  fs.writeFileSync(oneAvatarPath, Buffer.from(oneAvatar));
  fs.writeFileSync(twoAvatarPath, Buffer.from(twoAvatar));

  const circleOne = await jimp.read(await circleImage(oneAvatarPath));
  const circleTwo = await jimp.read(await circleImage(twoAvatarPath));

  template
    .composite(circleOne.resize(150, 150), 320, 100)
    .composite(circleTwo.resize(130, 130), 280, 280);

  const finalBuffer = await template.getBufferAsync("image/png");
  fs.writeFileSync(finalImgPath, finalBuffer);

  fs.unlinkSync(oneAvatarPath);
  fs.unlinkSync(twoAvatarPath);

  return finalImgPath;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (!mentionIDs.length) {
    return api.sendMessage("Please mention 1 person to hug 🥰", threadID, messageID);
  }

  const targetID = mentionIDs[0];

  try {
    const imgPath = await makeImage({ one: senderID, two: targetID });
    api.sendMessage(
      {
        body: "Aww 💞 here's your hug!",
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage("Something went wrong. Please try again later.", threadID, messageID);
  }
};
