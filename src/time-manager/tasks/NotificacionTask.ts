import dayjs from "dayjs";
import { TaskBase } from "../TaksBase";
import { NotificacionController } from "../../firebase/NotificacionController";
import { Notification } from "firebase-admin/messaging";
import { ITask } from "../ITask";


enum NotificationAction {
    subscribirTopico,
    desubscribirTopico,
    enviarMensaje,
}

type NotificationActionStrings = keyof typeof NotificationAction;

export class NotificacionTask extends TaskBase {

    private tokensFCM: string[];
    private topic: string;
    private mensaje: {
        notification: Notification;
        data?: {
            [key: string]: string;
        };
    } | undefined
    private notificacionController: NotificacionController;

    ejecutar: () => Promise<void>;


    constructor(data: { tokensFCM?: string[], topic: string, accion: NotificationActionStrings, mensaje?: { notification: Notification, data?: { [key: string]: string } }, configuracionTask?: ITask }) {
        super(
            data.configuracionTask ?? {
                ejecutarUnaVez: true, ejecutarInmediatamente: false, intervalo: dayjs().add(5, 'minutes')
            }
        );
        this.notificacionController = new NotificacionController();
        this.tokensFCM = data.tokensFCM ?? [];
        this.topic = data.topic;
        this.mensaje = data.mensaje;
        this.init(data.accion);

    }

    private init(accion: NotificationActionStrings) {

        const accionEnum = NotificationAction[accion]

        switch (accionEnum) {
            case NotificationAction.subscribirTopico:
                this.ejecutar = async () => {
                    await this.notificacionController.suscribirATopico(this.tokensFCM, this.topic);
                }
                break;
            case NotificationAction.desubscribirTopico:
                this.ejecutar = async () => {
                    await this.notificacionController.desubscribirATopico(this.tokensFCM, this.topic);
                }
                break;
            case NotificationAction.enviarMensaje:
                if (this.mensaje) {
                    this.ejecutar = async () => {
                        this.notificacionController.enviarMensajeATopico(this.topic, this.mensaje!);
                    }
                } else {
                    throw new Error('NotificacionTask: no hay mensaje que enviar')
                }
                break;
        }
    }

}