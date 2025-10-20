import * as argon2 from "argon2";

/**
 * Procesa una cadena que representa una materia y extrae información estructurada de ella.
 *
 * Esta función toma un string con formato específico (incluyendo un identificador, nombre y
 * opcionalmente el semestre) y lo descompone en un objeto que contiene el ID de la materia,
 * su nombre y el semestre si está presente.
 *
 * @param nombre - Una cadena que describe la materia. Ejemplo de formatos esperados:
 *                 - "7425 PRUEBA (TESTING) Y MANTENIMIENTO DE SOFTWARE. Sem.: 8"
 *                 - "7425 PRUEBA (TESTING) Y MANTENIMIENTO DE SOFTWARE."
 *                 - "7111 COMUNICACION ORAL Y ESCRITA"
 *
 * @returns Un objeto con la información extraída de la materia:
 *          - `id` (número): El identificador numérico de la materia.
 *          - `nombre` (string): El nombre de la materia.
 *          - `semestre` (número | undefined): El semestre de la materia, si está presente.
 *
 * @throws {Error} Si la cadena proporcionada no contiene información procesable, lanza
 *                 un error con el mensaje:
 *                 "Error: el string ingresado no contiene información procesable para extraer datos de materias."
 *
 * @example
 * // Ejemplo 1: Materia con semestre
 * const materia = getMateria("7425 PRUEBA (TESTING) Y MANTENIMIENTO DE SOFTWARE. Sem.: 8");
 * console.log(materia);
 * // Salida: { id: 7425, nombre: "PRUEBA (TESTING) Y MANTENIMIENTO DE SOFTWARE.", semestre: 8 }
 *
 * @example
 * // Ejemplo 2: Materia sin semestre
 * const materia = getMateria("7425 PRUEBA (TESTING) Y MANTENIMIENTO DE SOFTWARE.");
 * console.log(materia);
 * // Salida: { id: 7425, nombre: "PRUEBA (TESTING) Y MANTENIMIENTO DE SOFTWARE.", semestre: undefined }
 *
 * @example
 * // Ejemplo 3: Materia sin punto ni semestre
 * const materia = getMateria("7111 COMUNICACION ORAL Y ESCRITA");
 * console.log(materia);
 * // Salida: { id: 7111, nombre: "COMUNICACION ORAL Y ESCRITA", semestre: undefined }
 */

export const getMateria = (nombre: string) => {
  /**
   * Esta expresión regular permite capturar el ID, nombre de la materia, y el semestre opcional.
   * Es flexible para manejar casos con y sin punto final o "Sem.: X".
   */
  const expGeneral = /^(\d+)\s+(.+?)(?:\.\s+Sem\.: (\d+))?\.?$/;

  const match = nombre.match(expGeneral);
  if (!match) {
    throw new Error(
      `El string ingresado "${nombre}" no contiene información procesable para extraer datos de materias.`
    );
  }
  return {
    id: Number(match[1]),
    nombre: match[2].trim(),
    semestre: match[3] ? Number(match[3]) : undefined,
  };
};


/**
 * Convierte una fecha en formato `DD/MM/YYYY` a un objeto `Date` en JavaScript.
 * 
 * Esta función toma una cadena en formato `DD/MM/YYYY`, la descompone en día, mes y año,
 * y devuelve un objeto `Date` correspondiente. Es útil cuando se trabaja con fechas en
 * formatos regionales que no son directamente soportados por el constructor de `Date`.
 * 
 * @param fecha - Una cadena de texto que representa la fecha en formato `DD/MM/YYYY`.
 *                Ejemplo: "15/07/2024".
 * 
 * @returns Un objeto `Date` que representa la fecha proporcionada. Si el formato es incorrecto,
 *          puede devolver una fecha inválida (`Invalid Date`), por lo que es recomendable validarlo.
 * 
 * @example
 * // Conversión de una fecha válida
 * const fecha = parseFechaDDMMYYYY("15/07/2024");
 * console.log(fecha); // 2024-07-15T00:00:00.000Z
 * 
 * @example
 * // Intentar convertir una fecha inválida
 * const fecha = parseFechaDDMMYYYY("31/02/2024"); // Fecha inexistente
 * console.log(fecha); // Invalid Date
 * 
 * @example
 * // Validar la fecha devuelta
 * const fecha = parseFechaDDMMYYYY("15/07/2024");
 * if (isNaN(fecha.getTime())) {
 *   console.error("La fecha proporcionada es inválida.");
 * } else {
 *   console.log("Fecha válida:", fecha);
 * }
 */
export const parseFechaDDMMYYYY = (fecha: string): Date => {
  const [day, month, year] = fecha.split("/").map(Number);
  return new Date(year, month - 1, day); // Ajuste del mes (0-indexado)
};

/**
 * Formatea un objeto `Date` a una cadena en el formato `DD/MM/YYYY`.
 * 
 * Esta función toma un objeto `Date` y devuelve una representación de la fecha
 * en formato `DD/MM/YYYY`, agregando ceros a la izquierda si es necesario para
 * los días y meses con un solo dígito.
 * 
 * @param fecha - Un objeto `Date` que representa la fecha a formatear.
 * 
 * @returns Una cadena que representa la fecha en el formato `DD/MM/YYYY`.
 * 
 * @example
 * // Formatear una fecha válida
 * const fecha = new Date(2024, 6, 15); // Nota: Mes es 0-indexado (julio = 6)
 * const fechaFormateada = formatearFecha(fecha);
 * console.log(fechaFormateada); // "15/07/2024"
 * 
 * @example
 * // Formatear la fecha actual
 * const fechaActual = new Date();
 * const fechaFormateada = formatearFecha(fechaActual);
 * console.log(fechaFormateada); // Ejemplo: "11/01/2025" (dependiendo de la fecha actual)
 */
export const formatearFecha = (fecha: Date): string => {
  const day = fecha.getDate().toString().padStart(2, "0"); // Día con dos dígitos
  const month = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Mes con dos dígitos
  const year = fecha.getFullYear(); // Año completo
  return `${day}/${month}/${year}`;
};


/**
 * Extrae valores numéricos de una escala definida como un string y los organiza en un objeto estructurado.
 * 
 * Esta función utiliza una expresión regular para identificar y extraer números seguidos de un guion (`-`) en un string,
 * luego convierte los valores extraídos en números y los asigna a propiedades específicas del objeto resultante.
 * 
 * @param escala - Un string que contiene la escala en formato definido. 
 *                 Ejemplo: `"10-20-30-40"`, `"15-25-35"`, etc.
 * 
 * @returns Un objeto con los siguientes campos:
 * - `primera_parcial`: El primer valor numérico extraído (obligatorio).
 * - `segunda_parcial`: El segundo valor numérico extraído (obligatorio).
 * - `trabajo_practico`: El tercer valor numérico extraído, o `0` si no está presente.
 * - `trabajo_laboratorio`: El cuarto valor numérico extraído, o `0` si no está presente.
 * 
 * @throws {Error} Si no se encuentran valores numéricos en el string de entrada, lanza un error indicando que
 * la escala no es procesable.
 * 
 * @example
 * // Caso con todos los valores presentes
 * const escala = "D 10-20-30-40";
 * const resultado = getEscala(escala);
 * console.log(resultado);
 * // Salida:
 * // {
 * //   primera_parcial: 10,
 * //   segunda_parcial: 20,
 * //   trabajo_practico: 30,
 * //   trabajo_laboratorio: 40
 * // }
 * 
 * @example
 * // Caso con valores faltantes
 * const escala = "I 15-25-35";
 * const resultado = getEscala(escala);
 * console.log(resultado);
 * // Salida:
 * // {
 * //   primera_parcial: 15,
 * //   segunda_parcial: 25,
 * //   trabajo_practico: 35,
 * //   trabajo_laboratorio: 0
 * // }
 * 
 * @example
 * // Caso de error
 * const escala = "Sin valores válidos";
 * try {
 *   const resultado = getEscala(escala);
 * } catch (error) {
 *   console.error(error.message); // "Error en la extracción de la escala: el string no contiene el tipo de información procesable"
 * }
 */
export const getEscala = (escala: string) => {
  const regexEscala = /\d+-(?=\d)/g; // Expresión regular para encontrar números seguidos de un guion
  const extraer = escala.match(regexEscala);

  if (extraer) {
    const transformar = extraer.map(num => Number(num.replace('-', '')));
    return {
      primera_parcial: transformar[0],
      segunda_parcial: transformar[1],
      trabajo_practico: transformar[2] ?? 0,
      trabajo_laboratorio: transformar[3] ?? 0
    };
  } else {
    throw new Error(
      'Error en la extracción de la escala: el string no contiene el tipo de información procesable'
    );
  }
};
/**
 * Encripta un string utilizando el algoritmo Argon2.
 * 
 * @param {string} value - El valor que deseas encriptar.
 * @returns {Promise<string>} - El hash generado a partir del valor proporcionado.
 * 
 * @example
 * const hash = await hashearString("miClaveSegura123");
 * console.log(hash); // Salida: $argon2id$v=19$m=65536,t=3,p=1$...
 */
export const hashearString = async (value: string): Promise<string> => {
  const hash = await argon2.hash(value);
  return hash;
};

/**
 * Compara un hash con una clave proporcionada para verificar si coinciden.
 * 
 * @param {string} hash - El hash previamente generado con el que deseas comparar.
 * @param {string} clave - La clave original que deseas validar contra el hash.
 * @returns {Promise<boolean>} - `true` si la clave coincide con el hash, `false` en caso contrario.
 * 
 * @example
 * const isValid = await compararHash("$argon2id$v=19$m=65536,t=3,p=1$...", "miClaveSegura123");
 * console.log(isValid); // Salida: true o false
 */
export const compararHash = async (hash: string, clave: string): Promise<boolean> => {
  return await argon2.verify(hash, clave);
};