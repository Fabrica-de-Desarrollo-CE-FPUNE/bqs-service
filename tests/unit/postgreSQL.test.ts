import { FindOperator, Not } from 'typeorm';
import { AppDataSource } from '../../src/postgre/data-source';
import { Inscripcion } from '../../src/postgre/entity/Inscripcion';
import { Materia } from '../../src/postgre/entity/Materia';
import { Periodo } from '../../src/postgre/entity/Periodo';
import { Usuario } from '../../src/postgre/entity/Usuario';
import dayjs from 'dayjs';


describe('Conjunto de test para PostgreSQL junto a TypeORM', ()=>{

    const materiaRepository = AppDataSource.getRepository(Materia);
    const periodoRepository = AppDataSource.getRepository(Periodo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
    const usuarioDeRepository = new Usuario();

    it('Conexión y creación de las tablas de base de datos y...', async () => {
        // Conectarse a la base de datos...
        await AppDataSource.initialize();
        // Borra todas las tablas de base de datos anteriores dado el caso de que existan  y luego las crea nuevamente.
        await AppDataSource.synchronize(true);

        expect(AppDataSource.isInitialized).toBeTruthy();
        
    });

    it('-> [DESESTRUCTURADO]: Insertar información sobre un usuario/alumno...', async()=>{

        const usuarioNuevoDataRaw = await AppDataSource.createQueryBuilder()
        .insert().into(Usuario).values({
            nombreCompleto: 'Do aliquip veniam cupidatat',
            cedulaIdentidad: '3213132'
        }).execute();
        console.log(usuarioNuevoDataRaw); 
        //Debido a ser el primer valor creado...
        expect(usuarioNuevoDataRaw.raw[0].id).toBe(1);
    });

    it('-> [DESESTRUCTURADO]: Actualizacion de información sobre usuario/alumno recién creado...', async()=>{

        const usuarioUpdateDataRaw = await AppDataSource.createQueryBuilder()
        .update(Usuario).set({
            nombreCompleto:'Salame',
            cedulaIdentidad:'6161000',
            celular:'0981911911'
        }).where(
            "id = :id", {id:1}
        ).execute();
        console.log(usuarioUpdateDataRaw);
        expect(usuarioUpdateDataRaw.raw).not.toBeNull();
        
    });

    it('-> [DESESTRUCTURADO]: Inserción múltiple de información de usuario/alumno...', async()=>{
        const usuarioNuevoDataRaw = await AppDataSource.createQueryBuilder()
        .insert().into(Usuario).values([
            {
                nombreCompleto: 'Incididunt dolor in cillum',
                cedulaIdentidad: '123456'
            },
            {
                nombreCompleto: 'Nisi veniam cupidatat aliquip',
                cedulaIdentidad: '321421'
            }
        ]).execute();

        console.log(usuarioNuevoDataRaw);

        expect(usuarioNuevoDataRaw.raw.length).toBeGreaterThan(0);
        

        
    });

    it('-> [DESESTRUCTURADO]: Eliminación de información de alumno/usuario...', async()=>{

        const usuarioEliminadoDataRaw = await AppDataSource.createQueryBuilder()
        .delete().from(Usuario).where('id = :id',{id:2}).execute();

        console.log(usuarioEliminadoDataRaw);
        expect(usuarioEliminadoDataRaw.raw.length).toStrictEqual(0);
    });

    it('-> [DESESTRUCTURADO]: Select de información de alumno/usuario...', async()=>{
        
        const usuariosDataRaw = await AppDataSource.createQueryBuilder()
        /**
         * Teniendo en cuenta el alias en .from(Usuario,'alias') podes hacer
         * .select("alias.id, alias.nombreCompleto")
         * o bien .select('alias') para tener todos los elementos
         */
        .select("alias.id, alias.nombreCompleto")
        .from(Usuario,'alias').execute();

        console.log(usuariosDataRaw);
        // Los ids resultantes a causa de la tabla vacia
        expect(usuariosDataRaw.map((usuario:Usuario)=>usuario.id)).toStrictEqual([1,3]);

    });

    it('-> [REPOSITORY]: insertar alumno/usuario...', async()=>{

        usuarioDeRepository.cedulaIdentidad = '6363333';
        usuarioDeRepository.nombreCompleto = 'Nisi ullamco mollit.';
        
        await usuarioRepository.insert(usuarioDeRepository);

        console.log('ID del usuario nuevo', usuarioDeRepository.id);
        expect(usuarioDeRepository.id).toStrictEqual(4);

    });

    it('-> [REPOSITORY]: modificar alumno/usuario...', async()=>{

        usuarioDeRepository.celular = '4234242';
        usuarioDeRepository.email = 'correo@correo.com';

        await usuarioRepository.save(usuarioDeRepository);

        // Validamos que no hubo cambios en la id y en la cedula porque son cosas que no alteramos
        expect(usuarioDeRepository).toMatchObject({id:4, cedulaIdentidad:'6363333'});

    });

    it('-> [REPOSITORY]: eliminar y buscar alumno/usuario...', async()=>{

        await usuarioRepository.remove(usuarioDeRepository);

        const usuarioBusqueda = await usuarioRepository.findOne({
            where:{
                id:4
            }
        });

        // Demostramos que el mismo ya no existe
        expect(usuarioBusqueda).toBe(null);

    });
    
    it('-> [REPOSITORY]: crear materia y generar una relación con un periodo... ', async ()=>{

        const periodo = new Periodo();
        const diaPrueba = dayjs('2024-10-21');
        periodo.fechaInscripcion = new Date(diaPrueba.toISOString());
        periodo.fechaVigencia = new Date(diaPrueba.add(8,'year').toISOString());
        await periodoRepository.save(periodo);
        //Verificar si se guardó con éxito
        expect(periodo.id).toStrictEqual(1);


        const materia = new Materia();
        materia.id = 1; // Acá hacemos de esta manera, es decir escrita porque el consultor ya tiene ids de base
        materia.materia='Castellano';
        /**
         * Procedemos al guardado relacional...
         * Una gran ventaja que tiene es que es capaz de sobreescribir información,
         * si tuvieramos por ejemplo ya un conjunto de periodos, podemos utilizar
         * materia.periodos = [...periodosQueYaTeniamos, periodo] 
         * de tal forma agregar uno más
         */
        materia.periodos = [periodo];
        
        await materiaRepository.save(materia);
        // Verificamos por parte su existencia
        expect(materia).toMatchObject({id:1});
        expect(materia.periodos).not.toEqual(null);
        expect(materia.periodos[0]).not.toEqual(null);
        expect(materia.periodos[0]).toMatchObject({id:1});

    });

    it('-> [REPOSITORY]: relacionar materia con usuario en la tabla n/m Inscripcion...', async()=>{

        // Para tener una busqueda´i
        const usuario = await usuarioRepository.findOneBy({
            nombreCompleto: Not('')
        })
        const materia = await materiaRepository.findOneBy({
            materia: Not('')
        });

        const inscripcion:Inscripcion = new Inscripcion();
        /**
         *  Acá radica la creación de esta tabla de forma manual, necesitaba asignar grupos
         * por el tema de que se agrega secciones para ya sea recursantes o bien como el caso de
         * Ingeniería electrica que de por sí son dos secciones.
         * Prefería que sea de tipo string, pero en la base de datos figura como char
         * esto por si alguna vez la facu empiece a usar letras como la evaluación docente, etc.
         */        
        inscripcion.grupo = '1';
        if(materia && usuario){
            inscripcion.materia = materia;
            inscripcion.usuario = usuario;
            await inscripcionRepository.save(inscripcion);
        }

        // Si se creó correctamente, tendrá id
        expect(inscripcion).toMatchObject({id:1});

    });


    it('Desconexión de la base de datos...', async()=>{

        await AppDataSource.destroy();
        expect(AppDataSource.isInitialized).toBeFalsy();

    });

})