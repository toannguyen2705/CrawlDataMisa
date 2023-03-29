const ExcelJS = require("exceljs");

const scrapeCategory = async (browser, url, urlCompany) =>
  new Promise(async (resolve, reject) => {
    try {
      if (urlCompany) {
        const arrayA = [];
        let newPage = await browser.newPage();
        await newPage.waitForTimeout(2000);
        await newPage.goto(`https://asp.misa.vn//${urlCompany}`);

        await newPage.waitForTimeout(5000);

        await newPage.waitForSelector(".profile-detail");

        const id = await newPage.$$eval(".profile-detail", (el) =>
          el.map((x) => x.getAttribute("id"))
        );

        const nameCompany = await newPage.evaluate(
          (idxParams) => {
            return document.querySelector(
              `#${idxParams.idx} > div.profile-container.container > div.header-section > div.left-side > div.name-box > p`
            ) !== null
              ? document.querySelector(
                  `#${idxParams.idx} > div.profile-container.container > div.header-section > div.left-side > div.name-box > p`
                ).innerText
              : "";
          },
          { idx: id[0] }
        );

        const address = await newPage.evaluate(
          (idxParams) => {
            return document.querySelector(
              `#${idxParams.idx} > div.profile-container.container > div.header-section > div.left-side > div.name-box > div.p-address`
            ) !== null
              ? document.querySelector(
                  `#${idxParams.idx} > div.profile-container.container > div.header-section > div.left-side > div.name-box > div.p-address`
                ).innerText
              : "";
          },
          { idx: id[0] }
        );

        const phone = await newPage.evaluate(
          (idxParams) => {
            return document.querySelector(
              `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-phoneno`
            ) !== null
              ? document.querySelector(
                  `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-phoneno`
                ).innerText
              : "";
          },
          { idx: id[0] }
        );

        const email = await newPage.evaluate(
          (idxParams) => {
            return document.querySelector(
              `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-email`
            )
              ? document.querySelector(
                  `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-email`
                ).innerText
              : "";
          },
          { idx: id[0] }
        );

        const website = await newPage.evaluate(
          (idxParams) => {
            return document.querySelector(
              `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-website`
            ) !== null
              ? document.querySelector(
                  `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-website`
                ).innerText
              : "";
          },
          { idx: id[0] }
        );

        const facebook = await newPage.evaluate(
          (idxParams) => {
            return document.querySelector(
              `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-fanpage`
            ) !== null
              ? document.querySelector(
                  `#${idxParams.idx} > div.profile-container.container > div.header-section > div.right-side > p.p-fanpage`
                ).innerText
              : "";
          },
          { idx: id[0] }
        );

        arrayA.push({
          nameCompany: nameCompany,
          address: address,
          phone: phone,
          email: email,
          website: website,
          facebook: facebook,
        });
        await newPage.waitForTimeout(2000);
        await newPage.close();

        return resolve(arrayA);
      }
      let infoCompany = [];
      let page = await browser.newPage();
      console.log(">> Mở tab mới...");

      await page.goto(url);
      await page.waitForTimeout(2000);

      const ele = await page.waitForXPath(
        `//*[@id="td-outer-wrap"]/div[2]/div/div[2]/div/footer/div/div[2]/div`
      );

      await page.evaluate((pageItem) => pageItem.scrollIntoView(), ele);
      await page.waitForTimeout(500);

      const str = await page.evaluate(() => {
        return document.querySelector(
          `#td-outer-wrap > div.main-content > div > div.main-center > div.search-profile-component > div.m-container.advance-filter-box > p`
        ).innerText;
      });

      const strNum = str.split(" ");
      const numberString = strNum[1];
      const result = parseInt(numberString, 10);

      const hrefs = await page.$$eval(
        ".profile-list-data .profile-item-row a",
        (el) => el.map((x) => x.getAttribute("href"))
      );

      console.log({ hrefs });

      console.log(result);
      for (let i = 0; i < hrefs.length; i++) {
        const hrefCompany = hrefs[i].replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, "");
        const info = await scrapeCategory(browser, url, hrefCompany);
        infoCompany.push(info);
      }
      const in4 = infoCompany.flatMap((a1) => a1);
      console.log(in4);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      worksheet.columns = [
        { header: "Tên công ty", key: "nameCompany", width: 20 },
        { header: "Địa chỉ", key: "address", width: 20 },
        { header: "SĐT", key: "phone", width: 20 },
        { header: "Email", key: "email", width: 20 },
        { header: "Website", key: "website", width: 20 },
        { header: "Fanpage", key: "facebook", width: 20 },
      ];
      in4.forEach((row) => {
        worksheet.addRow(row);
      });
      workbook.xlsx.writeFile("data.xlsx").then(() => {
        console.log("Đã xuất tệp Excel thành công");
      });
      resolve();
    } catch (error) {
      console.log("Lỗi ở scrape category: " + error);
      reject(error);
    }
  });

module.exports = {
  scrapeCategory,
};
