# 🌟 Photo360 Text Effect Generator 📸
<p align="center">
  <img src="https://i.ibb.co/mVT2RygD/491074945-1014822246886607-5730014235705183322-n-jpg-stp-dst-jpg-s480x480-tt6-nc-cat-106-ccb-1-7-nc.jpg" alt="IMRAN PHOTO API" width="400"/>
</p>

A dynamic Node.js module for generating custom text effects using ePhoto360.com. Crafted with reliability and extensibility in mind.

![License](https://img.shields.io/badge/License-MIT-green.svg) 
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## ✨ Features

- 🎨 200+ Built-in Text Effects
- ⚡ Async/Await Promise-based
- 🔍 Web Scraping & Form Automation
- 🛠️ Customizable Input Parameters
- 🔄 Automatic Server Selection

## 📦 Installation

```bash
npm install abir-photo360-apis
```

## 🚀 Quick Start

```javascript
const Photo360 = require('abir-photo360-apis');

async function createEffect() {
  const generator = new Photo360();
  generator.setName("Imran");
  
  try {
    const result = await generator.execute();
    console.log("Generated Image:", result.imageUrl);
  } catch (error) {
    console.error("Generation Error:", error.message);
  }
}

createEffect();
```

## 📚 API Documentation

### 📋 Constructor

```javascript
new Photo360(url?: string)
```
- `url`: ePhoto360 effect page URL (default: Foggy Glass effect)

### 🔧 Methods

#### `setName(name: string | string[])`
Set text input(s) for the effect

#### `execute(): Promise<ResultObject>`
Processes the effect generation

### 📌 Result Object

```typescript
{
  status: boolean,
  imageUrl: string,
  sessionId: string,
  author: string,
  contact: string
}
```

## 🖼️ Example Output

```json
{
  "status": true,
  "imageUrl": "https://server12.ephoto360.com/output/123456.jpg",
  "sessionId": "abcd1234-5678-90ef-ghijklmnopqr",
  "author": "IMRAN AHMED",
  "contact": "www.facebook.com/Imran.Ahmed099"
}
```

## 🚨 Error Handling

Common Error Types:
1. `Invalid URL Error` - Non-ePhoto360 URLs
2. `Form Parsing Error` - Unexpected page structure
3. `Server Connection Error` - Failed API calls

```javascript
try {
  // Generation code
} catch (error) {
  if (error.message.includes('Unexpected token')) {
    console.error('⚠️ Invalid effect page structure');
  }
  // Add custom error handling
}
```

## 🌐 Supported Effects

| Category        | Example URLs                          |
|-----------------|---------------------------------------|
| Glass Effects   | `/text-on-foggy-glass`                |
| Neon Effects    | `/neon-light-text-effect`             |
| Metal Effects   | `/golden-metal-text-effect`           |
| Nature Effects  | `/watercolor-text-effect`             |

## 📝 Notes

1. Requires Node.js 16+
2. Uses Cheerio for DOM manipulation
3. Auto-handles cookies and sessions
4. Randomizes server selection for reliability

---

**Maintainer:** [Mohammad Imran](www.facebook.com/Imran.Ahmed099)  
**Original Author:** Faris Ali  
**Contribution:** PRs welcome!  
**License:** MIT © 2024-2025
``` 

This design features:
1. Clear visual hierarchy with emoji markers
2. Interactive code samples
3. Responsive badges
4. Error handling guide
5. API documentation table
6. Mobile-friendly layout
7. Quick reference tables
8. Social media integration
9. Version compatibility info
10. Maintainer/contributor section

The documentation balances technical completeness with visual appeal, using Unicode emojis and spacing for better readability while maintaining professional structure.
