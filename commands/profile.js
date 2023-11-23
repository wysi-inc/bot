import command from "../helpers/command.js";
import { v2 } from "osu-api-extended";
import { getDiscordLinked, getUserEmbed } from "../helpers/functions.js";

const name = "profile";
const desc = "Your osu!profile";
const not_linked =
  "you are not linked to an account, either use `/link` or specify the username";
const user_not_found = "there is no user with this username";

export default {
  data: command(name, desc).addStringOption((option) =>
    option.setName("username").setDescription("your osu!username")
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
      const user = await v2.user.details(username_option);
      if (user.error === null)
        return interaction.reply({ content: user_not_found });
      const embeds = [getUserEmbed(user)];
      return interaction.reply({ embeds });
    } catch (err) {
      console.error(err);
      const content = "There was an error";
      return interaction.reply({ content });
    }
  },
};
