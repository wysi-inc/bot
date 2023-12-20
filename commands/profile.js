import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getDiscordLinked, getUserEmbed } from "../helpers/functions.js";
import errors from "../helpers/errors.js"

export default {
    data: command("profile", "Your osu!profile").addStringOption((option) =>
        option.setName("username").setDescription("your osu!username")
    ),
    async execute(interaction) {
        try {
            let username = interaction.options.getString("username");
            if (!username) {
                const { found, osu_id } = await getDiscordLinked(interaction.user.id);
                if (!found) return interaction.reply({ content: errors.NOT_LINKED });
                username = osu_id;
            }
            const user = await v2.user.details(username);
            if (user.error === null) return interaction.reply({ content: errors.USER_NOT_FOUND });
            return interaction.reply({ embeds: [getUserEmbed(user)] });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "There was an error" });
        }
    },
};