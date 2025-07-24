const axios = require('axios');
const logger = require('../../catalogs/MAHABUBC.js');

async function showNotification() {
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/refs/heads/main/notification.txt'
    );
    const message = response.data;

    console.log('\x1b[36m%s\x1b[0m', '\n⏩ OWNER INFO:');
    console.log('\x1b[32m%s\x1b[0m', message); // Green colored

    // Replace logger.log with console.log or proper logger method
    console.log('-----------------✓');

  } catch (error) {
    console.error('❌ Failed to fetch notification message:', error.message);
  }
}

module.exports = async () => {
  await showNotification();
};
