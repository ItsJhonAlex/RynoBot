import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { GuildConfig } from '../../database/models/index.js';
import logger from '../../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../../');

export default {
    name: 'guildMemberAdd',
    once: false,

    async execute(member) {
        try {
            // Obtener configuración del servidor
            const guildConfig = await GuildConfig.findOne({
                where: { guildId: member.guild.id }
            });

            // Verificar si el sistema está habilitado y configurado
            if (!guildConfig || !guildConfig.welcomeEnabled || !guildConfig.welcomeChannelId) {
                return;
            }

            const channel = member.guild.channels.cache.get(guildConfig.welcomeChannelId);
            if (!channel) {
                logger.warn(`Canal de bienvenida no encontrado: ${guildConfig.welcomeChannelId}`);
                return;
            }

            // Crear el embed de bienvenida
            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x54C95A)
                .setTitle('🎉 ¡Bienvenido!')
                .setDescription(
                    guildConfig.welcomeMessage || 
                    `🌟 **${member.user.username}** ha entrado al servidor\n\n` +
                    `Bienvenido a **${member.guild.name}**!\n` +
                    `> *"La aventura comienza cuando decides dar el primer paso..."*`
                )
                .setThumbnail('attachment://slime.png')
                .setImage('attachment://world.gif')
                .addFields(
                    {
                        name: '📜 Primeros pasos',
                        value: '\n1. Dale un vistazo a las reglas en <#1234642350588956722>\n2. Elige tu roles en <#1316624256053805137>\n3. Preséntate en <#1234641998925795418>\n',
                        inline: false
                    }
                )
                .setFooter({ 
                    text: '¡Esperamos que disfrutes tu estancia!',
                    iconURL: member.client.user.displayAvatarURL()
                })
                .setTimestamp();

            // Crear los attachments
            const attachments = [
                new AttachmentBuilder(path.join(basePath, 'assets/slime.png')),
                new AttachmentBuilder(path.join(basePath, 'assets/world.gif'))
            ];

            await channel.send({
                content: `¡**${member}** ha entrado al servidor! 🎮`,
                embeds: [welcomeEmbed],
                files: attachments
            });

            logger.info(`Mensaje de bienvenida enviado a ${member.user.tag}`);
        } catch (error) {
            logger.error(`Error al enviar mensaje de bienvenida: ${error.message}`);
        }
    }
}; 