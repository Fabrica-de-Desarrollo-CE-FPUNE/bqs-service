
export enum ScraperErrorType {
    INITIALIZATION_ERROR, 
    INVALID_AUTH_STUDENT_ERROR, 
    UNEXPECTED_ERROR
}
export interface ScraperErrorMessage {
    message:string, 
    type:ScraperErrorType, 
    reason?:string
}
export class ScraperError extends Error{

    private constructor(message: string, public type:ScraperErrorType, public reason?:string){
        super(message);
    }
    public static NewError(parameters:ScraperErrorMessage){
        return new ScraperError(
                parameters.message, 
                parameters.type, 
                parameters.reason
        );
    }

}


export class ScraperErrorFactory {

    public static InvalidUserError(): ScraperError{
      return ScraperError.NewError({
            message: "cedula/password incorrectos", 
            type: ScraperErrorType.INVALID_AUTH_STUDENT_ERROR
        });
    }

    public static InitializationError(): ScraperError{
        return ScraperError.NewError({
            message: "Failed to load api link, check env file", 
            type: ScraperErrorType.INITIALIZATION_ERROR,
            reason: "api_* variables expected a string, got undefined"
        });
    }

    public static UnexpectedError(error: Error): ScraperError{
        return ScraperError.NewError({
            message:'An unexpected error happened during the scraping process', 
            type: ScraperErrorType.UNEXPECTED_ERROR, 
            reason: (error).message
        });
    }

}