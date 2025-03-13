import { ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  name: string;
  component?: ComponentType;
  children?: RouteConfig[];
  key: string;
}
