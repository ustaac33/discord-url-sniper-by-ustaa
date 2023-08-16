import config from "./config.js";

export default {
  snipeVanityUrl: async (vanity_url) => {
    return new Promise(async (resolve, reject) => {
      const send = await fetch(
        `https://discord.com/api/v10/guilds/${config.sniperGuild}/vanity-url`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.sniperToken,
          },
          body: JSON.stringify({ code: vanity_url }),
        }
      );
      if (!send.ok) return reject(send.status);
      else return resolve(true);
    });
  },
  leaveGuild: async (guild_id) => {
    return new Promise(async (resolve, reject) => {
      const send = await fetch(
        `https://discord.com/api/v10/users/@me/guilds/${guild_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.sniperToken,
          },
          body: JSON.stringify({ lurking: false }),
        }
      );
      if (!send.ok) return reject(send.status);
      else return resolve(true);
    });
  },
  joinGuild: async (vanity_url) => {
    return new Promise(async (resolve, reject) => {
      const send = await fetch(
        `https://discord.com/api/v10/invites/${vanity_url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.sniperToken,
          },
        }
      );
      const body = await send.json();
      if (!send.ok) return reject(send.status);
      else return resolve({ guild_id: body.guild_id });
    });
  },
};
