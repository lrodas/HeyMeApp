import { environment } from '../../environments/environment';
export const URL_SERVICIOS = environment.url;
export const REMOTE_IMAGE_URL = environment.remoteImgUrl;
export const PAYPAL_CLIENT_ID = environment.paypalClientId;

export const USUARIO_STORAGE = 'usuario';
export const TOKEN_STORAGE = 'token';
export const ID_USUARIO_STORAGE = 'id';
export const PERMISOS = 'permisos';

export const CANAL_SMS = 1;
export const CANAL_EMAIL = 2;
export const CANAL_WHATSAPP = 3;

export const SPECIAL_KEYS = ['Shift', 'Meta', 'Backspace', 'CapsLock', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];

export const ID_PAIS_GT = 1;

export const OPCION_CONTACTOS = 'Contactos';
export const OPCION_PLANTILLAS = 'Plantillas de notificaciones';
export const OPCION_NOTIFICACION = '';
export const OPCION_PROGRAMAR_NOTIFICACION = 'Programar notificacion';
export const OPCION_EMPRESA_INFO = 'Empresa';
export const OPCION_USUARIO = 'Usuarios';
export const OPCION_DASHBOARD = 'Dashboard';

export const ESTADO_USUARIO_ACTIVO = 1;
export const ESTADO_USUARIO_INACTIVO = 2;
export const ESTADO_USUARIO_BLOQUEADO = 3;
