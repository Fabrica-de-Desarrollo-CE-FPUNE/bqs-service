

/**
 * Intefaz para la funcionalidad basica de un web scraper.
 * @author R. Elias Ojeda Almada
 * @since v1.0.0
 */

export interface IConsultorScraperBase {
    /**
     * Inicializa el scraper aplicando las configuraciones necesarias y lanzando el navegador. 
     * @returns {Promise<void>} una promesa que se resuelve cuando la inicializacion esta completa. 
     * @throws {ErrorDeInicializacion} Este error se lanza cuando la inicializacion falla.
     * @since v1.0.0
     */
    init():Promise<void>; 

    /**
     * Extrae el contenido de una página web.
     * @returns {Promise<string | null>} Una promesa que se resuelve con el contenido HTML de la página,
     * o null si la extracción falla o no se encuentra contenido.
     * @throws {ErrorDeExtraccionContenido} Si la extracción de HTML falla.
     * @since v1.0.0
     */
    extractPageContent():Promise<string|null>;

   /**
     * Restablece el scraper a su estado inicial, permitiendo su reutilización.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el reinicio está completo.
     * @since v1.0.0
     */
    reset():Promise<void>; 
}

/**
 * Interfaz para la funcionalidad de inicio de sesión de un scraper web.
 * @author R. Elias Ojeda Almada
 * @since v1.0.0
 */
export interface IConsultorScraperLogin{
     /**
     * Inicia sesión en una aplicación web usando las credenciales proporcionadas.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el proceso de inicio de sesión está completo.
     * @throws {ErrorDeLogin} Si el inicio de sesión falla.
     * @since v1.0.0
     */
    logIn():Promise<void>;
}
