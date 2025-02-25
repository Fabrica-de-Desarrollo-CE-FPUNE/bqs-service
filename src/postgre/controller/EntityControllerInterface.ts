/**
 * Interfaz genérica `EntityControllerInterface<O>` que define las operaciones CRUD y de gestión
 * para entidades en una base de datos, proporcionando abstracción en las funciones comunes.
 *
 * @template O - Representa el tipo principal de los datos utilizados para las operaciones.
 */
export interface EntityControllerInterface<O> {

    /**
     * Busca un registro en la base de datos basado en la información proporcionada.
     * Si el registro no existe, lo crea.
     *
     * @param data - Datos de tipo `O` utilizados para buscar o insertar el registro.
     * @returns Una promesa que resuelve con el objeto encontrado o insertado, o `undefined`/`null` si falla.
     */
    gestionar: (data: O) => Promise<O | undefined | null>;
  
    /**
     * Recupera un registro específico de la base de datos.
     *
     * @param data - Datos del tipo `O` utilizados para identificar el registro a recuperar.
     * @returns Una promesa que resuelve con el objeto encontrado o `undefined`/`null` si no existe.
     */
    get: (data: O) => Promise<O | undefined | null>;
    /**
     * Recupera todos los registros de la base de datos.
     *
     * @param data - Datos del tipo `O` o `undefined` utilizados para identificar el registro a recuperar.
     * Si es `undefined` se intentará buscar todos los datos.
     * @returns Una promesa que resuelve con los objetos encontrados, si no lo hace retorna con lenght `0`.
     */
    getAll: (data?: O) => Promise<O[]>;
    /**
     * Inserta o actualiza un registro en la base de datos.
     *
     * @param data - Datos del tipo `O` que representan el registro a insertar o actualizar.
     * @returns Una promesa que resuelve con `true` si la operación fue exitosa, o `false` en caso de error.
     */
    setOrUpdate: (data: O) => Promise<O | boolean>;
  }