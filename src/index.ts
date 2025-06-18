import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Collection,
  Events,
  GatewayIntentBits} from "discord.js";

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

// Supabase Init
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Extended Client
class ExtendedClient extends Client {
  commands: Collection<string, any>;
  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }
}

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands 
const loadCommands = (dir: string) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) loadCommands(fullPath);
    else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      const command = require(fullPath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      } else {
        console.warn(`⚠️ Invalid command: ${fullPath}`);
      }
    }
  }
};

loadCommands(path.join(__dirname, "commands"));

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  // 🔻 Handle Modals
  if (interaction.isModalSubmit()) {
    const [formType, eventId] = interaction.customId.split(":");

    const eventName = interaction.fields.getTextInputValue("eventName") || "";
    const eventDate = interaction.fields.getTextInputValue("eventDate") || "";
    const eventDescription = interaction.fields.getTextInputValue("eventDescription") || "";
    const eventTime = interaction.fields.getTextInputValue("eventTime") || "";
    const eventLocation = interaction.fields.getTextInputValue("eventLocation") || "";

    try {
      // Create Event
      if (formType === "create-event-form") {
        const id = uuidv4();

        const { error } = await supabase.from("events").insert([{
          id,
          name: eventName,
          date: eventDate,
          description: eventDescription,
          time: eventTime,
          location: eventLocation,
        }]);

        if (error) throw new Error(error.message);

        await interaction.reply({
          content: `✅ Event **${eventName}** created!\n🆔 ID: ${id}`,
          flags: 64, // ephemeral
        });
      }

      

  // Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error("❌ Command Error:", err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ Error executing command.",
          flags: 64,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
