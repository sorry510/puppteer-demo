const puppeteer = require('puppeteer')
function sleep(delay) {
	return new Promise(resolve => setTimeout(_=> resolve(), delay))
}

(async () => {
  const browser = await puppeteer.launch({
  	headless: false,
  	slowMo:250,
  	defaultViewport:{
  		width: 1920, 
  		height: 1680
  	}
  })
  let page = await browser.newPage();
  await page.goto('https://www.baidu.com/')
  const searchInput = await page.$('#kw')
  await searchInput.focus() //定位到搜索框
  await page.keyboard.type("hello world") //输入hello world
  const searchBtn = await page.$("#su") // 百度一下
	await searchBtn.click()
	await page.waitForSelector('#content_left') //等待元素加载之后，否则获取不异步加载的元素

	const links = await page.$$eval('.result-op.c-container.xpath-log > h3 > a', ls=> {
		return ls.map(a => {
			return {
				href: a.href.trim()
			}
		})
	})

	for(let i= 0; i < links.length; i++) {
		page = await browser.newPage()
		// await page.setViewport({width:1920, height:1080})
		await page.goto(links[i].href, {timeout:0}) //防止页面太长，加载超时
		let scrollEnable = true
		while (scrollEnable) {
			scrollEnable = await page.evaluate((scrollStep) => {
				document.documentElement.scrollTop += scrollStep
				return document.documentElement.scrollTop + document.documentElement.clientHeight + 100 <= document.documentElement.scrollHeight
			}, 500)
			await sleep(100)
		}

		let filename = "items-"+i+".png"
		await page.screenshot({path:filename, fullPage:true})
		await page.close()
	}

  await browser.close()
})()
