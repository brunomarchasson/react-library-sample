import {FC} from 'react'
export type fileType= string | Ifile

export interface Ifile {
    type?: string;
}

export interface Isource {
  type: string;
  data?: any;
  uri?: string | Promise<string>;
}

export interface IPlugin{
  match (source:Isource): boolean;
  viewer: FC<PluginProps>
}

export interface PluginProps {
  source: Isource
}