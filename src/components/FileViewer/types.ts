export type fileType= string | Ifile
export interface Ifile {
    type?: string;
}

export interface sourceType {
  type: string;
  data?: any;
  uri?: string | Promise<string>;
}
