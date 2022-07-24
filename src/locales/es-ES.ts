import component from './es-ES/component';
import globalHeader from './es-ES/globalHeader';
import menu from './es-ES/menu';
import pwa from './es-ES/pwa';
import settingDrawer from './es-ES/settingDrawer';
import settings from './es-ES/settings';
import pages from './es-ES/pages';
import admin from './es-ES/admin';
import common from './es-ES/common';
import clipro from './es-ES/clipro';
import audit from './es-ES/audit';
import core from './es-ES/core';
import contracts from './es-ES/contracts';

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
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...admin,
  ...common,
  ...clipro,
  ...audit,
  ...core,
  ...contracts,
};
