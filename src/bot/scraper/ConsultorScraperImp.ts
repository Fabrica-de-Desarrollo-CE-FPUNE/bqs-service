import { ErrorCredencialesNulas, ErrorDeInicializacion } from '../../errors/ConsultorScraperErrors';
import { Alumno_credencial_login } from '../../types/ConsultorInfoTipos/ConsultorEstudianteCredenciales';
import { IConsultorScraperBase, IConsultorScraperLogin } from './ConsultorScraperInterfaces';
import puppeteer, { Browser, Page } from 'puppeteer';



export class ConsultorScraperPuppeteer implements IConsultorScraperBase, IConsultorScraperLogin{

    private navegador: Browser | null = null;
    private pagina:Page | null= null;
    private credencial:Alumno_credencial_login | null | undefined;
    private urls : Record<string, string> = {
        login_page:'', 
        error_page:'', 
        student_page:''
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
          throw new ErrorDeInicializacion((error as Error).message);
        }
    }
    /**
     * 
     */
    public async logIn(): Promise<void> {



        // algoritmo de login aqui :3


        throw new Error('Method not implemented.');
    }


    extractPageContent(): Promise<string | null> {
        throw new Error('Method not implemented.');
    }
    reset(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}