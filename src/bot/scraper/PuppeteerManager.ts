import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer"

export class PuppeteerManager {

    private static instance: PuppeteerManager
    private browser: Browser | undefined; 
    private page: Page | undefined; 
    private options: PuppeteerLaunchOptions | undefined;
    private constructor(){}

    public static getInstance(): PuppeteerManager{
            if(!PuppeteerManager.instance){
                PuppeteerManager.instance = new PuppeteerManager();
            }
            return PuppeteerManager.instance;
    }

    public async initialize(options?: PuppeteerLaunchOptions): Promise<void>{
        if(!options){
            this.options = {headless: true};
        }
        this.options = options as PuppeteerLaunchOptions;
        if(!this.browser){
            this.browser = await puppeteer.launch(this.options);
        }
        if(!this.page){
            this.page = await this.browser.newPage();
        }
    }

    public getPage(): Page {
        if(!this.page){
            throw new Error("the puppeteerManager must be initialized before utilizing");
        }
        return this.page;
    }

    public async close(): Promise<void> {
        if(!this.browser){
            return;
        }
        await this.browser.close();
        this.browser = undefined;
        this.page = undefined;
    }
}