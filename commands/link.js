import srv from "../Server.js";
import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getUserEmbed } from "../helpers/functions.js";

const name = "link";
const desc = "Link your osu account";

export default {
  data: command(name, desc).addStringOption((option) =>
    option
      .setName("username")
      .setDescription("your osu!username")
      .setRequired(true)
  ),
  async execute(interaction) {
    try {
      const username_option = interaction.options.getString("username");
      const discord_id = interaction.user.id;
      let sql = `SELECT * FROM discord_users WHERE discord_id = ?`;
      let vals = [discord_id];
      const [result] = await srv.mysqldb.query(sql, vals);
      console.log(result.length)
      if (result.length > 0) {
        return interaction.reply({content: "you are already linked to an account, use `/unlink` first"})
      }
      const user = await v2.user.details(username_option);
      const osu_id = user.id;
      sql = `INSERT INTO discord_users SET discord_id=?, osu_id=?`;
      vals = [discord_id, osu_id];
      await srv.mysqldb.query(sql, vals);
      const content = `linked to ${user.username}`;
      const embeds = [
        getUserEmbed(user)
      ];
      return interaction.reply({ content, embeds });
    } catch (err) {
      console.error(err);
      const content = "There was an error";
      return interaction.reply({ content });
    }
  },
};
