export interface CambioContrasenaRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    contrasenaActual?: string;
    nuevaContrasena?: string;
}