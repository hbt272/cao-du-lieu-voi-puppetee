const scrapeCategory = async (browser, url) =>
	new Promise(async (resolve, reject) => {
		try {
			let page = await browser.newPage();
			await page.goto(url);
			await page.waitForSelector('#webpage');

			const dataCategory = await page.$$eval(
				'#navbar-menu > ul > li',
				(els) => {
					dataCategory = els.map((el) => {
						return {
							category: el.querySelector('a').innerText,
							link: el.querySelector('a').href,
						};
					});
					return dataCategory;
				},
			);

			resolve(dataCategory);
		} catch (error) {
			console.log('Loi o scrapeCatagory ' + error);
			reject(error);
		}
	});

const scraper = (browser, url) =>
	new Promise(async (resolve, reject) => {
		try {
			let newPage = await browser.newPage();

			await newPage.goto(url);

			await newPage.waitForSelector('#main');

			const scrapeData = {};

			//lay header
			const headerData = await newPage.$eval('header', (el) => {
				return {
					title: el.querySelector('h1').innerText,
					description: el.querySelector('p').innerText,
				};
			});

			scrapeData.header = headerData;

			//lay link detail item
			const detailLinks = await newPage.$$eval(
				'#left-col > section.section-post-listing > ul > li',
				(els) => {
					detailLinks = els.map((el) => {
						return el.querySelector('.post-meta h3 > a').href;
					});
					return detailLinks;
				},
			);

			const scraperDetail = async (link) =>
				new Promise(async (resolve, reject) => {
					try {
						let pageDetail = await browser.newPage();
						await pageDetail.goto(link);
						await pageDetail.waitForSelector('#main');

						const detailData = {};
						//bat dau cao
						//cao anh
						const images = await pageDetail.$$eval(
							'#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide',
							(els) => {
								images = els.map((el) => {
									return el.querySelector('img')?.src;
								});
								return images;
							},
						);

						detailData.images = images;

						//lay header detail
						const header = await pageDetail.$eval(
							'header.page-header',
							(el) => {
								return {
									title: el.querySelector('h1 > a').innerText,
									star: el
										.querySelector('h1 > span')
										?.className?.replace(/^\D+/g, ''),
									class: {
										content:
											el.querySelector('p').innerText,
										classType:
											el.querySelector('p > a > strong')
												.innerText,
									},
									address:
										el.querySelector('address').innerText,
									attributes: {
										price: el.querySelector(
											'div.post-attributes > .price > span',
										).innerText,
										acreage: el.querySelector(
											'div.post-attributes > .acreage > span',
										).innerText,
										published: el.querySelector(
											'div.post-attributes > .published > span',
										).innerText,
										hashtag: el.querySelector(
											'div.post-attributes > .hashtag > span',
										).innerText,
									},
								};
							},
						);

						detailData.header = header;

						//lay thong tin mo ta
						const mainContentHeader = await pageDetail.$eval(
							'#left-col > article.the-post > section.post-main-content',
							(el) =>
								el.querySelector('div.section-header > h2')
									.innerText,
						);
						const mainContentSection = await pageDetail.$$eval(
							'#left-col > article.the-post > section.post-main-content > .section-content > p',
							(els) =>
								(mainContentSection = els.map(
									(el) => el.innerText,
								)),
						);

						detailData.mainContent = {
							header: mainContentHeader,
							content: mainContentSection,
						};

						//lay dac diem tin dang
						const overViewHeader = await pageDetail.$eval(
							'#left-col > article.the-post > section.post-overview',
							(el) =>
								el.querySelector('div.section-header > h3')
									.innerText,
						);
						const overViewSection = await pageDetail.$$eval(
							'#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr',
							(els) => {
								return els.map((el) => {
									return {
										name: el.querySelector('td:first-child')
											.innerText,
										content:
											el.querySelector('td:last-child')
												.innerText,
									};
								});
							},
						);

						detailData.overView = {
							header: overViewHeader,
							content: overViewSection,
						};

						//Lay thong in line he
						const contactHeader = await pageDetail.$eval(
							'#left-col > article.the-post > section.post-contact',
							(el) =>
								el.querySelector('div.section-header > h3')
									.innerText,
						);
						const contactSection = await pageDetail.$$eval(
							'#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr',
							(els) => {
								return els.map((el) => {
									return {
										name: el.querySelector('td:first-child')
											.innerText,
										content:
											el.querySelector('td:last-child')
												.innerText,
									};
								});
							},
						);

						detailData.contact = {
							header: contactHeader,
							content: contactSection,
						};

						await pageDetail.close();

						resolve(detailData);
					} catch (error) {
						console.log('Lay Data loi ' + error);
						reject(error);
					}
				});
			const details = [];
			for (let link of detailLinks) {
				let detail = await scraperDetail(link);
				details.push(detail);
			}

			scrapeData.body = details;

			// await browser.close();
			resolve(scrapeData);
		} catch (error) {
			reject(error);
		}
	});

module.exports = { scrapeCategory, scraper };
