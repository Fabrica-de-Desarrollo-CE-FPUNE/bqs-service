import cheerio, {CheerioAPI, Element } from "cheerio";
import { ITableContentProcessor } from "./processors.interfaces";
import { TableContent, TableContentObjects } from "./processors.types";

//se encarga de processar los <table></table> del consultor y extraerlos en su form 'raw'
export class ConsultorTableProcessor implements ITableContentProcessor{

    private selector: CheerioAPI;
    constructor(htmlpage:string){
        this.selector = cheerio.load(htmlpage);
    }

    private extractConsultorTables(table: Element, tableIndex: number): TableContent{
        const headers: string[] = [];
        const rows: string[][] = [];
      
        this.selector(table).find("tr").each((rowIndex, row) => {
            const cells: string[] = [];
            this.selector(row).find("th, td").each((_, cell) => {
                cells.push(this.selector(cell).text().trim());
            });
            if (rowIndex === 0) {
              headers.push(...cells);
            } else {
              rows.push(cells);
            }
          });
          return { headers, rows };
    }
    public async process(): Promise<TableContentObjects> {
        const tablesobjs: TableContentObjects = {};
        this.selector('table').each((index, table) => {
            const tableContent = this.extractConsultorTables(table, index);
            tablesobjs[`table${index + 1}`] = tableContent;
        });
        return tablesobjs;
    }

}