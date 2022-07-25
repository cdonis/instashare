import globalHeader from './es-ES/globalHeader';
import pwa from './es-ES/pwa';
import settings from './es-ES/settings';
import common from './es-ES/common';
import menu from './es-ES/menu';
import filesPage from './es-ES/filesPage';
import uploadForm from './es-ES/uploadForm';

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'Ayuda',
  'layout.user.link.privacy': 'Privacidad',
  'layout.user.link.terms': 'Terminos',
  'app.preview.down.block': 'Descargar esta página para tu proyecto local',
  'app.welcome.link.fetch-blocks': 'Obtener todos los bloques',
  'app.welcome.link.block-list':
    'Construye rápidamente páginas estandars basadas en desarrollo por `bloques`',
  ...globalHeader,
  ...settings,
  ...pwa,
  ...common,
  ...menu,
  ...filesPage,
  ...uploadForm,
};
