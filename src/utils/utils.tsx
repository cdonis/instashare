import { getColumnSearchProps, formatNumber, getSummaryRow } from './forTables';
import { RequestResponse } from 'umi-request';
import { message, Modal } from 'antd';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/**
 * Transforma una fecha dada como cadena u objeto Date en el formato de salida especificado
 * @author Carlos Donis <cdonisdiaz@gmail.com>
 * @param date    (string | Date): Cadena o fecha original de la cual se desea obtener la nueva cadena formateada
 * @param format  (string):        Formato de salida deseado. Subcadenas aceptadas:
 *                                "DD" (dia), "MM" (mes), "YYYY" (año), "h" (hora), "i" (minutos), "s" (segundos)
 *                                Ejemplos: "DD-MM-YYYY", "DD-MM-YYYY h:i:s"
 * @returns       string | undefined
 */
export const formatDate = (date: string | Date, format: string): string | undefined => {
  let newDate: Date | number = 0;

  if (typeof date === 'string') {
    // Validación que el string de entrada tenga un formato de fecha válido
    const dateInMilliseconds = Date.parse(date);
    if (!isNaN(dateInMilliseconds)) {
      newDate = new Date(dateInMilliseconds);
    } else return undefined;
  } else {
    // Validación de que la fecha proporcionada sea válida
    if (date instanceof Date) {
      newDate = date;
    } else return undefined;
  }

  format = format.replace('DD', ('0' + newDate.getUTCDate()).slice(-2)); // Dia
  format = format.replace('MM', ('0' + (newDate.getUTCMonth() + 1)).slice(-2)); // Mes
  format = format.replace('YYYY', ('0' + newDate.getUTCFullYear()).slice(-4)); // Año
  format = format.replace('h', ('0' + newDate.getUTCHours()).slice(-2)); // Horas
  format = format.replace('i', ('0' + newDate.getUTCMinutes()).slice(-2)); // Minutos
  format = format.replace('s', ('0' + newDate.getUTCSeconds()).slice(-2)); // Segundos

  return format;
};

/**
 * @author Carlos Donis <cdonisdiaz@gmail.com>
 * @param number length
 * @returns string Cadena aleatoria formada por caracteres y números
 */
export const getRandomString = (length: number): string => {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

export { getColumnSearchProps, formatNumber, getSummaryRow };

/*
  Función con el comportamiento en el then de una petición para descarga de archivos
*/
export const downloadFileTrait = (res: RequestResponse, filename?: string) => {
  const blob = res.data;
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);

  // Inicializa con el nombre del parámetro
  let filenameX = filename;

  // Si no tengo nombre trato de capturar el de la cabecera de respuesta de la petición
  // Sacado de stackoverflow
  if (!filenameX) {
    const disposition = res.response.headers.get('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filenameX = matches[1].replace(/['"]/g, '');
      }
    }
  }

  // Si aún no hay nombre pongo uno x defecto, este caso no se debería dar
  if (!filenameX) {
    filenameX = 'documento-adjunto';
  }

  link.download = filenameX;
  link.click();
};

export const handleCatchErrorForm = (error: any) => {
  if (error.data.errorCode === '422') {
    const errors = error.data.data.errors;
    let errorMessages = `Errores detectados: \n`;
    Object.keys(error.data.data.errors).forEach((field) => {
      errorMessages += '- ' + errors[field][0] + `\n`;
    });
    errorMessages += `\n Por favor, modifique los datos introducidos e inténtelo nuevamente.`;
    Modal.error({
      centered: true,
      width: 'lg',
      title:
        'No fue posible realizar la acción sobre el elemento, existen errores en los datos proporcionados',
      content: <span style={{ whiteSpace: 'pre-line' }}>{errorMessages}</span>,
    });
    return;
  }

  if (error.data.errorCode === '409') {
    const contentText =
      'El elemento que intenta eliminar está siendo utilizado por otro recurso.\n' +
      'Por favor, elimine primero esta dependencia e intente nuevamente la operación.';
    Modal.error({
      centered: true,
      width: 'lg',
      title: 'Ocurrió un error durante la operación',
      content: <span style={{ whiteSpace: 'pre-line' }}>{contentText}</span>,
    });
    return;
  }
  message.error('No fue posible realizar la acción sobre el elemento. Inténtelo nuevamente.');
};
