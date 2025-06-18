import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const commands: any[] = [];
const commandsPath = path.join(__dirname, "commands");
// Directory where commands are stored
function loadCommands(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadCommands(fullPath); // 📁 recurse into subdirectory
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      const command = require(fullPath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.warn(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute".`);
      }
    }
  }
}

loadCommands(commandsPath); 

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!, // Bot Client ID
        process.env.GUILD_ID!   // Server ID
      ),
      { body: commands }
    );

    console.log(`✅ Successfully reloaded ${commands.length} commands.`);
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
