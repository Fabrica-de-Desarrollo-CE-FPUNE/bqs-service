import cheerio, {CheerioAPI, Element } from "cheerio";
import { ITableContentProcessor } from "./processors.interfaces";
import { TableContent, TableContentObjects } from "./processors.types";

//se encarga de processar los <table></table> del consultor y extraerlos en su form 'raw'
export class ConsultorTableProcessor implements ITableContentProcessor{

    private selector: CheerioAPI;
    constructor(htmlpage:string){
        this.selector = cheerio.load(htmlpage);
    }
    private extractConsultorTables(table: Element): TableContent {
        const headers: string[] = [];
        const rows: string[][] = [];
      
        this.selector(table).find("tr").each((rowIndex, row) => {
          const cells: string[] = [];
          this.selector(row).find("th, td").each((_, cell) => {
            const $cell = this.selector(cell);
            const text = $cell.text().trim();
            const $anchor = $cell.find('a');
            if ($anchor.length > 0 && $anchor.attr('href')) {
              const link = $anchor.attr('href')!;
              cells.push(`${link}`);
            } else {
              cells.push(text);
            }
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
            //todo: mejorar la logica...
            if(index>1){
                let offset = (index-2)+1;
                let tableContent : TableContent;
                tableContent = this.extractConsultorTables(table);
                if(index === 7 || index === 8){
                  this.postProcessSpecialCase(tableContent);
                }
                if(index === 10){
                    tableContent = this.extractConsultorTables(table);
                }
                tablesobjs[`table${offset}`] = tableContent;
                
            }
          
        });
        return tablesobjs;
    }

    private postProcessSpecialCase (content: TableContent){

        if (content.rows.length > 0) {
            content.headers = content.rows.shift()!;
        }
    }
}