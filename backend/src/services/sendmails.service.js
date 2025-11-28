import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

export const sendVentaConfirmationEmail = async (clienteCorreo, ventaDetalle, totalPagar) => {
    try {
        // Parsear y formatear detalles de venta
        let detallesArray = [];
        try {
            detallesArray = typeof ventaDetalle === 'string' ? JSON.parse(ventaDetalle) : ventaDetalle;
        } catch (e) {
            detallesArray = [];
        }

        // Generar HTML de productos
        const productosHTML = detallesArray.map((item, index) => {
            const subtotal = item.precio_unitario * item.cantidad;
            return `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px 20px;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; color: white; font-weight: bold; font-size: 14px;">
                            ${index + 1}
                        </div>
                        <div>
                            <p style="margin: 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                                Producto #${item.id_producto}
                            </p>
                            <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">
                                ${item.cantidad} ${item.cantidad > 1 ? 'unidades' : 'unidad'} × $${item.precio_unitario.toLocaleString('es-CO')}
                            </p>
                        </div>
                    </div>
                </td>
                <td style="padding: 16px 20px; text-align: right;">
                    <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                        $${subtotal.toLocaleString('es-CO')}
                    </p>
                </td>
            </tr>
            `;
        }).join('');

        // Generar texto plano de productos
        const productosTexto = detallesArray.map((item, index) => {
            const subtotal = item.precio_unitario * item.cantidad;
            return `${index + 1}. Producto #${item.id_producto} - ${item.cantidad} ${item.cantidad > 1 ? 'unidades' : 'unidad'} × $${item.precio_unitario.toLocaleString('es-CO')} = $${subtotal.toLocaleString('es-CO')}`;
        }).join('\n');

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Compra</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            
                            <!-- Header con degradado -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 40px 30px; text-align: center;">
                                    <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 40px;">🍹</span>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                        ¡Gracias por tu Compra!
                                    </h1>
                                    <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px;">
                                        Granizads POS
                                    </p>
                                </td>
                            </tr>

                            <!-- Contenido principal -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                        Hola,
                                    </p>
                                    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                        Tu pedido ha sido procesado exitosamente. A continuación, encontrarás los detalles de tu compra:
                                    </p>

                                    <!-- Detalles de la venta -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f9fafb; border-radius: 12px; overflow: hidden;">
                                        <tr>
                                            <td colspan="2" style="padding: 20px; border-bottom: 2px solid #e5e7eb;">
                                                <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    Detalle del Pedido
                                                </p>
                                            </td>
                                        </tr>
                                        ${productosHTML}
                                    </table>

                                    <!-- Total a pagar destacado -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); border-radius: 12px; overflow: hidden;">
                                        <tr>
                                            <td style="padding: 24px; text-align: center;">
                                                <p style="margin: 0 0 8px; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    Total a Pagar
                                                </p>
                                                <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">
                                                    $${totalPagar.toLocaleString('es-CO')}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin: 30px 0 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                                        Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 8px; color: #374151; font-size: 16px; font-weight: 600;">
                                        Granizads POS
                                    </p>
                                    <p style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                                        Sistema de Punto de Venta<br/>
                                        © ${new Date().getFullYear()} Todos los derechos reservados
                                    </p>
                                    <div style="margin-top: 20px;">
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                            Este es un correo automático, por favor no responder.
                                        </p>
                                    </div>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const textContent = `
GRANIZADS POS
¡Gracias por tu compra!

Tu pedido ha sido procesado exitosamente.

DETALLE DEL PEDIDO:
${productosTexto}

TOTAL A PAGAR: $${totalPagar.toLocaleString('es-CO')}

Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.

---
Granizads POS - Sistema de Punto de Venta
© ${new Date().getFullYear()} Todos los derechos reservados
        `.trim();

        const info = await transporter.sendMail({
            from: '"DrinKéo POS" <noreply@granizads.com>',
            to: "juan.camilo.taborda@correounivalle.edu.co",
            subject: "Confirmación de tu Compra - DrinKéo POS",
            text: textContent,
            html: htmlContent,
        });
        
        console.log("Confirmation email sent: %s", info.messageId);
    }
    catch (error) {
        console.error("Error sending confirmation email:", error);
    }
};