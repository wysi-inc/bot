import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getDiscordLinked, getUserEmbed } from "../helpers/functions.js";
import errors from "../helpers/errors.js";

export default {
    data: command("rs", "Your recent play")
        .addStringOption((option) =>
        option.setName("username").setDescription("your osu!username")
        )
        .addStringOption((option) =>
        option
            .setName("mode")
            .setDescription("specify a gamemode")
            .addChoices(
            { name: "osu", value: "osu" },
            { name: "taiko", value: "taiko" },
            { name: "fruits", value: "fruits" },
            { name: "mania", value: "mania" }
            )
        ),
    async execute(interaction) {
        try {
            let username = interaction.options.getString("username");
            if (!username) {
                const { found, osu_id } = await getDiscordLinked(interaction.user.id);
                if (!found) return interaction.reply({ content: errors.NOT_LINKED });
                username = osu_id;
            }
            let mode = interaction.options.getString("mode") || "osu"
            //!?: wouldn't this cause an error when you type a username instead of an id?
            const score = await v2.scores.user.category(username >> 0, "recent", {
                include_fails: true,
                limit: 1,
                mode,
            });
            console.log(score);
            if (!score || score.error === null) return interaction.reply({ content: errors.USER_NOT_FOUND });
            if (score.length < 1) return interaction.reply({ content: "no recent scores for this user" });
            //TODO: Embed
            return interaction.reply({ content: score[0].beatmapset.title });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "There was an error" });
        }
    },
};