module.exports.config = {
	name: "join",
	eventType: ["log:subscribe"],
	version: "1.0.1",
	credits: "IMRAN",
	description: "Bot and user welcome message system",
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, Threads }) {
	const { threadID } = event;
	const data = (await Threads.getData(threadID)).data || {};
	const checkban = data.banOut;
	const axios = require("axios");

	if (Array.isArray(checkban) && checkban.length > 0) return;

	// ➤ Bot Join Welcome
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		const botName = global.config.BOTNAME || "𝐌𝐀𝐇𝐀𝐁𝐔𝐁 𝐁𝐎𝐓";
		const prefix = global.config.PREFIX;
		const BOT_GIF_URL = 'https://raw.githubusercontent.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/refs/heads/main/andarxrr.gif';

		await api.changeNickname(`${botName} ai`, threadID, api.getCurrentUserID());

		const botMessage = `
╔════•|      ✿      |•════╗
 💐আস্সালামু আলাইকুম💐
╚════•|      ✿      |•════╝

🤖 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 ✔️

╭─────────────⭓
│ 🔰 Bot Name : ${botName}
│ 🔑 Prefix   : ${prefix}
╰─────────────⭓

📖 কমান্ড জানতে লিখুন:
➡️ ${prefix}help

🗣️ আমাকে প্রশ্ন করুন:
➡️ ${botName} (প্রশ্ন)

💬 টক করতে চান?
➡️ Bot (আপনার কথা)

🌸 ধন্যবাদ ${botName} ব্যবহারের জন্য 🌸

╔╦══•  •✠•❀•✠•  •══╦╗
♥ 𝐁𝐎𝐓'𝐬 𝐎𝐖𝐍𝐄𝐑 ♥
				♕ 𝐌𝐚𝐡𝐚𝐛𝐮𝐛 𝐑𝐚𝐡𝐦𝐚𝐧 ♕
╚╩══•  •✠•❀•✠•  •══╩╝
		`;

		try {
			const gif = await axios.get(BOT_GIF_URL, { responseType: 'stream' });
			await api.sendMessage({ body: botMessage, attachment: gif.data }, threadID);
		} catch (err) {
			console.log("❌ Error sending bot welcome:", err);
		}
	}

	// ➤ User Join Welcome
	else {
		try {
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);
			const threadData = global.data.threadData.get(parseInt(threadID)) || {};
			const mentions = [];
			const nameArray = [];

			for (const user of event.logMessageData.addedParticipants) {
				const userName = user.fullName;
				const userID = user.userFbId;
				nameArray.push(userName);
				mentions.push({ tag: userName, id: userID });
			}

			let msg = threadData.customJoin || 
`╔════•|      ✿      |•════╗
 💐আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ💐
╚════•|      ✿      |•════╝

		✨🆆🅴🅻🅻 🅲🅾🅼🅴✨

								 ❥𝐍𝐄𝐖~

				~🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌~

						 [   {name} ]

༄✺আ্ঁপ্ঁনা্ঁকে্ঁ আ্ঁমা্ঁদে্ঁর্ঁ✺࿐

{threadName}

 🥰🖤🌸—এ্ঁর্ঁ প্ঁক্ষ্ঁ🍀থে্ঁকে্ঁ🍀—🌸🥀

				 🥀_ভা্ঁলো্ঁবা্ঁসা্ঁ_অ্ঁভি্ঁরা্ঁম্ঁ_🥀

༄✺আঁপঁনিঁ এঁইঁ গ্রুঁপেঁর {soThanhVien} নঁং মে্ঁম্বা্ঁরঁ ࿐

╔╦══•  •✠•❀•✠•  •══╦╗
♥  𝐁𝐎𝐓'𝐬 𝐎𝐖𝐍𝐄𝐑 ♥
				♥ 𝐌𝐚𝐡𝐚𝐛𝐮𝐛 𝐑𝐚𝐡𝐦𝐚𝐧 ♥
╚╩══•  •✠•❀•✠•  •══╩╝`;

			msg = msg
				.replace(/\{name}/g, nameArray.join(', '))
				.replace(/\{type}/g, nameArray.length > 1 ? 'friends' : 'you')
				.replace(/\{soThanhVien}/g, participantIDs.length)
				.replace(/\{threadName}/g, threadName);

			const USER_GIF_URL = 'https://raw.githubusercontent.com/MR-IMRAN-60/JSON-STORE/refs/heads/main/Joinim.gif';
			const gifResponse = await axios.get(USER_GIF_URL, { responseType: 'stream' });

			await api.sendMessage({
				body: msg,
				mentions,
				attachment: gifResponse.data
			}, threadID);
		} catch (e) {
			console.log("❌ Error in user welcome:", e);
		}
	}
};
