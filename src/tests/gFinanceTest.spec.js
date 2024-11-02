import { expect, test } from '@playwright/test';
import { FinancePage } from '@/pages/financePage';
test('Search for a stock on Google Finance', async ({ page }) => {
    const financePage = new FinancePage(page);
    const stockSymbol = 'KAEF';
    await financePage.goto();
    await financePage.searchForStock(stockSymbol);
    await financePage.verifyStockPageLoaded(stockSymbol);

    const today = await financePage.todayHighValues()
    await financePage.ytdButton.click();
    const ytd = await financePage.ytdHighValues();
    await financePage.compareValue(today, ytd);   
});