import { useState, useCallback } from 'react';

/*
 * Ejemplo de layouts
 * layouts = {
 *    b6d948de-cae5-11eb-bdb6-3c52823004a7: {   // uuid del módulo
 *      layout: [             // contiene un objeto por cada widget que pertenece al layout
 *        { i: string, x: number, y: number, w: number, h: number, minW: number, minH: number, maxW: number, maxH: number, ... },
 *        ...
 *      ]
 *      widgets: [            // contiene un objeto por cada widget que pertenece al módulo
 *        { i: string, name: string, desc: string, prototype: number, minW?: number, minH?: number, maxW?: number, maxH?: number},
 *        ...
 *      ]
 *      widgetsContent: [     // cotiene un objeto por cada widget que pertenece al layout
 *        { options: {}, values: {} },
 *        ...
 *      ]
 *    },
 *    c5a563ea-cae5-11eb-bdb6-3c52823004a7: { ... },
 *    ...
 * }
 */
export default () => {
  const [dashboards, setDashboards] = useState({});

  // Función para actualizar el layout de un modulo
  const setLayoutForModule = useCallback((layout: any[], original: boolean, module: string) => {
    setDashboards((prevDashboad) => {
      const widgets = prevDashboad[module] ? prevDashboad[module].widgets : undefined;
      const widgetsContent = prevDashboad[module] ? prevDashboad[module].widgetsContent : undefined;
      return {
        ...prevDashboad,
        [module]: {
          original,
          layout,
          widgets,
          widgetsContent,
        },
      };
    });
  }, []);

  // Función para actualizar los widgets de un modulo
  const setWidgetsForModule = useCallback((widgets: any[], module: string) => {
    setDashboards((prevDashboad) => {
      const layout = prevDashboad[module] ? prevDashboad[module].layout : undefined;
      const original = prevDashboad[module] ? prevDashboad[module].original : undefined;
      const widgetsContent = prevDashboad[module] ? prevDashboad[module].widgetsContent : undefined;
      return {
        ...prevDashboad,
        [module]: {
          original,
          layout,
          widgets,
          widgetsContent,
        },
      };
    });
  }, []);

  // Función para actualizar el contenido de los widgets del layout
  const setWidgetContent = useCallback(
    (content: API.WidgetRenderInfo, module: string, widget: string) => {
      // content: {options?: Object; values?: any}
      setDashboards((prevDashboad) => {
        const layout = prevDashboad[module] ? prevDashboad[module].layout : undefined;
        const original = prevDashboad[module] ? prevDashboad[module].original : undefined;
        const widgets = prevDashboad[module] ? prevDashboad[module].widgets : undefined;
        let widgetsContent = prevDashboad[module] ? prevDashboad[module].widgetsContent : undefined;
        if (widgetsContent) widgetsContent[widget] = content;
        else widgetsContent = { [widget]: content };
        return {
          ...prevDashboad,
          [module]: {
            original,
            layout,
            widgets,
            widgetsContent,
          },
        };
      });
    },
    [],
  );

  return {
    dashboards,
    setLayoutForModule,
    setWidgetsForModule,
    setWidgetContent,
  };
};
