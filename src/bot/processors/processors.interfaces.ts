import { TableContentObjects } from "./processors.types";


export interface ITableContentProcessor{
    process():Promise<TableContentObjects>;
} 
