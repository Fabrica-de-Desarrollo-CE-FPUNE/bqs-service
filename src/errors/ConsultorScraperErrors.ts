export class ScraperError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'ScraperError';
    }
}

export class ErrorDeLogin extends ScraperError{

    constructor(message:string = 'Error al Logearse'){
        super(message);
        this.name = 'ErrorOnLogin';
    }
}

export class ErrorDeInicializacion extends ScraperError {
    constructor(message:string = 'Error al inicializarze'){
        super(message);
        this.name = 'InitializationError';
    }
}

export class ErrorCredencialesNulas extends ScraperError {
    constructor(message:string = 'Error al pasar la credencial de login al scraper'){
        super(message);
        this.name = 'CredentialError';
    }
}

export class ErrorDeExtraccionContenido extends ScraperError {
    constructor(message:string = 'Error al extraer el contenido'){
        super(message);
        this.name = 'ExtractionError';
    }
}