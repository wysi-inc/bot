import srv from "../Server.js";
import command from "../helpers/command.js";

export default {
    data: command("unlink", "Unlink your osu account"),
    async execute(interaction) {
        try {
            await srv.mysqldb.query(`DELETE FROM discord_users WHERE discord_id = ${interaction.user.id}`, vals);
            return interaction.reply({ content: "you are now unlinked" });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "There was an error" });
        }
    },
};