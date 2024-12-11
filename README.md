# Bot de Discord - Nombre del Bot

## 📋 Requisitos del Sistema
- Node.js v16.9.0 o superior
- Discord.js v14.0.0 o superior
- Una cuenta de desarrollador de Discord
- Token de bot de Discord
- Acceso a la API de YouTube/Twitch (para notificaciones)

## ⚙️ Características Principales

### 1. Sistema de Bienvenida
- Mensajes personalizables de bienvenida
- Capacidad de enviar mensajes en canal específico
- Opción de incluir imagen/banner personalizado
- Menciones automáticas al nuevo miembro

### 2. Sistema de Auto-roles
- Asignación automática de roles al unirse
- Roles por reacción a mensajes
- Múltiples roles configurables
- Sistema de verificación opcional

### 3. Comandos de Información del Servidor
- Comando para mostrar IP del servidor
- Información de usuarios conectados
- Estadísticas del servidor
- Estado actual del servidor

### 4. Notificaciones de Streaming
- Integración con YouTube
  - Notificaciones cuando inicia stream
  - Enlace directo al canal
- Integración con Twitch
  - Alertas de directos
  - Información del título y categoría
  - Menciones configurables

### 5. Sistema de Respuestas Automáticas
- Comandos personalizables
- Respuestas con texto/imágenes
- Triggers personalizados
- Sistema de cooldown configurable

### 6. Sistema de Tickets
- Creación de tickets mediante reacción
- Categorías de tickets configurables
- Sistema de prioridades
- Transcripción de tickets
- Cierre automático por inactividad

## 🛠️ Configuración
1. Clonar el repositorio
2. Instalar dependencias
3. Configurar archivo `.env`
4. Configurar `config.json`
5. Iniciar el bot

## 📄 Comandos Principales
- `/welcome` - Configura el sistema de bienvenida
- `/autorole` - Gestiona los roles automáticos
- `/serverinfo` - Muestra información del servidor
- `/ticket` - Crea un nuevo ticket
- `/stream-notify` - Configura notificaciones de streams

## 🔧 Variables de Entorno
```env
TOKEN=tu_token_aqui
YOUTUBE_API_KEY=tu_api_key
TWITCH_CLIENT_ID=tu_client_id
```

## 📚 Documentación Adicional
[Enlace a la documentación completa]

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor, lee el archivo CONTRIBUTING.md

## 📝 Licencia
Este proyecto está bajo la Licencia MIT
