import { AlumnoController } from '../../src/postgre/controller/AlumnoController';
import { ConsultorDataService } from "../../src/core/ConsultorService";
import { AppDataSource } from '../../src/postgre/data-source';
import { PuppeteerManager } from '../../src/bot/scraper/PuppeteerManager';


describe('Conjunto de uso del controlador de PostgreSQL',  ()=>{


    it('Prueba de guardado de información...', async ()=>{

        const consultor_servicio: ConsultorDataService = new ConsultorDataService();
    
        const alumnoController = new AlumnoController();

        await PuppeteerManager.getInstance().initialize();

        const res = await consultor_servicio.getAll_Consultor_Info({
            contrasenia:'9799',  cedula:'5043206'
        });

        await PuppeteerManager.getInstance().close();

        expect(AppDataSource.isInitialized).toBeTruthy();
        
        expect(res).toBeTruthy();

        //await alumnoController.guardarAlumnoData(res);

        const resFromDB = await alumnoController.extraerAlumnoData('5043206');

        await PuppeteerManager.getInstance().close();

        console.log(resFromDB);

        expect(resFromDB).toBeTruthy();

    },50000)

})