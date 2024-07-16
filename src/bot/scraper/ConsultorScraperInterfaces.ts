export interface IConsultorScraperBase {
    init():Promise<void>; 
    extractPageContent():Promise<string|null>;
    reset():Promise<void>; 
}
export interface IConsultorScraperLogin{
    logIn():Promise<void>;
}
