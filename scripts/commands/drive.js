const axios = require("axios");

module.exports.config = {
  name: "drive",
  version: "1.0.7",
  permission: 0,
  credits: "Mahabub",
  description: "Generate direct download link from replied media (Drive-hosted)",
  prefix: true,
  premium: false,
  category: "utility",
  usages: "Reply to any Google Drive video/image",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const replied = event.messageReply;

  if (!replied || !replied.attachments || replied.attachments.length === 0) {
    return api.sendMessage("❌ Please reply to a Google Drive video/image or media.", event.threadID, event.messageID);
  }

  const fileUrl = replied.attachments[0].url;

  const apiURL = `https://glowing-octo-computing-machine-seven.vercel.app/api/upload?url=${encodeURIComponent(fileUrl)}`;

  try {
    const res = await axios.get(apiURL);
    const data = res.data;

    if (!data.success || !data.directLink) {
      return api.sendMessage("❌ Failed to get direct download link. The file might not be hosted on Google Drive.", event.threadID);
    }

    return api.sendMessage(`🔗 Direct Download Link:\n${data.directLink}`, event.threadID, event.messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ Error while contacting the API.", event.threadID);
  }
};
