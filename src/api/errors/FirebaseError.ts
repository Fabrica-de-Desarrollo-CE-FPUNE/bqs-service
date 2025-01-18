import { StatusCodes } from "http-status-codes";
import ErrorConStatusConstructor from "./ErrorConStatusConstructor";
import { FirebaseErrorCodes } from "./FirebaseErrorCodes";

export class FirebaseError {

    public static NoHayToken() : ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('No pudimos registrarlo al servicio de notificación',
            StatusCodes.BAD_REQUEST,
            FirebaseErrorCodes.NO_TOKEN
        );
    }

    public static NoSubscripto() : ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('No pudimos registrarlo al servicio de notificación',
            StatusCodes.BAD_REQUEST,
            FirebaseErrorCodes.NO_SUBSCRIPCION
        );
    }
    public static NoServicio() : ErrorConStatusConstructor {
        return new ErrorConStatusConstructor('No se encuentra disponible el servicio de notificaciones',
            StatusCodes.SERVICE_UNAVAILABLE,
            FirebaseErrorCodes.NO_SERVICIO
        );
    }
}