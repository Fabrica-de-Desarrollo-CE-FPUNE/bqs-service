import { generate } from "generate-password";
export class ClaveTokenUtil {
    private static instance: ClaveTokenUtil;
    private  clave: string = '';



  // Método estático para obtener la instancia única
  public static getInstance(): ClaveTokenUtil {
    if (!ClaveTokenUtil.instance) {
      ClaveTokenUtil.instance = new ClaveTokenUtil();
      ClaveTokenUtil.instance.generarClave()
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
        numbers:true
    })
  }
  public getClave() {
    return this.clave;
  }

 
}
