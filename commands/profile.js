import srv from "../Server.js";
import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getUserEmbed } from "../helpers/functions.js";

const name = "profile";
const desc = "Your osu!profile";
const wrong = "you are not linked to an account, either use `/link` or specify the username";

export default {
  data: command(name, desc).addStringOption((option) =>
    option
      .setName("username")
      .setDescription("your osu!username")
  ),
  async execute(interaction) {
    try {
      let username_option = interaction.options.getString("username");
      if (!username_option) {
        const discord_id = interaction.user.id;
        let sql = `SELECT * FROM discord_users WHERE discord_id = ?`;
        let vals = [discord_id];
        const [result] = await srv.mysqldb.query(sql, vals);
        if (result.length < 1) {
          return interaction.reply({content: wrong})
        }
        username_option = result[0].osu_id;
      }
      const user = await v2.user.details(username_option);
      const embeds = [
        getUserEmbed(user)
      ];
      return interaction.reply({ embeds });
    } catch (err) {
      console.error(err);
      const content = "There was an error";
      return interaction.reply({ content });
    }
  },
};
