import chalk from "chalk";
import webhooks from "./helpers/webhooks.js";
import WebSocket from "ws";
import cfonts from "cfonts";
import functions from "./helpers/functions.js";
import config from "./helpers/config.js";

const guilds = {};
const info = (str) => console.log(`${chalk.hex("#ffffff")("[BILGI]")} ${chalk.hex("#fff")(str)}`);
const error = (str) => console.log(`${chalk.hex(`#f00a0d`)("[HATA]")} ${chalk.hex("#fff")(str)}`);
const statusCodes = {
  400: "url kaçırıldı. / ustaa",
  429: "rate limit. / ustaa",
  403: "yetkisiz. / ustaa",
  401: "yetkisiz. / ustaa",
};

cfonts.say("ustaa", {
  font: "console",
  align: "center",
  colors: ["red", "#ffffff"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "15",
  gradient: true,
  independentGradient: true,
  transitionGradient: true,
});

cfonts.say("Log atıldı / ustaa ", {
  font: "console",
  align: "center",
  colors: ["#ffffff"],
});

const ws = new WebSocket("wss://gateway-us-east1-b.discord.gg");

ws.on("open", () => {
  info("Bot başlatılıyor made by ustaa");

  ws.on("message", async (message) => {
    const { d, op, t } = JSON.parse(message);

    if (t === "GUILD_UPDATE") {
      const getGuild = guilds[d.guild_id];

      if (typeof getGuild === "string" && getGuild !== d.vanity_url_code) {
        functions.snipeVanityUrl(getGuild)
          .then(async () => {
            await webhooks.success(`@everyone **BAŞARILI / ustaa** discord.gg/${getGuild} . url değişti. / ustaa @everyone`);
            delete guilds[d.guild_id];
          })
          .catch(async (err) => {
            await webhooks.error(
              `@everyone **HATA / ustaa** discord.gg/${getGuild} . durum kodu: ${err} (\`${statusCodes[err]}.\`)`
            );
            await functions.leaveGuild(d.guild_id);
            delete guilds[d.guild_id];
            functions.joinGuild(getGuild)
              .then(async ({ guild_id }) => {
                await webhooks.info(
                  `${getGuild} urlsi kaçırıldığı için, otomatik olarak eski sunucudan çıkıldı ve yeni sunucuya girildi. / ustaa`
                );
                guilds[guild_id] = getGuild;
              })
              .catch(async (err) => {
                await webhooks.info(
                  `${getGuild} urlsi kaçırıldı. eski sunucudan çıkıldı ama yeni sunucuya girilemedi / ustaa. durum kodu: ${err}. (\`${statusCodes[err]}.\`)`
                );
              });
          });
      }
    } else if (t === "GUILD_DELETE") {
      const getGuild = guilds[d.id];

      if (getGuild) {
        functions.snipeVanityUrl(getGuild)
          .then(async () => {
            await webhooks.success(`@everyone **BAŞARILI / ustaa** discord.gg/${getGuild} . sunucu silindi/banlandı/kicklendim / ustaa.`);
            delete guilds[d.id];
          })
          .catch(async (err) => {
            await webhooks.error(
              `@everyone **HATA / ustaa** discord.gg/${getGuild} . durum kodu: ${err} (\`${statusCodes[err]}.\`). sunucu silindi/banlandı/kicklendim / ustaa.`
            );
            functions.joinGuild(getGuild)
              .then(async ({ guild_id }) => {
                await webhooks.info(`${getGuild} urlsi kaçırıldı, yeni sunucuya girildi / ustaa.`);
                guilds[guild_id] = getGuild;
              })
              .catch(async (err) => {
                await webhooks.info(
                  `${getGuild} urlsi kaçırıldı / ustaa. yeni sunucuya girilemedi / ustaa. durum kodu: ${err}. (\`${statusCodes[err]}.\`)`
                );
              });
          });
      }
    } else if (t === "READY") {
      info("Sniper Aktif / ustaa");

      d.guilds
        .filter((e) => e.vanity_url_code)
        .forEach((guild) => (guilds[guild.id] = guild.vanity_url_code));

      await webhooks.info(
        ` ustaa sniper Aktif. Urller:\n${d.guilds.filter((e) => e.vanity_url_code).map((guild) => guild.vanity_url_code).join(", ")}`
      );
    }

    if (op === 10) {
      ws.send(
        JSON.stringify({
          op: 2,
          d: {
            token: config.listenerToken,
            intents: 1,
            properties: {
              os: "linux",
              browser: "firefox",
              device: "firefox",
            },
          },
        })
      );

      setInterval(() => ws.send(JSON.stringify({ op: 1, d: {}, s: null, t: "heartbeat" })), d.heartbeat_interval);
    } else if (op === 7) {
      info("tekrar basliyom / ustaa.");
      process.exit();
    }
  });

  ws.on("close", (code) => {
    if (code === 4004) {
      error("sniper tokeni yanlis amk degis sunu  / ustaa");
    }
    process.exit();
  });
});
