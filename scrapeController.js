const scraper = require('./scraper');
const fs = require('fs');

const scrapeController = async (browserInstance) => {
	const url = 'https://phongtro123.com';

	const indexs = [1, 2, 3, 4];
	try {
		let browser = await browserInstance;

		//goi ham cao o file scrape.js
		const categories = await scraper.scrapeCategory(browser, url);

		const selectedCategories = categories.filter((cat, idx) =>
			indexs.some((i) => i === idx),
		);

		let result1 = await scraper.scraper(
			browser,
			selectedCategories[0].link,
		);
		fs.writeFile(
			'chothuephongtro.json',
			JSON.stringify(result1),
			(error) => {
				if (error) console.log('LOI ' + error);
				console.log('Them data thanh cong!');
			},
		);

		let result2 = await scraper.scraper(
			browser,
			selectedCategories[1].link,
		);
		fs.writeFile('nhachothue.json', JSON.stringify(result2), (error) => {
			if (error) console.log('LOI ' + error);
			console.log('Them data thanh cong!');
		});

		let result3 = await scraper.scraper(
			browser,
			selectedCategories[2].link,
		);
		fs.writeFile('chothuecanho.json', JSON.stringify(result3), (error) => {
			if (error) console.log('LOI ' + error);
			console.log('Them data thanh cong!');
		});

		let result4 = await scraper.scraper(
			browser,
			selectedCategories[3].link,
		);
		fs.writeFile(
			'chothuematbang.json',
			JSON.stringify(result4),
			(error) => {
				if (error) console.log('LOI ' + error);
				console.log('Them data thanh cong!');
			},
		);

		await browser.close();
	} catch (error) {
		console.log('Lỗi ở scrapeController: ' + error);
	}
};

module.exports = scrapeController;
