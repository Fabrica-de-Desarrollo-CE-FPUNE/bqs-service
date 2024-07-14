export class ScraperError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'ScraperError';
    }
}

export class ErrorOnLogin extends ScraperError{
    constructor(message:string = 'Error al Logearse'){
        super(message);
        this.name = 'ErrorOnLogin';
    }
}