const puppeteer = require('puppeteer');

const startBrowser = async () => {
	let browser;

	try {
		browser = await puppeteer.launch({
			headless: false,
			args: ['--disable-setuid-sandbox'],
			ignoreHTTPSErrors: true,
		});
	} catch (err) {
		console.log('khong tao duoc browser!' + err);
	}
	return browser;
};

module.exports = startBrowser;
