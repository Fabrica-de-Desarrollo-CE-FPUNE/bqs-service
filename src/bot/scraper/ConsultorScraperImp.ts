import { Alumno_credencial_login } from '../../types/ConsultorEstudianteCredenciales.types';
import { IConsultorScraperBase, IConsultorScraperLogin } from './ConsultorScraperInterfaces';
import puppeteer, { Browser, HTTPResponse, Page } from 'puppeteer';
import { ScraperError, ScraperErrorType } from './../../errors/ConsultorScraperErrors';



export class ConsultorScraperPuppeteer implements IConsultorScraperBase, IConsultorScraperLogin{

    private navegador: Browser | null = null;
    private pagina:Page | null= null;
    private credencial:Alumno_credencial_login | null | undefined;
    private urls = {
        login_page:'http://servicios.fpune.edu.py:82/consultor/', 
        error_page:'http://servicios.fpune.edu.py:82/consultor/Error.html', 
        student_page:'http://servicios.fpune.edu.py:82/consultor/detalle.php'
    };
    public constructor(credencial:Alumno_credencial_login){
        this.credencial = credencial;
    }

    public async init(): Promise<void> {
        const puppeteerOptions = {
          headless: true,
        };
        try {
          this.navegador = await puppeteer.launch(puppeteerOptions);
          this.pagina = await this.navegador.newPage();
        } catch (error) {
          throw ScraperError.NewError({
            message:'No se pudo inicializar', 
            type:ScraperErrorType.INITIALIZATION_ERROR,
            reason:(error as Error).message
          });
        }
    }
  

    public async extractPageContent(): Promise<string | null> {
        try {
          if (!this.pagina) {
            throw ScraperError.NewError({
              message: "No se pudo extraer el contenido de la pagina",
              type: ScraperErrorType.INITIALIZATION_ERROR,
              reason: "La pagina no ha sido inicializado",
            });
          }
          return await this.pagina.content();
        } catch (error) {
          throw ScraperError.NewError({
            message:
              "No se pudo extraer el contenido debido a un error externo",
            type: ScraperErrorType.PAGE_EXTRACTION_ERROR,
            reason: (error as Error).message,
          });
        }
    }
    public async reset(): Promise<void> {
        if(this.navegador){
            await this.navegador.close();
            this.navegador = null;
            this.pagina = null;
        }
    }

    public async gotoLogIn(): Promise<void> {
        try {
          if (!this.pagina) {
            throw ScraperError.NewError({
              message: "No se pudo acceder a la pagina de login",
              type: ScraperErrorType.INITIALIZATION_ERROR,
              reason: "La pagina no ha sido inicializado",
            });
          }

          let response: HTTPResponse | null = await this.pagina.goto(
            this.urls.login_page,
            { waitUntil: "networkidle2" }
          );
          //mejor manejo de error de la respuesta  en el futuro.
        } catch (error) {
          throw ScraperError.NewError({
            message: "No se pudo acceder a la pagina por un error externo:",
            type: ScraperErrorType.GOING_TO_LOGIN_ERROR,
            reason: (error as Error).message,
          });
        }
    }

    public async logIn(): Promise<void> {
        try{
        if(!this.pagina){
            throw ScraperError.NewError({
                message: "No se pudo acceder a la pagina de login",
                type: ScraperErrorType.INITIALIZATION_ERROR,
                reason: "La pagina no ha sido inicializado",
              });
        }
            if(this.pagina.url() !== this.urls.login_page){
                this.gotoLogIn();
            }
            const cedula_selector: string = 'input[name="usuario"]';
            const contrasenia_selector:string = 'input[name="clave"]';
            const login_button_selector:string = 'button[type="submit"]';

            await this.pagina.type(cedula_selector, (this.credencial?.cedula as string));
            await this.pagina.type(contrasenia_selector, (this.credencial?.contrasenia as string));
            await Promise.all([this.pagina.click(login_button_selector),
                 this.pagina.waitForNavigation({waitUntil:'networkidle2'})]);

            if(this.pagina.url() === this.urls.error_page){
                throw ScraperError.NewError({
                    message:'cedula/contrasenia incorrectos', 
                    type:ScraperErrorType.INVALID_AUTH_STUDENT_ERROR, 
                    reason:`url actual: ${this.pagina.url()}`
                });
            }
        }catch(error){
            throw ScraperError.NewError({
                message:'Se produjo un error inesperado al hacer login.', 
                type: ScraperErrorType.UNEXPECTED_LOGIN_ERROR, 
                reason:(error as Error).message
            });
        }
    }

}