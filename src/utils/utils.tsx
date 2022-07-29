import { getColumnSearchProps } from './forTables';
import { RequestResponse } from 'umi-request';
import { message, Modal } from 'antd';

export { getColumnSearchProps };

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
 * Transform a string or date and return a string representing a date with a desired output format
 * 
 * @param date    (string | Date): Original string or date
 * @param format  (string):        Output format. Accepted:
 *                                 "DD" (day), "MM" (month), "YYYY" (year), "h" (hour), "i" (minutes), "s" (seconds)
 *                                 Ex.: "DD-MM-YYYY", "DD-MM-YYYY h:i:s"
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
 * Transform a number to a decimal "en-us" locale format
 * 
 * @param number 
 * @param precision 
 * @returns string
 */
export const formatNumber = (
    number: number | bigint | undefined, 
    precision: number
  ): string => (number !== undefined && number !== null) 
      ? new Intl.NumberFormat("en-us", {style: 'decimal', useGrouping: true, minimumFractionDigits: precision}).format(number)
      : "-"

/**
 * Return a ramdom string
 * 
 * @param length String length
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

/**
 * Get blob from API request result and trigger browser download
*/
export const downloadFileTrait = (res: RequestResponse, filename?: string) => {
// Get blob from response
  const blob = res.data;
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  
  // If no filename, try to get it from response header
  let _filename = filename;
  if (! _filename) {
    const contentDisposition = res.response.headers.get('Content-Disposition');
    if (contentDisposition !== null) {
        _filename = contentDisposition.split('filename=')[1].split(';')[0];
    }
  }

  // Set name for the download
  link.download = _filename || 'myFile.zip';

  // Trigger browser download
  link.click();
};

export const handleCatchErrorForm = (error: any) => {
  if (error && error.data && error.data.errorCode === '422') {
    const errors = error.data.data;
    let errorMessages = `Detected errors: \n`;
    Object.keys(error.data.data).forEach((field) => {
      errorMessages += '- ' + errors[field][0] + `\n`;
    });
    errorMessages += `\n Please modify data and try again.`;
    Modal.error({
      centered: true,
      width: 'lg',
      title:
        'Request failed. Errors in input data were detected',
      content: <span style={{ whiteSpace: 'pre-line' }}>{errorMessages}</span>,
    });
    return;
  }

  if (error && error.data && error.data.errorCode === '409') {
    const contentText =
      'Resource can\'t be deleted, it is been used by other(s) resource(s).\n' +
      'Please remove dependency and try again.';
    Modal.error({
      centered: true,
      width: 'lg',
      title: 'Request error',
      content: <span style={{ whiteSpace: 'pre-line' }}>{contentText}</span>,
    });
    return;
  }

  message.error('An error ocurrs during request, please try again.');
};
