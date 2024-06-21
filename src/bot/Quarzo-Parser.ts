import cheerio from 'cheerio';


export const get_Info_titulo = (html: string): string => {
    const $ = cheerio.load(html);
    const h3Text = $('div.col-sm-7 > h3').text();
    return h3Text;
  };
  