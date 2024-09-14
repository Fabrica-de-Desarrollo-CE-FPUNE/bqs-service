import { Page } from "puppeteer";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { IConsultorWebScraper } from "./WebScraper.Interfaces";
import { ScraperError, ScraperErrorFactory, ScraperErrorType } from "../../errors/ConsultorScraperErrors";
import { PuppeteerManager } from './PuppeteerManager';




export class ConsultorJsonWebScraper implements IConsultorWebScraper{
    private credencial: Alumno_credencial_login;
    private api_link: string; 
    private api_success: string; 
    private api_error: string;
    public constructor(credencial: Alumno_credencial_login){
        this.credencial = credencial;
        this.api_link = process.env.CONSULTOR_API_LINK as string;
        this.api_success = process.env.CONSULTOR_API_SUCCESS as string; 
        this.api_error = process.env.CONSULTOR_API_ERROR as string;
       if(!this.api_link || !this.api_error || !this.api_success){
            throw ScraperErrorFactory.InitializationError();
       }

    }
    public async getConsultorData(): Promise<string> {
        try{
            const page: Page = PuppeteerManager.getInstance().getPage();
            await page.goto(this.api_link, {waitUntil:"networkidle2"});
             const cedula_selector: string = 'input[name="usuario"]';
            const contrasenia_selector:string = 'input[name="clave"]';
            const login_button_selector:string = 'button[type="submit"]';

            await page.type(cedula_selector, (this.credencial.cedula as string));
            await page.type(contrasenia_selector, (this.credencial.contrasenia as string));
            await Promise.all([page.click(login_button_selector),
            page.waitForNavigation({waitUntil:'networkidle2'})]);
            if(page.url() === this.api_error){
              throw ScraperErrorFactory.InvalidUserError();
            }
            return page.content();

        }catch(error){
            if(!(error instanceof ScraperError)){
                throw ScraperErrorFactory.UnexpectedError(error as Error);
            }
            throw error;
        }
    }
}