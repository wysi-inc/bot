import fs from "fs";
import { config } from "dotenv";
import {
    REST,
    Routes,
    Client,
    GatewayIntentBits,
    Collection,
    Events,
} from "discord.js";

config();

const client_id = process.env.DISCORD_CLIENT_ID;
const client_token = process.env.DISCORD_CLIENT_TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
const commands = [];
client.commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = (await import("./commands/" + file)).default;
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
        );
    }
}

const rest = new REST().setToken(client_token);

try {
    console.log(
        `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
        Routes.applicationGuildCommands(client_id, "1164830158373523476"),
        {
            body: commands,
        }
    );
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.error(error);
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        interaction.replied || interaction.deferred
            ? await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            })
            : await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
    }
});

client.login(client_token);