import { AppDataSource } from '../../src/postgre/data-source';
import { Usuario } from '../../src/postgre/entity/Usuario';


describe('Conjunto de test para PostgreSQL junto a typeORM', ()=>{

    test('Creación de las tablas de base de datos...', async () => {
        // Conectarse a la base de datos...
        await AppDataSource.initialize();
        // Borra todas las tablas de base de datos anteriores dado el caso de que existan  y luego las crea nuevamente.
        await AppDataSource.synchronize(true);
        
    });

    test('Insertar información sobre un usuario/alumno...', async()=>{

        const usuarioNuevoDataRaw = await AppDataSource.createQueryBuilder()
        .insert().into(Usuario).values({
            nombreCompleto: 'Do aliquip veniam cupidatat',
            cedulaIdentidad: '3213132'
        }).execute();
        console.log(usuarioNuevoDataRaw); 
        //Debido a ser el primer valor creado...
        expect(usuarioNuevoDataRaw.raw[0].id).toBe(1);
    });

    test('Actualizacion de información sobre usuario/alumno recién creado...', async()=>{

        const usuarioUpdateDataRaw = await AppDataSource.createQueryBuilder()
        .update(Usuario).set({
            nombreCompleto:'Salame',
            cedulaIdentidad:'6161000',
            celular:'0981911911'
        }).where(
            "id = :id", {id:1}
        ).execute();
        console.log(usuarioUpdateDataRaw);
        
    });

    test('Inserción múltiple de información de usuario/alumno...', async()=>{
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
    });

    test('Eliminación de información de alumno/usuario...', async()=>{

        const usuarioEliminadoDataRaw = await AppDataSource.createQueryBuilder()
        .delete().from(Usuario).where('id = :id',{id:2}).execute();

        console.log(usuarioEliminadoDataRaw)
    });

    test('Select de información de alumno/usuario...', async()=>{
        
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
        expect(usuariosDataRaw.map((usuario:Usuario)=>usuario.id)).toStrictEqual([1,3])

    });

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuarioDeRepository = new Usuario();

    test('Uso de Repository para insertar alumno/usuario...', async()=>{

        usuarioDeRepository.cedulaIdentidad = '6363333';
        usuarioDeRepository.nombreCompleto = 'Nisi ullamco mollit.';
        
        await usuarioRepository.insert(usuarioDeRepository);

        console.log('ID del usuario nuevo', usuarioDeRepository.id);
        expect(usuarioDeRepository.id).toStrictEqual(4);

    });

    test('Uso de Repository para modificar alumno/usuario...', async()=>{

        usuarioDeRepository.celular = '4234242';
        usuarioDeRepository.email = 'correo@correo.com'

        await usuarioRepository.save(usuarioDeRepository);

        // Validamos que no hubo cambios en la id y en la cedula porque son cosas que no alteramos
        expect(usuarioDeRepository).toMatchObject({id:4, cedulaIdentidad:'6363333'});

    });

    test('Uso de Repository para eliminar y buscar alumno/usuario...', async()=>{

        await usuarioRepository.remove(usuarioDeRepository);

        const usuarioBusqueda = await usuarioRepository.findOne({
            where:{
                id:4
            }
        });

        // Demostramos que el mismo ya no existe
        expect(usuarioBusqueda).toBe(null);

    });

})