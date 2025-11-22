const socketIO = require('socket.io');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application gets started.
   */
  register({ strapi }) {
    // Registrar Socket.io
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Configurar Socket.io
    const io = socketIO(strapi.server.httpServer, {
      cors: {
        origin: 'http://localhost:5174', // URL de tu frontend
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Guardar la instancia de io en strapi para usarla en otros lugares
    strapi.io = io;

    io.on('connection', (socket) => {
      console.log('✅ Cliente conectado:', socket.id);

      // Unirse a una sala específica del usuario
      socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 Usuario ${userId} se unió a su sala`);
      });

      socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
      });
    });

    console.log('🚀 Socket.io configurado correctamente');
  },
};
