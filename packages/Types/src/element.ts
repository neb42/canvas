import { GridLayout } from './grid';
import { FlexLayout } from './flex';
import { TStyle } from './style';

export interface Dependencies {
  queries: string[];
  serverFunctions: string[];
  clientFunctions: string[];
  widgets: string[];
}

export interface Widget {
  id: string;
  type: 'widget';
  name: string;
  parent: string;
  component: string;
  library: string;
  dependencies: Dependencies;
  props: { [key: string]: any };
  position: number;
  style: TStyle;
}

export type Layout = GridLayout | FlexLayout;

export interface Page {
  id: string;
  type: 'page';
  name: string;
  props: { [key: string]: any };
}

export interface IOverlay {
  id: string;
  type: 'overlay';
  overlayType: 'modal' | 'drawer';
  name: string;
}

export type Element = Page | IOverlay | Layout | Widget;

export interface ElementTreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'layout' | 'widget';
  element: Element;
  children: ElementTreeNode[];
}
