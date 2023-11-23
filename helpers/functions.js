import srv from "../Server.js";
import { countryCodeEmoji } from "country-code-emoji";
import QuickChart from "quickchart-js";

export function secondsToTime(seconds) {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);
  let dDisplay = d > 0 ? d + "d " : "";
  let hDisplay = h > 0 ? h + "h " : "";
  let mDisplay = m > 0 ? m + "m " : "";
  let sDisplay = s > 0 ? s + "s" : "0s";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

export async function getDiscordLinked(discord_id) {
  const [result] = await srv.mysqldb.query(`SELECT * FROM discord_users WHERE discord_id = ${discord_id}`);
  return { found: result.length > 0, osu_id: result[0]?.osu_id || null}
}

export function getUserEmbed(user) {
  const config = {
    type: "line",
    data: {
      labels: user.rank_history.data.map(() => ""),
      datasets: [
        {
          label: "",
          data: user.rank_history.data.map((d) => d),
          fill: false,
          borderColor: "rgb(255, 204, 34)",
          tension: 0.1,
        },
      ],
    },
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          grace: "10%",
          reverse: true,
        },
      },
      legend: {
        display: false,
      },
    },
  };
  const chart = new QuickChart();
  chart
    .setConfig(config)
    .setWidth(400)
    .setHeight(150)
    .setBackgroundColor("#00000000");
  return {
    color: 0x555a74,
    title: user.username,
    url: `https://wysi727.com/users/${user.id}`,
    thumbnail: {
      url: user.avatar_url,
    },
    image: {
      url: chart.getUrl(),
    },
    fields: [
      {
        name: "",
        value: `🌐⠀**Global Rank:** #${user.statistics.global_rank.toLocaleString()}`,
      },
      {
        name: "",
        value: `${countryCodeEmoji(
          user.country_code
        )}⠀**Country Rank:** #${user.statistics.country_rank.toLocaleString()}`,
      },
      {
        name: "",
        value: `**PP:** \`${user.statistics.pp.toLocaleString()}pp\``,
      },
      {
        name: "",
        value: `**Acc:** \`${user.statistics.hit_accuracy.toFixed(2)}%\``,
      },
      {
        name: "",
        value: `**Lvl:** \`${user.statistics.level.current}\``,
      },
      {
        name: "",
        value: `**Play Time:** \`${secondsToTime(user.statistics.play_time)}\``,
      },
      {
        name: "",
        value: `**Play Count:** \`${user.statistics.play_count.toLocaleString()}\``,
      },
      {
        name: "",
        value: `**SS**: \`${(
          user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh
        ).toLocaleString()}\`⠀⠀**S**: \`${(
          user.statistics.grade_counts.s + user.statistics.grade_counts.sh
        ).toLocaleString()}\`⠀⠀**A**: \`${user.statistics.grade_counts.a.toLocaleString()}\``,
      },
    ],
    footer: {
      text: "wysi727.com",
    },
  };
}

export function getScoreEmbed(score) {}
