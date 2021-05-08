import { Widget, CustomComponentInstance } from '@ui-studio/types';
import { UPDATE_ROOT_STYLE, UPDATE_WIDGET_STYLE } from 'actions/tree/styles';
import { ADD_WIDGET_EVENT, UPDATE_WIDGET_EVENT, REMOVE_WIDGET_EVENT } from 'actions/tree/event';
import { UPDATE_WIDGET_LAYOUT_CONFIG, UPDATE_WIDGET_LAYOUT_TYPE } from 'actions/tree/layout';
import { ADD_ROOT, REMOVE_ROOT } from 'actions/tree/root';
import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGET_PROPS,
  UPDATE_WIDGET_PARENT,
  UPDATE_WIDGET_POSITION,
} from 'actions/tree/widget';
import { UPDATE_ROOT_NAME, UPDATE_WIDGET_NAME } from 'actions/tree/name';
import { REMOVE_VARIABLE, RemoveVariable } from 'actions/variable';
import { INIT_CLIENT } from 'actions/tree/init';
import { Action$Tree } from 'actions/tree';
import { Store$Tree, KeyedObject } from 'types/store';
import { LayoutModel } from 'models/layout';
import { StylesModel } from 'models/styles';
import { WidgetModel } from 'models/widget';

const initialState: Store$Tree = {};

export const tree = (
  state: Store$Tree = initialState,
  action: Action$Tree | RemoveVariable,
): Store$Tree => {
  switch (action.type) {
    case ADD_ROOT: {
      return {
        ...state,
        [action.payload.id]: {
          root: action.payload,
          widgets: {},
        },
      };
    }
    case REMOVE_ROOT: {
      const { [action.payload]: _, ...remaining } = state;
      return remaining;
    }
    case UPDATE_ROOT_NAME: {
      const { rootId, name } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          root: {
            ...state[rootId].root,
            name,
          },
        },
      };
    }
    case UPDATE_ROOT_STYLE: {
      const { rootId, style } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          root: {
            ...state[rootId].root,
            style,
          },
        },
      };
    }

    case ADD_WIDGET: {
      const { rootId, widget } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widget.id]: widget,
          },
        },
      };
    }
    case REMOVE_WIDGET: {
      const { rootId, widgetId, parent, position, delete: del } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: Object.keys(state[rootId].widgets).reduce((acc, cur) => {
            const current = state[rootId].widgets[cur];
            if (current.id === widgetId) {
              if (del) return acc;
              return {
                ...acc,
                [cur]: {
                  ...current,
                  position: null,
                  parent: null,
                },
              };
            }
            return {
              ...acc,
              [cur]: {
                ...current,
                position:
                  current.parent === parent && current.position > position
                    ? current.position - 1
                    : current.position,
              },
            };
          }, {}),
        },
      };
    }
    case UPDATE_WIDGET_NAME: {
      const { rootId, widgetId, name } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              name,
            },
          },
        },
      };
    }
    case UPDATE_WIDGET_STYLE: {
      const { rootId, widgetId, style } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              style,
            },
          },
        },
      };
    }

    case UPDATE_WIDGET_PROPS: {
      const { rootId, widgetId, key, prop } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              props: {
                ...state[rootId].widgets[widgetId].props,
                [key]: prop,
              },
            },
          },
        },
      };
    }

    case ADD_WIDGET_EVENT: {
      const { rootId, widgetId, eventKey, event } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              events: {
                ...state[rootId].widgets[widgetId].events,
                [eventKey]: [...state[rootId].widgets[widgetId].events[eventKey], event],
              },
            },
          },
        },
      };
    }
    case UPDATE_WIDGET_EVENT: {
      const { rootId, widgetId, eventKey, index, event } = action.payload;
      const events = state[rootId].widgets[widgetId].events[eventKey];
      events[index] = event;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              events: {
                ...state[rootId].widgets[widgetId].events,
                [eventKey]: events,
              },
            },
          },
        },
      };
    }
    case REMOVE_WIDGET_EVENT: {
      const { rootId, widgetId, eventKey, index } = action.payload;
      const events = state[rootId].widgets[widgetId].events[eventKey];
      events.splice(index, 1);
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              events: {
                ...state[rootId].widgets[widgetId].events,
                [eventKey]: events,
              },
            },
          },
        },
      };
    }

    case UPDATE_WIDGET_LAYOUT_CONFIG: {
      const { rootId, widgetId, layout } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              layout,
            },
          },
        },
      };
    }
    case UPDATE_WIDGET_LAYOUT_TYPE: {
      const { rootId, widgetId, layoutType } = action.payload;
      const widget = {
        ...state[rootId].widgets[widgetId],
        layout: LayoutModel.getDefaultLayout(layoutType),
      };
      const widgets = Object.keys(state[rootId].widgets).reduce((acc, cur) => {
        if (cur === widgetId) {
          return {
            ...acc,
            [cur]: widget,
          };
        }
        if (state[rootId].widgets[widgetId].parent === widgetId) {
          return {
            ...acc,
            [cur]: {
              ...state[cur],
              style: StylesModel.getDefaultStyle(widget),
            },
          };
        }
        return {
          ...acc,
          [cur]: state[rootId].widgets[widgetId],
        };
      }, {});
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets,
        },
      };
    }

    case UPDATE_WIDGET_PARENT: {
      const { rootId, widgetId, parentId, position } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets: {
            ...state[rootId].widgets,
            [widgetId]: {
              ...state[rootId].widgets[widgetId],
              parent: parentId,
              position,
            },
          },
        },
      };
    }
    case UPDATE_WIDGET_POSITION: {
      const { rootId, widgetId, source, destination, style } = action.payload;
      const widgets = Object.keys(state[rootId].widgets).reduce((acc, cur) => {
        const widget = WidgetModel.updatePosition(
          state[rootId].widgets[cur],
          widgetId,
          source,
          destination,
          style,
        );
        return {
          ...acc,
          [cur]: widget,
        };
      }, {});
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          widgets,
        },
      };
    }

    case REMOVE_VARIABLE: {
      const doProps = (props: Widget['props']) =>
        Object.keys(props).reduce((acc, cur) => {
          const currentProp = props[cur];
          if (currentProp.mode === 'variable' && currentProp.variableId === action.payload) {
            return {
              mode: 'static',
              type: 'string',
              value: '',
            };
          }
          return { ...acc, [cur]: currentProp };
        }, {});

      const doWidgets = (widgets: KeyedObject<Widget | CustomComponentInstance>) =>
        Object.keys(widgets).reduce((acc, cur) => {
          const current = widgets[cur];
          return {
            ...acc,
            [cur]: {
              ...current,
              props: doProps(current.props),
            },
          };
        }, {});

      return Object.keys(state).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: {
            ...state[cur],
            widgets: doWidgets(state[cur].widgets),
          },
        };
      }, {});
    }

    case INIT_CLIENT: {
      return action.payload.tree;
    }
    default:
      return state;
  }
};
