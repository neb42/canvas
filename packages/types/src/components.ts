export type BaseComponentConfig = {
  key: string;
  label: string;
  defaultValue: any;
} & (
  | { type: 'string' | 'number' | 'boolean'; iterable: false; list: false }
  | { type: 'string' | 'number' | 'boolean'; iterable: boolean; list: true }
  | { type: 'object'; iterable: boolean; list: boolean }
);

export type ComponentConfig$Input = BaseComponentConfig & {
  component: 'input';
};

export type ComponentConfig$Select = BaseComponentConfig & {
  component: 'select';
  options: { key: string | number | boolean; label: string }[];
} & (
    | { type: 'string'; options: { key: string; label: string }[] }
    | { type: 'number'; options: { key: number; label: string }[] }
    | { type: 'boolean'; options: { key: boolean; label: string }[] }
    | { type: 'object'; options: { key: string; label: string }[] }
  );

export type ComponentConfig$Complex = {
  key: string;
  label: string;
  component: 'complex';
  config: (ComponentConfig$Input | ComponentConfig$Select)[];
} & ({ list: true; iterable: boolean } | { list: false; iterable: false });

export type ComponentConfig =
  | ComponentConfig$Input
  | ComponentConfig$Select
  | ComponentConfig$Complex;

export type Component$Event = {
  key: string;
  label: string;
};

export interface Component {
  name: string;
  description: string;
  category: string;
  library: string;
  icon: string;
  hasChildren: boolean;
  hasLayout: boolean;
  exposedProperties: string[];
  events: Component$Event[];
  config: ComponentConfig[];
}
