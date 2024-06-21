import puppeteer, { Browser, Page } from 'puppeteer';

import { LoginCredentials } from '../types/Credential';

export const loginQuarzo = async (url: string, credentials: LoginCredentials): Promise<string> => {
  const browser: Browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  try {
    await page.goto(url, { 
        waitUntil: 'networkidle2'
     });

     const USERNAME_SELECTOR: string = 'input[name="usuario"]';
     const PASSWORD_SELECTOR: string = 'input[name="clave"]';
     const LOGIN_BUTTON_SELECTOR: string = 'button[type="submit"]';

    await page.type(USERNAME_SELECTOR, credentials.username);
    await page.type(PASSWORD_SELECTOR, credentials.password);


    await Promise.all([
      page.click(LOGIN_BUTTON_SELECTOR),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    const html: string = await page.content();
    return html;
  } catch (error) {
    console.error('Error logeandose', error);
    throw error;
  } finally {
    await browser.close();
  }
};


