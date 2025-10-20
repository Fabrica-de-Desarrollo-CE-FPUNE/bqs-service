import { generate } from "generate-password";
import logger from "../../log/logger";
export class ClaveTokenUtil {
    private static instance: ClaveTokenUtil;
    private  clave: string = '';

  // Método estático para obtener la instancia única
  public static getInstance(): ClaveTokenUtil {
    if (!ClaveTokenUtil.instance) {
      ClaveTokenUtil.instance = new ClaveTokenUtil();
    }
    return ClaveTokenUtil.instance;
  }

  // Método de instancia para obtener la contraseña
  public generarClave(): void {
    this.clave = generate({
        length:20,
        uppercase:true,
        lowercase:true,
        symbols:true,
        numbers:true,
        strict:true,
        exclude:"`';:.,"
    });

    // Borrar en producción
    logger.warn(`Nueva clave generada ${this.clave}`)
  }
  public getClave() {
    return this.clave;
  }

 
}
