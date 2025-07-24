const axios = require("axios");

module.exports.config = {
  name: "love",
  version: "1.0.4",
  permission: 0,
  credits: "IMRAN",
  description: "Create a love image using love1 to love11 APIs (streamed)",
  prefix: true,
  category: "image",
  usages: "love [1-11] [@mention/reply]",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async ({ api, event, args }) => {
  try {
    let uid1, uid2;

    // Get UID from reply or mention
    if (event.type === "message_reply") {
      uid1 = event.senderID;
      uid2 = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid1 = event.senderID;
      uid2 = Object.keys(event.mentions)[0];
    } else {
      return api.sendMessage("❌ Please mention or reply to someone to generate a love image.", event.threadID, event.messageID);
    }

    // Check if valid version is provided
    const validVersions = Array.from({ length: 11 }, (_, i) => (i + 1).toString());
    let version = validVersions.includes(args[0]) ? args[0] : (Math.floor(Math.random() * 11) + 1);

    // API URL
    const url = `https://love-api-imran.onrender.com/love${version}?uid1=${uid1}&uid2=${uid2}`;

    // Stream image directly
    const res = await axios.get(url, { responseType: "stream" });

    return api.sendMessage({
      body: `❤️ Here's your love image! (love${version})`,
      attachment: res.data
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Could not generate the image. Try again later.", event.threadID, event.messageID);
  }
};
