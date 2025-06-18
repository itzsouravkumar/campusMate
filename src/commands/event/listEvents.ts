import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { supabase } from "../../database/supabaseClient";

export const data = new SlashCommandBuilder()
  .setName("listevents")
  .setDescription("List all events with their unique IDs");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error || !events || events.length === 0) {
    return await interaction.editReply({
      content: "❌ No events found or failed to fetch.",
    });
  }

  let response = `📋 **Event List** (${events.length} total):\n\n`;
  for (const event of events) {
    response += `🔹 **${event.name}** (${event.date} at ${event.time})\n📍 *${event.location}*\n🆔 \`${event.id}\`\n\n`;
  }

  await interaction.editReply({ content: response });
}
