export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: 'user/Login',
            exact: true,
          },
        ],
      },
    ],
  },
  {
    path: '/exception',
    component: 'Exception',
  },
  {
    path: '/',
    component: 'Home',
    menuRender: false,
    hideInMenu: true,
    exact: true,
  },
  {
    component: './404',
  },
];
