const ExcelJS = require("exceljs");

const scrapeCategory = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      const arrayA = [];
      let page = await browser.newPage();
      console.log(">> Mở tab mới...");

      await page.goto(url);
      await page.waitForTimeout(2000);

      const ele = await page.waitForXPath(
        `//*[@id="td-outer-wrap"]/div[2]/div/div[2]/div/footer/div/div[2]/div`
      );

      await page.evaluate((pageItem) => pageItem.scrollIntoView(), ele);
      await page.waitForTimeout(40000);

      const str = await page.evaluate(() => {
        return document.querySelector(
          `#td-outer-wrap > div.main-content > div > div.main-center > div.search-profile-component > div.m-container.advance-filter-box > p`
        ).innerText;
      });
      const strNum = str.split(" ");
      const numberString = strNum[1];
      const result = parseInt(numberString, 10);
      console.log(result);
      for (let i = 1; i < 4; i++) {
        await page.click(
          `#td-outer-wrap > div.main-content > div > div.main-center > div.search-profile-component > div.m-container.list-data-view.hasDialog > div.profile-list-data > div:nth-child(${i}) > a`
        );
        await page.waitForTimeout(5000);
        const id = await page.evaluate(() => {
          return document
            .querySelectorAll(".profile-detail")[0]
            .getAttribute("id");
        });
        console.log(id);

        const nameCompany = await page.evaluate(() => {
          return document.querySelector(
            `div.header-section > div.left-side > div.name-box > p`
          ).innerText;
        });
        console.log(nameCompany);

        // const address = await page.evaluate(() => {
        //   return document.querySelector(
        //     `#profile-detail-233 > div.profile-container.container > div.header-section > div.left-side > div.name-box > div.p-address`
        //   ).innerText;
        // });
        // console.log(address);

        // const phone = await page.evaluate(() => {
        //   return document.querySelector(
        //     `#profile-detail-233 > div.profile-container.container > div.header-section > div.right-side > p.p-phoneno`
        //   ).innerText;
        // });
        // console.log(phone);

        // const email = await page.evaluate(() => {
        //   return document.querySelector(
        //     `#profile-detail-233 > div.profile-container.container > div.header-section > div.right-side > p.p-email`
        //   ).innerText;
        // });
        // console.log(email);

        // const webiste = await page.evaluate(() => {
        //   return document.querySelector(
        //     `#profile-detail-233 > div.profile-container.container > div.header-section > div.right-side > p.p-website`
        //   ).innerText;
        // });
        // console.log(webiste);

        // const facebook = await page.evaluate(() => {
        //   return document.querySelector(
        //     `#profile-detail-233 > div.profile-container.container > div.header-section > div.right-side > p.p-fanpage`
        //   ).innerText;
        // });
        // console.log(facebook);
        await page.waitForTimeout(5000);
        await page.goBack();
        await page.waitForTimeout(5000);
      }

      //   const workbook = new ExcelJS.Workbook();
      //   const worksheet = workbook.addWorksheet("Sheet1");
      //   worksheet.columns = [
      //     { header: "Mã giao dịch", key: "tradingCode", width: 20 },
      //     { header: "Tờ khai/Phụ lục", key: "declaration", width: 20 },
      //     { header: "Kỳ tính thuế", key: "taxPeriod", width: 20 },
      //     { header: "Loại tờ khai", key: "typeOfDeclaration", width: 20 },
      //     { header: "Lần nộp", key: "numberOfSubmissions", width: 20 },
      //     { header: "Lần bổ sung", key: "numberOfAdditions", width: 20 },
      //     { header: "Ngày nộp", key: "dateOfApplication", width: 20 },
      //     { header: "Nơi nộp", key: "placeOfSubmission", width: 20 },
      //     { header: "Trạng thái", key: "status", width: 20 },
      //   ];
      //   arrayA.forEach((row) => {
      //     worksheet.addRow(row);
      //   });
      //   workbook.xlsx.writeFile("data.xlsx").then(() => {
      //     console.log("Đã xuất tệp Excel thành công");
      //   });
      //   resolve();
    } catch (error) {
      console.log("Lỗi ở scrape category: " + error);
      reject(error);
    }
  });

module.exports = {
  scrapeCategory,
};
