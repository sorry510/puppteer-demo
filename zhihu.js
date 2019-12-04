// const puppeteer = require('puppeteer')

// ;(async () => {
// 	const browser = await puppeteer.launch({
// 		headless: true, // 无头
// 		// slowMo:250,
// 		// defaultViewport:{
// 		// 	width: 1920, 
// 		// 	height: 1680
// 		// }
// 	})
// 	let page = await browser.newPage()
//   // await page.goto('http://47.75.92.31:8080/api/v1/login')
//   await page.goto('http://47.75.92.31:8080')
//   await page.waitForRequest(request => request.url() === 'http://47.75.92.31:8080' && request.method() === 'GET');
//   await page.on('request', res=> {
//   	console.log(res)
//   })
//   await browser.close()
// })()

const a = 123 |> Math.abs