

export class ApiRequestErrorCodes{
    /**
     * se usa cuando se envia un formate del json incorrecto.
     */
    public static BAD_BODY_FORMAT = "BODY_ERR-1";
    /**
     * se usa cuando no se ha enviado un json para elbody
     */
    public static NOT_BODY_SENT = "BODY_ERR-2";

    /**
     * se usa cuando se ha hecho una request a una url no manejada por las rutas
     */
    public static UNKNOWN_REQUEST_URL = "UNKOWN_URL_ERR-1";
}