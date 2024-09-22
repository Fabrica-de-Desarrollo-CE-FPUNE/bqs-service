import { ConsultorErrorCodes, CoreErrorCodes } from "./CoreErrorCodes";



export class ConsultorServiceError extends Error{
    errorCode?: string
    public constructor(message: string, errorCode:string){
        super(message);
        this.errorCode = errorCode;
        this.name = this.constructor.name; 
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ConsultorErrorFactory {

    public static InvalidCredentialError(): ConsultorServiceError{
        return new ConsultorServiceError(
            "Las credenciales no son validas", 
            ConsultorErrorCodes.WRONG_CREDENTIALS
        );
    }

    public static InternalError(): ConsultorServiceError{
        return new ConsultorServiceError(
            "Error interno", 
            CoreErrorCodes.INTERNAL_ERROR
        );
    }

}