module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      // Obtener el pedido completo con relaciones
      const pedidoCompleto = await strapi.entityService.findOne(
        'api::pedido.pedido',
        result.id,
        { 
          populate: ['cliente', 'detalle_pedidos', 'detalle_pedidos.producto']
        }
      );

      if (pedidoCompleto && pedidoCompleto.cliente) {
        const cliente = pedidoCompleto.cliente;
        
        // Calcular total de productos
        const detalles = pedidoCompleto.detalle_pedidos || [];
        const productosHTML = detalles.map(detalle => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${detalle.producto?.nombre || 'Producto'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${detalle.cantidad}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${detalle.subtotal?.toLocaleString('es-CO')} COP</td>
          </tr>
        `).join('');

        // Enviar email de confirmación
        await strapi.plugins['email'].services.email.send({
          to: cliente.email,
          subject: `🎉 Pedido Confirmado #${result.id} - Carnexpress`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; }
                .total { background-color: #28a745; color: white; font-size: 20px; font-weight: bold; padding: 15px; text-align: right; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🥩 Carnexpress</h1>
                  <h2>¡Pedido Confirmado!</h2>
                </div>
                <div class="content">
                  <p>Hola <strong>${cliente.username}</strong>,</p>
                  <p>Tu pedido ha sido confirmado exitosamente. A continuación encontrarás los detalles:</p>
                  
                  <h3>📦 Pedido #${result.id}</h3>
                  <p><strong>Fecha:</strong> ${new Date(result.createdAt).toLocaleString('es-CO')}</p>
                  <p><strong>Estado:</strong> ${result.estado}</p>
                  
                  <h3>📍 Información de Entrega:</h3>
                  <p><strong>Dirección:</strong> ${result.direccion_entrega}</p>
                  <p><strong>Teléfono:</strong> ${result.telefono_contacto}</p>
                  ${result.notas ? `<p><strong>Notas:</strong> ${result.notas}</p>` : ''}
                  
                  <h3>🛒 Productos:</h3>
                  <table class="table">
                    <thead>
                      <tr style="background-color: #dc3545; color: white;">
                        <th style="padding: 10px; text-align: left;">Producto</th>
                        <th style="padding: 10px; text-align: center;">Cantidad</th>
                        <th style="padding: 10px; text-align: right;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productosHTML}
                    </tbody>
                  </table>
                  
                  <div class="total">
                    TOTAL: $${result.total?.toLocaleString('es-CO')} COP
                  </div>
                  
                  <p style="margin-top: 30px;">Nos pondremos en contacto contigo para coordinar la entrega.</p>
                  <p>¡Gracias por tu compra!</p>
                </div>
                <div class="footer">
                  <p>Este es un email automático, por favor no responder.</p>
                  <p>&copy; 2025 Carnexpress - Todos los derechos reservados</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`✅ Email de confirmación enviado a ${cliente.email}`);
      }
    } catch (error) {
      console.error('❌ Error al enviar email de confirmación:', error);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Verificar si se actualizó el estado
    if (params.data && params.data.estado) {
      try {
        const pedidoCompleto = await strapi.entityService.findOne(
          'api::pedido.pedido',
          result.id,
          { populate: ['cliente'] }
        );

        if (pedidoCompleto && pedidoCompleto.cliente) {
          const cliente = pedidoCompleto.cliente;
          const nuevoEstado = result.estado;

          const mensajes = {
            solicitado: {
              emoji: '📋',
              titulo: 'Pedido Recibido',
              mensaje: 'Hemos recibido tu pedido y lo estamos procesando.'
            },
            despachado: {
              emoji: '🚚',
              titulo: 'Pedido en Camino',
              mensaje: 'Tu pedido ha sido despachado y está en camino a tu dirección.'
            },
            entregado: {
              emoji: '✅',
              titulo: 'Pedido Entregado',
              mensaje: '¡Tu pedido ha sido entregado! Esperamos que disfrutes tus productos.'
            },
            cancelado: {
              emoji: '❌',
              titulo: 'Pedido Cancelado',
              mensaje: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.'
            }
          };

          const info = mensajes[nuevoEstado];

          if (info) {
            await strapi.plugins['email'].services.email.send({
              to: cliente.email,
              subject: `${info.emoji} ${info.titulo} - Pedido #${result.id}`,
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                    .status { font-size: 48px; text-align: center; margin: 20px 0; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>🥩 Carnexpress</h1>
                      <h2>Actualización de Pedido</h2>
                    </div>
                    <div class="content">
                      <p>Hola <strong>${cliente.username}</strong>,</p>
                      <div class="status">${info.emoji}</div>
                      <h2 style="text-align: center;">${info.titulo}</h2>
                      <p style="text-align: center; font-size: 16px;">${info.mensaje}</p>
                      <p style="text-align: center; margin-top: 30px;">
                        <strong>Pedido #${result.id}</strong><br>
                        Estado actual: <span style="color: #dc3545;">${nuevoEstado.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            });

            console.log(`✅ Email de actualización enviado a ${cliente.email}`);
          }
        }

        // Socket.io notification (si está configurado)
        if (strapi.io) {
          const clienteId = pedidoCompleto.cliente.id;
          const notificacion = {
            tipo: 'cambio_estado_pedido',
            pedidoId: result.id,
            estado: nuevoEstado,
            mensaje: mensajes[nuevoEstado]?.mensaje || 'Estado del pedido actualizado',
            timestamp: new Date().toISOString(),
          };

          strapi.io.to(`user_${clienteId}`).emit('notificacion', notificacion);
          console.log(`📢 Notificación enviada al usuario ${clienteId}`);
        }
      } catch (error) {
        console.error('❌ Error al enviar email de actualización:', error);
      }
    }
  },
};
