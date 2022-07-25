import globalHeader from './en-US/globalHeader';
import pwa from './en-US/pwa';
import settings from './en-US/settings';
import filesPage from './en-US/filesPage';
import common from './en-US/common';
import menu from './en-US/menu';
import uploadForm from './en-US/uploadForm';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...settings,
  ...pwa,
  ...common,
  ...menu,
  ...filesPage,
  ...uploadForm,
};
