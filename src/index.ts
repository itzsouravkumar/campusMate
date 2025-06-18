import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ModalSubmitInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

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

// Load Commands
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

// Ready Event
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

// Interaction Handler
client.on(Events.InteractionCreate, async interaction => {
  // Slash Command
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (err) {
      console.error("❌ Command Error:", err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ Error executing command.",
          ephemeral: true,
        });
      }
    }
  }

  // Modal Submit
  if (interaction.isModalSubmit()) {
    const [formType, eventId] = interaction.customId.split(":");

    if (formType === "create-event-form") {
      const name = interaction.fields.getTextInputValue("eventName");
      const date = interaction.fields.getTextInputValue("eventDate");
      const description = interaction.fields.getTextInputValue("eventDescription");
      const time = interaction.fields.getTextInputValue("eventTime");
      const location = interaction.fields.getTextInputValue("eventLocation");

      const id = uuidv4();
      const { error } = await supabase.from("events").insert([{
        id, name, date, description, time, location
      }]);
``
      if (error) {
        await interaction.reply({
          content: `❌ Failed to create event: ${error.message}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `✅ Event **${name}** created!\n🆔 ID: \`${id}\``,
          ephemeral: true,
        });
      }
    }

    // Edit Event
    if (formType === "edit-event-form") {
      const name = interaction.fields.getTextInputValue("eventName");
      const date = interaction.fields.getTextInputValue("eventDate");
      const description = interaction.fields.getTextInputValue("eventDescription");
      const time = interaction.fields.getTextInputValue("eventTime");
      const location = interaction.fields.getTextInputValue("eventLocation");

      const { error } = await supabase
        .from("events")
        .update({ name, date, description, time, location })
        .eq("id", eventId);

      if (error) {
        await interaction.reply({
          content: `❌ Failed to update event: ${error.message}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `✏️ Event updated successfully!`,
          ephemeral: true,
        });
      }
    }
    // Delete Event
    if (formType === "delete-event-form") {
      const confirmInput = interaction.fields.getTextInputValue("confirmInput");

      const { data: event, error: fetchError } = await supabase
        .from("events")
        .select("name")
        .eq("id", eventId)
        .single();

      if (fetchError || !event) {
        return await interaction.reply({
          content: `❌ Event not found for ID: ${eventId}`,
          ephemeral: true,
        });
      }

      if (confirmInput !== event.name) {
        return await interaction.reply({
          content: `❌ Confirmation failed. Name mismatch.`,
          ephemeral: true,
        });
      }

      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (deleteError) {
        return await interaction.reply({
          content: `❌ Failed to delete event: ${deleteError.message}`,
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: `✅ Event **${event.name}** deleted successfully!`,
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
