
export interface TableContent {
    headers: string[];
    rows: string[][];
}
export interface TableContentObjects {
    [key: string]:TableContent;
}
