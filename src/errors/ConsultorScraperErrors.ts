
export enum ScraperErrorType {
    INITIALIZATION_ERROR, 
    PAGE_EXTRACTION_ERROR, 
    GOING_TO_LOGIN_ERROR, 
    INVALID_AUTH_STUDENT_ERROR, 
    UNEXPECTED_LOGIN_ERROR

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