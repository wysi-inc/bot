import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getDiscordLinked, getUserEmbed } from "../helpers/functions.js";

const name = "rs";
const desc = "Your recent play";
const not_linked =
  "you are not linked to an account, either use `/link` or specify the username";
const user_not_found = "there is no user with this username";

export default {
  data: command(name, desc)
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
      let username_option = interaction.options.getString("username");
      if (!username_option) {
        const discord_id = interaction.user.id;
        const { found, osu_id } = await getDiscordLinked(discord_id);
        if (!found) interaction.reply({ content: not_linked });
        username_option = osu_id;
      }
      let mode = interaction.options.getString("mode");
      const score = await v2.scores.user.category(parseInt(username_option), "recent", {
        include_fails: true,
        limit: 1,
        mode,
      });
      console.log(score);
      if (!score || score.error === null) return interaction.reply({ content: user_not_found });
      if (score.length < 1) return interaction.reply({conent: "no recent scores for this user"});
      return interaction.reply({ content: score[0].beatmapset.title });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "There was an error" });
    }
  },
};
