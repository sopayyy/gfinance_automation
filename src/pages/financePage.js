import { expect } from '@playwright/test';

export class FinancePage {
    constructor(page) {
        this.page = page;
        this.searchBox = page.locator('.d1dlne input[type="text"]');
        this.ytdButton = page.locator('span[jsname="V67aGc"]:has-text("YTD")'); 
        // this.circle = page.locator('.eLYY7'); 
    }
    async goto() {
        await this.page.goto('https://www.google.com/finance');
    }
    async searchForStock(keyword) {
      await this.page.waitForLoadState();
      await this.searchBox.last().click();
      await this.searchBox.last().fill(keyword);
      await this.searchResult(keyword).waitFor();
      await this.searchResult(keyword).first().click();
    }
    searchResult(keyword) {
      return this.page.locator(`div[data-symbol="${keyword}"]`);
    }
    async verifyStockPageLoaded(ticker) {
        await expect(this.page).toHaveURL(new RegExp(`quote/${ticker}`));
    }
    async todayHighValues() {
        let highestValue = 0;
        for (let cx = 70; cx <= 80; cx++) { //value actual was cx=0 until 200 - but will takes a long time so I trim manual
            await this.page.evaluate((cxValue) => {

                const circle = document.querySelector('.eLYY7');
                const line = document.querySelector('.IThbXb');
                if (circle) {
                    line.setAttribute('x1', cxValue);
                    line.setAttribute('x2', cxValue);
                    circle.setAttribute('cx', cxValue);
                }
            }, cx);
        console.log(cx);
        const circleLocator = this.page.locator('.eLYY7');
        const circleBox = await circleLocator.boundingBox();
        if (circleBox) {
            await this.page.mouse.move(circleBox.x + circleBox.width / 2, circleBox.y + circleBox.height / 2);
        }
        await this.page.waitForTimeout(1000);
        const circlevalueText = await this.page.textContent('p[jsname="BYCTfd"]');
        console.log(circlevalueText);
        if (circlevalueText) {
            const numericValue = parseFloat(circlevalueText.replace(/[^\d.-]+/g, '')); 
            if (!isNaN(numericValue) && numericValue > highestValue) {
                highestValue = numericValue;
            }
        }
    }
    console.log(`highest today value IDR Rp${highestValue}`);
    return highestValue;

    }
    async ytdHighValues() {
        let highestValue = 0;
        for (let cx = 4; cx <= 20; cx++) { //value actual was cx=0 until 200 - but will takes a long time so I trim manual 
            await this.page.evaluate((cxValue) => {

                const circle = document.querySelector('.eLYY7');
                const line = document.querySelector('.IThbXb');
                if (circle) {
                    line.setAttribute('x1', cxValue);
                    line.setAttribute('x2', cxValue);
                    circle.setAttribute('cx', cxValue);
                }
            }, cx);
        console.log(cx);
        const circleLocator = this.page.locator('.eLYY7');
        const circleBox = await circleLocator.boundingBox();
        if (circleBox) {
            await this.page.mouse.move(circleBox.x + circleBox.width / 2, circleBox.y + circleBox.height / 2);
        }
        // await this.page.waitForTimeout(1000);
        const circlevalueText = await this.page.textContent('p[jsname="BYCTfd"]');
        console.log(circlevalueText);
        if (circlevalueText) {
            const numericValue = parseFloat(circlevalueText.replace(/[^\d.-]+/g, '')); 
            if (!isNaN(numericValue) && numericValue > highestValue) {
                highestValue = numericValue;
            }
        }
    }
    console.log(`highest YTD value IDR Rp${highestValue}`);
    return highestValue;

    }
    async compareValue(highestTodayValue,highestYtdValue){
        if (highestYtdValue > highestTodayValue) {
            console.log(`The highest YTD value (IDR Rp${highestYtdValue}) is greater than today's highest value (IDR Rp${highestTodayValue}).`);
        } else if (highestYtdValue < highestTodayValue) {
            console.log(`Today's highest value (IDR Rp${highestTodayValue}) is greater than the highest YTD value (IDR Rp${highestYtdValue}).`);
        } else {
            console.log(`Today's highest value (IDR Rp${highestTodayValue}) is equal to the highest YTD value (IDR Rp${highestYtdValue}).`);
        }
    }
}
