export interface IConsultorScraper {
    init():Promise<void>;
    logIn(cedula:string, contrasenia:string):Promise<void>;
    extraerPaginaActual():Promise<string|null>;
}