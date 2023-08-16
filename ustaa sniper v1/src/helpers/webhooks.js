import config from "./config.js";
const payload = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default {
  info: async (str) =>
    await fetch(config.webhooks.infoUrl, {
      ...payload,
      body: JSON.stringify({ content: str }),
    }),
  success: async (str) =>
    await fetch(config.webhooks.successUrl, {
      ...payload,
      body: JSON.stringify({ content: str }),
    }),
  error: async (str) =>
    await fetch(config.webhooks.errorUrl, {
      ...payload,
      body: JSON.stringify({ content: str }),
    }),
};
