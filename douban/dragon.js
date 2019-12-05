const Douban = require('./Douban')
const mysql = require('./Mysql')

const tag = '热门'
const movieSearchUrl = `https://movie.douban.com/explore#!type=movie&tag=${tag}&sort=recommend&page_limit=20&page_start=0`

;(async () => {
  try {
    const douban = await new Douban({headless: true})
    await douban.launch()
    const [rows, fields] = await mysql.query('select * from t_douban_movie where status = 0 order by id asc limit 1')
    for(let row of rows) {
      const { id, status, ...rest } = row
      const subject = rest // 初始化详情数据
      console.log('start open douban url')
      await douban.goto(row.alt) // 进入详情页
      await douban.wait('#wrapper')
      console.log('start scripy ...')

      subject.small = await douban.$eval('#mainpic img', el => el.src) // 电影海报

      const strInfo = await douban.$eval('#info', el => el.textContent) // 电影相关信息
      strInfo.trim().split('\n').map(item=> {
        const [key, value] = item.split(':')
        const info = value.trim()
        switch(key.trim()) {
          case '导演':
            subject.

        }
        return {[key.trim()]: value.trim()}
      })
      // console.log(arrInfo)
     

      // 更新状态为已更新
      // const res = await mysql.execute('update t_douban_movie set status = ? where id = ?', [1, id])
    }
    // await mysql.end()
    // console.log(fields)

      // const browser = await puppeteer.launch({
      //   // headless: false,
      //   // slowMo: 100,
      //   // defaultViewport: {
      //   // 	width: 1920 - 60, 
      //   // 	height: 950
      //   // },
      //   // devtools: true
      // })

      // await page.waitFor(500) // 等待500ms

      // const page = await browser.newPage();
      //
      // await page.goto(subjectUrl, {
      //   // timeout: 0,
      //   waitUntil: 'domcontentloaded'
      // })
      // console.log('open douban url')
      // await page.waitForSelector('#wrapper') // 等待元素加载之后，否则获取不异步加载的元素
      // console.log('start...')
      // const img = await page.$eval('#mainpic img', el => el.src) // 电影海报

      // console.log(img)

      // const strInfo = await page.$eval('#info', el => el.textContent) // 电影相关信息
      // console.log(strInfo)
      // const arrInfo = strInfo.trim().split('\n').map(item=> {
      //   const [key, value] = item.split(':')
      //   return {[key.trim()]: value.trim()}
      // })
      // console.log(arrInfo)

      // const summaryDom = '#link-report'
      // const issummary = await page.$(summaryDom)
      // const summary = issummary ? await page.$eval(summaryDom, el => el.innerText) : '' // 摘要
      // console.log(summary)

      // const shortReviewDom = '#comments-section .pl a'
      // const isshortReview = await page.$(shortReviewDom)
      // const shortReview = isshortReview ? await page.$eval(shortReviewDom, el => el.innerText) : '' // 短评论数量文字
      // const [shortReviewCount = 0] = shortReview.match(/[0-9]+/) // 短评论数量
      // console.log(shortReviewCount)

      // const reviewDom = '.reviews.mod.movie-content .pl a'
      // const isreview = await page.$(reviewDom)
      // const review = isreview ? await page.$eval(reviewDom, el => el.innerText) : '' // 影评数量文字
      // const [reviewCount = 0] = review.match(/[0-9]+/) // 影评数量
      // console.log(reviewCount)

      // const ratingDom = '#interest_sectl .rating_num'
      // const israting = await page.$(ratingDom)
      // const ratingNum = israting ? await page.$eval(ratingDom, el => el.innerText) : '' // 平均分数
      // console.log(ratingNum)

    // await browser.close()
  }catch (e) {
    console.log(e)
  }
})()