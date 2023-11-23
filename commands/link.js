import srv from "../Server.js";
import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getUserEmbed } from "../helpers/functions.js";

export default {
    data: command("link", "Link your osu account").addStringOption((option) =>
        option
        .setName("username")
        .setDescription("your osu!username")
        .setRequired(true)
    ),
    async execute(interaction) {
        try {
            const username = interaction.options.getString("username");
            const discord_id = interaction.user.id;
            const [result] = await srv.mysqldb.query(`SELECT * FROM discord_users WHERE discord_id = ${discord_id}`);
            console.log(result.length)
            if (result.length > 0) {
                return interaction.reply({content: "you are already linked to an account, use `/unlink` first"})
            }
            const user = await v2.user.details(username);
            await srv.mysqldb.query(`INSERT INTO discord_users SET discord_id = ${discord_id}, osu_id = ${user.id}`);
            return interaction.reply({ content: `linked to ${user.username}`, embeds: [getUserEmbed(user)] });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "There was an error" });
        }
    },
};