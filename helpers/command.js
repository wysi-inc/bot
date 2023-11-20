import { SlashCommandBuilder } from "discord.js";
export default (name, description) => new SlashCommandBuilder().setName(name).setDescription(description)