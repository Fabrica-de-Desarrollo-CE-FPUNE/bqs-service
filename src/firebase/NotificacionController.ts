import { getMessaging, Message, Notification } from "firebase-admin/messaging";
import logger from "../log/logger";

/**
 * Clase para manejar el envío, suscripción y desuscripción de notificaciones push mediante Firebase Cloud Messaging.
 */
export class NotificacionController {

    /**
     * Envía un mensaje a un tópico específico.
     * @param {string} topic - El tópico al cual se enviará el mensaje.
     * @param {{notification: Notification, data?: {[key: string]: string}}} mensaje - Contiene la notificación y datos adicionales (opcional).
     */
    public enviarMensajeATopico (topic: string, mensaje: {notification: Notification, data?: {[key: string]: string}}) {
        
        logger.debug(`Preparando envío de mensaje en el tópico ${topic}`);

        const mensajeFijo: Message = {
            topic,
            ...mensaje
        };

        getMessaging().send(mensajeFijo).then(value => {
            logger.info(`Mensaje enviado al tópico ${topic}, la información se encuentra en ${value}`);
        }).catch(error => {
            logger.error(`Error al enviar el mensaje al tópico ${topic}: ${error}`);
        });
    }

    /**
     * Suscribe un conjunto de dispositivos a un tópico.
     * @param {string[]} tokenFCM - Array de tokens FMC de los dispositivos a suscribir.
     * @param {string} topic - El tópico al cual suscribir los dispositivos.
     */
    public async suscribirATopico (tokenFCM: string[], topic: string) {

        logger.info(`${tokenFCM.length} dispositivos están intentando suscribirse al tópico ${topic}`);

        await getMessaging().subscribeToTopic(tokenFCM, topic).then((value) => {
            const {successCount, failureCount, errors} = value;

            if (successCount === tokenFCM.length) {
                logger.info(`Los ${successCount} usuarios en cola fueron suscritos al tópico correctamente.`);
            }

            if (failureCount > 0) {
                logger.warn(`No se pudo suscribir al tópico ${failureCount} de ${tokenFCM.length} dispositivos.`);
            }

            if (errors.length > 0) {
                logger.info(`Se encontraron ${errors.length} errores`);
                errors.forEach(error => {
                    const {code, message} = error.error;
                    logger.error(`${code}: ${message} correspondiente a Firebase`);
                });
            }
        }).catch(error => {
            logger.error(`Error al suscribir dispositivos al tópico ${topic}: ${error.message}`);
        });
    }

    /**
     * Desuscribe un conjunto de dispositivos de un tópico.
     * @param {string[]} tokenFCM - Array de tokens FMC de los dispositivos a desuscribir.
     * @param {string} topic - El tópico del cual desuscribir los dispositivos.
     */
    public desubscribirATopico (tokenFCM: string[], topic: string) {

        logger.info(`${tokenFCM.length} dispositivos están intentando desuscribirse del tópico ${topic}`);

        getMessaging().unsubscribeFromTopic(tokenFCM, topic).then((value) => {
            const {successCount, failureCount, errors} = value;

            if (successCount === tokenFCM.length) {
                logger.info(`Los ${successCount} usuarios en cola fueron desuscritos del tópico correctamente.`);
            }

            if (failureCount > 0) {
                logger.warn(`No se pudo desuscribir del tópico ${failureCount} de ${tokenFCM.length} dispositivos.`);
            }

            if (errors.length > 0) {
                logger.info(`Se encontraron ${errors.length} errores`);
                errors.forEach(error => {
                    const {code, message} = error.error;
                    logger.error(`${code}: ${message} correspondiente a Firebase`);
                });
            }
        }).catch(error => {
            logger.error(`Error al desuscribir dispositivos del tópico ${topic}: ${error.message}`);
        });
    }
}
