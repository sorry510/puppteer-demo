const puppeteer = require('puppeteer')

const subjectUrl = 'https://movie.douban.com/subject/26100958'
// const subjectUrl = 'https://www.baidu.com'

;(async () => {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 100,
      // defaultViewport: {
      // 	width: 1920 - 60, 
      // 	height: 950
      // },
      // devtools: true
    })

    // await page.waitFor(500) // 等待500ms

    const page = await browser.newPage();
    console.log('start open douban url')
    await page.goto(subjectUrl, {
      // timeout: 0,
      waitUntil: 'domcontentloaded'
    })
    console.log('open douban url')
    await page.waitForSelector('#wrapper') // 等待元素加载之后，否则获取不异步加载的元素
    console.log('start...')
    const img = await page.$eval('#mainpic img', el => el.src) // 电影海报

    console.log(img)

    const strInfo = await page.$eval('#info', el => el.textContent) // 电影相关信息
    console.log(strInfo)
    const arrInfo = strInfo.trim().split('\n').map(item=> {
      const [key, value] = item.split(':')
      return {[key.trim()]: value.trim()}
    })
    console.log(arrInfo)
    // const summaryDom = '#link-report'
    // const issummary = await page.$(summaryDom)
    // const summary = issummary ? await page.$eval(summaryDom, el => el.innerText) : '' // 摘要
    
    // const shortReviewDom = '#comments-section .pl a'
    // const isshortReview = await page.$(shortReviewDom)
    // const shortReview = isshortReview ? await page.$eval(shortReviewDom, el => el.innerText) : '' // 短评论数量文字
    // const [shortReviewCount = 0] = shortReview.match(/[0-9]+/) // 短评论数量

    // const reviewDom = '.reviews.mod.movie-content .pl a'
    // const isreview = await page.$(reviewDom)
    // const review = isreview ? await page.$eval(reviewDom, el => el.innerText) : '' // 影评数量文字
    // const [reviewCount = 0] = review.match(/[0-9]+/) // 影评数量

    // const userInput = await page.$('#username')
    // await userInput.focus() // 定位到用户栏
    // await page.keyboard.type(USER)

    // const passwordInput = await page.$('#password')
    // await passwordInput.focus() // 定位到密码栏
    // await page.keyboard.type(PASSWORD)

    // const loginBtn = await page.$(".ant-btn.antd-pro-components-login-index-submit")
    // await loginBtn.click({delay:100}) // 登录

    // await page.waitForSelector('.ant-menu.ant-menu-dark.ant-menu-root.ant-menu-inline')
    // await page.mouse.click(137, 137, {delay:100}) // 质量管理
    // await page.waitFor(200)
    // await page.mouse.click(137, 195, {delay:100}) // 单元工程测评1
    // await page.waitForSelector('.ant-tree.ant-tree-show-line')
    // await page.mouse.click(312, 147, {delay:100}) // 展开tree
    // await page.waitFor(200)

   
    // await browser.close()
  }catch (e) {
    console.log(e)
  }
})()