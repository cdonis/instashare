// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from 'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';

export function getRoutes() {
  const routes = [
  {
    "path": "/umi/plugin/openapi",
    "component": dynamic({ loader: () => import(/* webpackChunkName: '.umi__plugin-openapi__openapi' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/.umi/plugin-openapi/openapi.tsx'), loading: LoadingComponent})
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: '.umi__plugin-layout__Layout' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/.umi/plugin-layout/Layout.tsx'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/~demos/:uuid",
        "layout": false,
        "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/node_modules/@umijs/preset-dumi/lib/theme/layout'), loading: LoadingComponent})],
        "component": (props) => React.createElement(
        dynamic({
          loader: async () => {
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ 'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi-theme-default/es/builtins/Previewer.js');
            const { default: demos } = await import(/* webpackChunkName: 'dumi_demos' */ '@@/dumi/demos');
            const { usePrefersColor } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              
      const renderArgs = getDemoRenderArgs(props, demos);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
            }
          }
        }), props)
      },
      {
        "path": "/_demos/:uuid",
        "redirect": "/~demos/:uuid"
      },
      {
        "__dumiRoot": true,
        "layout": false,
        "path": "/~docs",
        "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/node_modules/@umijs/preset-dumi/lib/theme/layout'), loading: LoadingComponent}), dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/node_modules/dumi-theme-default/es/layout.js'), loading: LoadingComponent})],
        "routes": [
          {
            "path": "/~docs",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'README.md' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/README.md'), loading: LoadingComponent}),
            "exact": true,
            "meta": {
              "locale": "en-US",
              "order": null,
              "filePath": "README.md",
              "updatedTime": 499162500000,
              "componentName": "instashare",
              "slugs": [
                {
                  "depth": 1,
                  "value": "Ant Design Pro",
                  "heading": "ant-design-pro"
                },
                {
                  "depth": 2,
                  "value": "Environment Prepare",
                  "heading": "environment-prepare"
                },
                {
                  "depth": 2,
                  "value": "Provided Scripts",
                  "heading": "provided-scripts"
                },
                {
                  "depth": 3,
                  "value": "Start project",
                  "heading": "start-project"
                },
                {
                  "depth": 3,
                  "value": "Build project",
                  "heading": "build-project"
                },
                {
                  "depth": 3,
                  "value": "Check code style",
                  "heading": "check-code-style"
                },
                {
                  "depth": 3,
                  "value": "Test code",
                  "heading": "test-code"
                },
                {
                  "depth": 2,
                  "value": "More",
                  "heading": "more"
                }
              ],
              "title": "Ant Design Pro"
            },
            "title": "Ant Design Pro"
          }
        ],
        "title": "instashare",
        "component": (props) => props.children
      },
      {
        "path": "/user",
        "layout": false,
        "routes": [
          {
            "path": "/user",
            "routes": [
              {
                "name": "login",
                "path": "/user/login",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__Login' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/pages/user/Login'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          }
        ]
      },
      {
        "path": "/exception",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Exception' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/pages/Exception'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/index.html",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Files' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/pages/Files'), loading: LoadingComponent}),
        "menuRender": false,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Files' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/pages/Files'), loading: LoadingComponent}),
        "menuRender": false,
        "hideInMenu": true,
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'D:/Work/Cuban Engineers/Recruitment process/Technical test/Application/instashare/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
