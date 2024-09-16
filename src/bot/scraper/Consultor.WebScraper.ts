import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer";
import { IConsultorWebScraper } from "./WebScraper.Interfaces";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { ScraperError, ScraperErrorType } from "../../errors/ConsultorScraperErrors";
import { StatusCodes } from "http-status-codes";


export class ConsultorWebScraper implements IConsultorWebScraper{

    private acceso: Alumno_credencial_login | null; 
    private urls = {
        login_page:'http://servicios.fpune.edu.py:82/consultor/', 
        error_page:'http://servicios.fpune.edu.py:82/consultor/Error.html', 
        student_page:'http://servicios.fpune.edu.py:82/consultor/detalle.php'
    };

    public constructor(credencial: Alumno_credencial_login){
        this.acceso = credencial;
    }


    public async getConsultorData(): Promise<string> {
        try{
            const pup_browser_options = {
                headless: true
            };
            const browser: Browser = await puppeteer.launch(pup_browser_options);
            const page: Page = await browser.newPage();
            let login_response: HTTPResponse = await page.goto(
                this.urls.login_page, 
                {
                    waitUntil: "networkidle2"
                }
            ) as HTTPResponse;
          /*  if(login_response.status() != StatusCodes.OK){
                throw ScraperError.NewError({
                    message: `Error de pagina inesperado`, 
                    type: ScraperErrorType.UNEXPECTED_LOGIN_ERROR, 
                    reason: `codigo de error de pagina: ${login_response.status()}`
                });
            }*/
            const cedula_selector: string = 'input[name="usuario"]';
            const contrasenia_selector:string = 'input[name="clave"]';
            const login_button_selector:string = 'button[type="submit"]';

            await page.type(cedula_selector, (this.acceso?.cedula as string));
            await page.type(contrasenia_selector, (this.acceso?.contrasenia as string));
            await Promise.all([page.click(login_button_selector),
            page.waitForNavigation({waitUntil:'networkidle2'})]);
            if(page.url() === this.urls.error_page){
                throw ScraperError.NewError({
                    message: "cedula/password incorrectos", 
                    type: ScraperErrorType.INVALID_AUTH_STUDENT_ERROR
                });
            }
            return page.content();
        }catch(error){
            if(error instanceof ScraperError){
                throw error;
            }else{
                throw ScraperError.NewError({
                    message:'Se ha producido un error inesperado', 
                    type: ScraperErrorType.UNEXPECTED_ERROR, 
                    reason: (error as Error).message
                });
            }
        }
           
    }

}

