import srv from "../Server.js";
import command from "../helpers/command.js";

const name = "unlink";
const desc = "Unlink your osu account";

export default {
  data: command(name, desc),
  async execute(interaction) {
    try {
      const discord_id = interaction.user.id;
      let sql = `DELETE FROM discord_users WHERE discord_id = ?`;
      let vals = [discord_id];
      await srv.mysqldb.query(sql, vals);
      const content = "you are now unlinked"
      return interaction.reply({ content });
    } catch (err) {
      console.error(err);
      const content = "There was an error";
      return interaction.reply({ content });
    }
  },
};
