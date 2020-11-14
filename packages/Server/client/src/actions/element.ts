import { TInitFunctions } from '@ui-builder/types';
import { IComponent } from 'types/store';

export const UPDATE_ELEMENT_NAME = 'UPDATE_ELEMENT_NAME';
export const SELECT_PAGE = 'SELECT_PAGE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const TOGGLE_ADD_ELEMENT_MODAL = 'TOGGLE_ADD_ELEMENT_MODAL';
export const INIT_FUNCTIONS = 'INIT_FUNCTIONS';
export const INIT_COMPONENTS = 'INIT_COMPONENTS';

export interface IUpdateElementName {
  type: 'UPDATE_ELEMENT_NAME';
  payload: {
    id: string;
    type: 'widget' | 'layout' | 'page' | 'overlay';
    name: string;
  };
}

export const updateElementName = (
  id: string,
  type: 'widget' | 'layout' | 'page' | 'overlay',
  name: string,
): IUpdateElementName => {
  return {
    type: UPDATE_ELEMENT_NAME,
    payload: {
      id,
      name,
      type,
    },
  };
};

interface ISelectPage {
  type: 'SELECT_PAGE';
  payload: string;
}

export const selectPage = (name: string): ISelectPage => ({
  type: SELECT_PAGE,
  payload: name,
});

interface ISelectElement {
  type: 'SELECT_ELEMENT';
  payload: string;
}

export const selectElement = (name: string): ISelectElement => ({
  type: SELECT_ELEMENT,
  payload: name,
});

interface IToggleAddElementModal {
  type: 'TOGGLE_ADD_ELEMENT_MODAL';
}

export const toggleAddElementModal = (): IToggleAddElementModal => ({
  type: TOGGLE_ADD_ELEMENT_MODAL,
});

interface IInitFunctions {
  type: 'INIT_FUNCTIONS';
  payload: TInitFunctions;
}

export const initFunctions = (functions: TInitFunctions): IInitFunctions => ({
  type: INIT_FUNCTIONS,
  payload: functions,
});

interface IInitComponents {
  type: 'INIT_COMPONENTS';
  payload: IComponent[];
}

export const initComponents = (components: IComponent[]): IInitComponents => ({
  type: INIT_COMPONENTS,
  payload: components,
});

export type Action$Element =
  | ISelectPage
  | ISelectElement
  | IUpdateElementName
  | IToggleAddElementModal
  | IInitFunctions
  | IInitComponents;
