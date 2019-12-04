require('dotenv').config()
const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/subject/26100958/'

;(async () => {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      slowMo: 100,
      defaultViewport: {
      	width: 1920 - 60, 
      	height: 950
      },
      // devtools: true
    })

    // await page.waitFor(500) // 等待500ms

    const page = await browser.newPage();
    await page.goto(url)
    await page.waitForSelector('#content') // 等待元素加载之后，否则获取不异步加载的元素

    const img = await page.$eval('#mainpic img', el => el.src) // 电影海报

    const strInfo = await page.$eval('#mainpic img', el => el.textContent) // 电影相关信息

    const arrInfo = strInfo.trim().split('\n').map(item=> {
      const [key, value] = item.split(':')
      return {[key.trim()]: value.trim()}
    })

    const summary = await page.$eval('#link-report', el => el.innerText) // 摘要
    
    const shortReview = await page.$eval('#comments-section .pl a', el => el.innerText) // 短评论数文字

    const [shortReviewCount = 0] = review.match(/[0-9]+/) // 短评论数量

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