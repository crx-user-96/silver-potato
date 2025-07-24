// Copyright Faris Ali 2024-2025. All Rights Reserved
// Modified by Mohammad Imran | Contact: www.facebook.com/Imran.Ahmed099

const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

class Photo360 {
  constructor(url = "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html") {
    if (!url.includes("photo360.com")) {
      throw new Error("Invalid URL: Must be a photo360.com URL");
    }
    this.effectPageUrl = url;
    this.inputText = "imran";
    this.formData = null;
  }

  setName(name) {
    this.inputText = name;
  }

  async execute() {
    try {
      const getPage = await axios.get(this.effectPageUrl, {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          Origin: new URL(this.effectPageUrl).origin,
          Referer: this.effectPageUrl,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });

      const $ = cheerio.load(getPage.data);

      const buildServer = $("#build_server").val();
      const buildServerId = $("#build_server_id").val();
      const token = $("#token").val();
      const submit = $("#submit").val();
      const radios = [];

      $("input[name='radio0[radio]']").each((_, el) => {
        radios.push($(el).attr("value"));
      });

      this.formData = this.prepareFormData(buildServer, buildServerId, token, submit, radios);

      const uploadForm = new FormData();
      this.appendTextToForm(uploadForm);

      const postPage = await axios.post(this.effectPageUrl, uploadForm, {
        headers: {
          ...uploadForm.getHeaders(),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          Origin: new URL(this.effectPageUrl).origin,
          Referer: this.effectPageUrl,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          Cookie: getPage.headers["set-cookie"]?.join("; ") || "",
        },
      });

      const formValue = this.extractGeneratedFormValue(postPage);
      const createImage = await axios.post(
        `${new URL(this.effectPageUrl).origin}/effect/create-image`,
        JSON.parse(formValue),
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Origin: new URL(this.effectPageUrl).origin,
            Referer: this.effectPageUrl,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            Cookie: getPage.headers["set-cookie"]?.join("; ") || "",
          },
        }
      );

      return {
        status: createImage.data?.success,
        imageUrl: buildServer + (createImage.data?.fullsize_image || createImage.data?.image || ""),
        sessionId: createImage.data?.session_id,
        author: "IMRAN AHMED",
        contact: "www.facebook.com/Imran.Ahmed099"
      };
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unexpected token")) {
        throw new Error("Please try using a URL that requires only one input field.");
      }
      console.error("Error:", err);
      throw err;
    }
  }

  prepareFormData(server, serverId, token, submit, radios) {
    const form = {
      submit: submit,
      token: token,
      build_server: server,
      build_server_id: Number(serverId),
    };
    if (radios.length > 0) {
      form["radio0[radio]"] = radios[Math.floor(Math.random() * radios.length)];
    }
    return form;
  }

  appendTextToForm(form) {
    for (const key in this.formData) {
      form.append(key, this.formData[key]);
    }
    const texts = Array.isArray(this.inputText) ? this.inputText : [this.inputText];
    texts.forEach(text => form.append("text[]", text));
  }

  extractGeneratedFormValue(response) {
    const $ = cheerio.load(response.data);
    return (
      $("#form_value").first().text() ||
      $("#form_value_input").first().text() ||
      $("#form_value").first().val() ||
      $("#form_value_input").first().val()
    );
  }
}

module.exports = Photo360;
