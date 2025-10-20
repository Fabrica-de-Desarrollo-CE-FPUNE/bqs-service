import {  Page } from "puppeteer";
import { IConsultorWebScraper } from "./WebScraper.Interfaces";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { ScraperError, ScraperErrorFactory } from "../../errors/ConsultorScraperErrors";
import { PuppeteerManager } from "./PuppeteerManager";


export class ConsultorWebScraper2 implements IConsultorWebScraper{

    private acceso: Alumno_credencial_login | null; 
    private urls = {
        login_page:'http://servicios.fpune.edu.py:82/consultor/indexjson.php', 
        error_page:'http://servicios.fpune.edu.py:82/consultor/Error.html', 
        student_page:'http://servicios.fpune.edu.py:82/consultor/detallejson.php'
    };

    public constructor(credencial: Alumno_credencial_login){
        this.acceso = credencial;
    }

    public async getConsultorData(): Promise<string> {
        try{
            const page: Page = PuppeteerManager.getInstance().getPage();
            await page.goto(this.urls.login_page, {waitUntil: "networkidle2"});
            const cedula_selector: string = 'input[name="usuario"]';
            const contrasenia_selector:string = 'input[name="clave"]';
            const login_button_selector:string = 'button[type="submit"]';

            await page.type(cedula_selector, (this.acceso?.cedula as string));
            await page.type(contrasenia_selector, (this.acceso?.contrasenia as string));
            await Promise.all([page.click(login_button_selector),
            page.waitForNavigation({waitUntil:'networkidle2'})]);
            if(page.url() === this.urls.error_page){
                throw ScraperErrorFactory.InvalidUserError();
            }
            return page.content();
        }catch(error){
            if(error instanceof ScraperError){
                throw error;
            }else{
                throw ScraperErrorFactory.UnexpectedError(error as Error);
            }
        }
           
    }

}

