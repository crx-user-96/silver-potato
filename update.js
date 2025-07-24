const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const updaterConfigUrl = "https://raw.githubusercontent.com/MR-MAHABUB-004/IMRAN-BOTV4/main/updater.json"; // এখানে তোমার updater.json GitHub লিংক দিবে
const versionPath = path.resolve(__dirname, "package.json");

(async () => {
    try {
        console.log(chalk.blue("🔄 আপডেট খোঁজা হচ্ছে..."));

        const { data: updateConfig } = await axios.get(updaterConfigUrl);
        const currentVersion = require(versionPath).version;

        if (currentVersion === updateConfig.version) {
            console.log(chalk.green("✅ তুমি লেটেস্ট ভার্সনে আছো।"));
            return;
        }

        console.log(chalk.yellow(`🚀 নতুন ভার্সন পাওয়া গেছে: ${updateConfig.version}`));

        // Update Files
        for (const file of updateConfig.files) {
            const localPath = path.resolve(__dirname, file);
            const remoteFileUrl = `https://raw.githubusercontent.com//MR-MAHABUB-004/IMRAN-BOTV4/main/${file}`;

            try {
                const { data: fileData } = await axios.get(remoteFileUrl);

                fs.mkdirpSync(path.dirname(localPath));
                fs.writeFileSync(localPath, fileData);
                console.log(chalk.green(`[UPDATED] ${file}`));
            } catch (err) {
                console.error(chalk.red(`[ERROR] ফাইল ডাউনলোড করতে সমস্যা: ${file}`));
            }
        }

        // Update package.json Version
        const packageData = require(versionPath);
        packageData.version = updateConfig.version;
        fs.writeFileSync(versionPath, JSON.stringify(packageData, null, 2));
        console.log(chalk.cyan(`✅ ভার্সন আপডেট করা হয়েছে: ${updateConfig.version}`));

        if (updateConfig.reinstallDependencies) {
            console.log(chalk.blue("📦 প্যাকেজ ইনস্টল করা হচ্ছে..."));
            require("child_process").execSync("npm install", { stdio: "inherit" });
            console.log(chalk.green("✅ প্যাকেজ ইনস্টল সম্পন্ন ✅"));
        }

        console.log(chalk.green("✅ আপডেট সম্পূর্ণ। বট পুনরায় চালু করুন।"));

    } catch (err) {
        console.error(chalk.red("❌ আপডেট চেক করতে সমস্যা হয়েছে: "), err.message);
    }
})();
