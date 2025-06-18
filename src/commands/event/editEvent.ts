import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { supabase } from "../../database/supabaseClient";

export const data = new SlashCommandBuilder()
  .setName("editevent")
  .setDescription("Edit an existing event by ID")
  .addStringOption(option =>
    option
      .setName("id")
      .setDescription("The ID of the event to edit")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const eventId = interaction.options.getString("id", true);

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    return interaction.reply({
      content: `❌ Event not found for ID: \`${eventId}\``,
      ephemeral: true,
    });
  }

  const modal = new ModalBuilder()
    .setCustomId(`edit-event-form:${eventId}`)
    .setTitle("Edit Event");

  const nameInput = new TextInputBuilder()
    .setCustomId("eventName")
    .setLabel("Event Name")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(event.name || "");

  const dateInput = new TextInputBuilder()
    .setCustomId("eventDate")
    .setLabel("Event Date")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(event.date || "");

  const descInput = new TextInputBuilder()
    .setCustomId("eventDescription")
    .setLabel("Description")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setValue(event.description || "");

  const timeInput = new TextInputBuilder()
    .setCustomId("eventTime")
    .setLabel("Event Time")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(event.time || "");

  const locationInput = new TextInputBuilder()
    .setCustomId("eventLocation")
    .setLabel("Event Location")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue(event.location || "");

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(locationInput)
  );

  await interaction.showModal(modal);
}
