
export class ConsultorErrorCodes {
    /**
     * se utiliza cuando se pasan credenciales incorrectas(cedula/pass)
     * @see Alumno_credencial_login  para mejor referencia con las credenciales
     */
    public static WRONG_CREDENTIALS = "CONSULTOR_ERR-1";
}

export class CoreErrorCodes {
    /**
     * se utiliza cuando se produce un error no relacionado a la logica de negocio del consultor, sino a node
     * 
     */
    public static INTERNAL_ERROR = "INTERNAL_ERR-1";
}