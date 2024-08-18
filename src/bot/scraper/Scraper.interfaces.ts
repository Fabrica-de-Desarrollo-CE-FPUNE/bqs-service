/**
 * Interfaz que represanta las acciones a realizar por el scraper, por el momento con extraer los datos de la pagina de detalles basta.
 * @returns {Promise<string>} una promesa que cuando se resuelve, devuelve la pagina html en un string para ser procesado luego.
 * @throws {ScraperError} cuando se produce un error de algun tipo en el proceso de extraccion de la pagina de detalles.
 * @since v1.0.0
 */
export interface IConsultorScaper{
  getConsultorDetallesPage(): Promise<string>;
}