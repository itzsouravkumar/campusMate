import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { supabase } from "../../database/supabaseClient";

export const data = new SlashCommandBuilder()
  .setName("deleteevent")
  .setDescription("Delete an event by ID")
  .addStringOption(option =>
    option
      .setName("id")
      .setDescription("The ID of the event to delete")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    const eventId = interaction.options.getString("id", true);

    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("name")
      .eq("id", eventId)
      .single();

    if (fetchError || !event) {
      return await interaction.editReply({
        content: `❌ No event found with ID: \`${eventId}\``,
      });
    }

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (deleteError) {
      return await interaction.editReply({
        content: `❌ Failed to delete event: ${deleteError.message}`,
      });
    }

    await interaction.editReply({
      content: `✅ Event **${event.name}** deleted successfully!`,
    });
  } catch (err: any) {
    console.error("❌ Unexpected Error:", err.message || err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
    }
  }
}
