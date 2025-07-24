const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "autosend",
  version: "1.6",
  permission: 0,
  credits: "MAHABUB RAHMAN",
  description: "Automatically sends video from API at specified times",
  prefix: false,
  category: "Media",
  usages: "No manual trigger needed",
  cooldowns: 5,
  dependencies: {
    "axios": "^1.0.0",
    "moment-timezone": "^0.5.43"
  }
};

const lastSent = {};

async function sendVideo(api, threadID, timeSlot) {
  try {
    const response = await axios.get("https://mahabub-apis.vercel.app/mahabub");
    const videoUrl = response.data?.data;
    const title = response.data?.title || "🔹 No Title Found";

    if (!videoUrl) {
      return api.sendMessage("❌ No videos found! (Invalid API Response)", threadID);
    }

    const res = await axios.get(videoUrl, { responseType: "stream" });

    api.sendMessage(
      {
        body: `====== 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 ======\n━━━━━━━━━━━━━━━━\n➝ 𝗡𝗼𝘄 𝗜𝘀: ${timeSlot}\n\n💬: ${title}\n━━━━━━━━━━━━━━━━━━\n➝ 𝗧𝗵𝗶𝘀 𝗜𝘀 𝗔𝗻 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰 𝗠𝗲𝘀𝘀𝗮𝗴𝗲`,
        attachment: res.data,
      },
      threadID
    );

    lastSent[threadID] = timeSlot;
  } catch (error) {
    console.error("🚨 API Error:", error);
    api.sendMessage("❌ Failed to fetch video.", threadID);
  }
}

function scheduleVideo(api) {
  const timeSlots = [
    "1:30AM", "2:30AM", "3:30AM", "4:30AM", "5:30AM", "6:30AM",
    "7:30AM", "8:30AM", "9:30AM", "10:30AM", "11:30AM", "12:30PM",
    "1:30PM", "2:30PM", "3:30PM", "4:30PM", "5:30PM", "6:30PM",
    "7:30PM", "8:30PM", "9:30PM", "10:30PM", "11:30PM", "12:30AM",
  ];

  setInterval(async () => {
    const currentTime = moment().tz("Asia/Dhaka").format("h:mmA");

    try {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      for (const thread of threads) {
        if (!thread.isGroup) continue;

        if (timeSlots.includes(currentTime) && lastSent[thread.threadID] !== currentTime) {
          await sendVideo(api, thread.threadID, currentTime);
        }
      }
    } catch (e) {
      console.error("Error fetching thread list:", e);
    }
  }, 30000);
}

module.exports.onLoad = function ({ api }) {
  if (global.autosendInitialized) return;
  global.autosendInitialized = true;

  scheduleVideo(api);
  console.log("✅ Autosend function has been started successfully");
};

module.exports.run = async function({ api, event, args }) {
  return api.sendMessage("This command runs automatically on schedule. No manual usage needed.", event.threadID);
};