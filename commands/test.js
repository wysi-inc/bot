import command from "../helpers/command.js"
export default {
    data: command("test", "Test if the bot is running"),
    async execute(interaction){
        //balls
        return interaction.reply({content: "heloo wowo"})
    }
}