import {
  SlashCommandBuilder,
  CommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("createevent")
  .setDescription("Create a new event");

export async function execute(interaction: CommandInteraction) {
  const modal = new ModalBuilder()
    .setCustomId("create-event-form")
    .setTitle("Create New Event");

  const nameInput = new TextInputBuilder()
    .setCustomId("eventName")
    .setLabel("Event Name")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const dateInput = new TextInputBuilder()
    .setCustomId("eventDate")
    .setLabel("Event Date")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const descInput = new TextInputBuilder()
    .setCustomId("eventDescription")
    .setLabel("Description")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const timeInput = new TextInputBuilder()
    .setCustomId("eventTime")
    .setLabel("Event Time")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const locationInput = new TextInputBuilder()
    .setCustomId("eventLocation")
    .setLabel("Event Location")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(locationInput)
  );

  await interaction.showModal(modal);
}
