/*import { Alumno_credencial_login } from "./../src/types/ConsultorInfoTipos/ConsultorEstudianteCredenciales";
import { ConsultorScraperPuppeteer } from "./../src/bot/scraper/ConsultorScraperImp";
import puppeteer, { Browser } from "puppeteer";

describe("ConsultoScraperErrores", () => {
  it("deberia inicializar la clase correctamente", async () => {
    let credenciales: Alumno_credencial_login = {
      cedula: "",
      contrasenia: "",
    };
    jest.spyOn(puppeteer, "launch").mockResolvedValueOnce({
      newPage: jest.fn().mockResolvedValueOnce({}),
      close: jest.fn().mockResolvedValueOnce({}),
    } as unknown as Browser);

    let csp: ConsultorScraperPuppeteer = new ConsultorScraperPuppeteer(
      credenciales
    );
    await expect(csp.init()).resolves.not.toThrow();
    expect(csp).toBeDefined();
  });
});
*/