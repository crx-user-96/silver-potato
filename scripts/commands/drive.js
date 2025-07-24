const axios = require("axios");

module.exports.config = {
  name: "drive",
  version: "1.0.7",
  permission: 0,
  credits: "IMRAN",
  description: "Generate direct download link from media (Drive-hosted)",
  prefix: true,
  premium: false,
  category: "utility",
  usages: "Reply ${global.config.PREFIX}driveto any video/image",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const replied = event.messageReply;

  if (!replied || !replied.attachments || replied.attachments.length === 0) {
    return api.sendMessage("𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝗮𝘆 𝘁𝗼 𝗮𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 𝗼𝗿 𝗶𝗺𝗮𝗴𝗲.", event.threadID, event.messageID);
  }

  const fileUrl = replied.attachments[0].url;

  const apiURL = `https://imran-x-mahabub-drive-upload-api-s.vercel.app/api/upload?url=${encodeURIComponent(fileUrl)}`;

  try {
    const res = await axios.get(apiURL);
    const data = res.data;

    if (!data.success || !data.directLink) {
      return api.sendMessage("✖ Unable to progress your request", event.threadID);
    }

    return api.sendMessage(`🔗 𝗗𝗶𝗿𝗲𝗰𝘁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗟𝗶𝗻𝗸:\n${data.directLink}`, event.threadID, event.messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("✖ Error while contacting the API.", event.threadID);
  }
};
