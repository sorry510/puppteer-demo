require('dotenv').config()
const puppeteer = require('puppeteer')

const { BASE_URL, USER, PASSWORD, TYPE, TYPE_NAME, UNIT_NAME, NEXT_USER } = process.env
const login =  BASE_URL + '/#/user/login'

;(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: {
      	width: 1920 - 60, 
      	height: 950
      },
      // devtools: true
    })

    // await page.waitFor(500) // 等待500ms

    const page = await browser.newPage();
    await page.goto(login)
    await page.waitForSelector('.ant-form.ant-form-horizontal') //等待元素加载之后，否则获取不异步加载的元素

    const userInput = await page.$('#username')
    await userInput.focus() // 定位到用户栏
    await page.keyboard.type(USER)

    const passwordInput = await page.$('#password')
    await passwordInput.focus() // 定位到密码栏
    await page.keyboard.type(PASSWORD)

    const loginBtn = await page.$(".ant-btn.antd-pro-components-login-index-submit")
    await loginBtn.click({delay:100}) // 登录

    await page.waitForSelector('.ant-menu.ant-menu-dark.ant-menu-root.ant-menu-inline')
    await page.mouse.click(137, 137, {delay:100}) // 质量管理
    await page.waitFor(200)
    await page.mouse.click(137, 195, {delay:100}) // 单元工程测评1
    await page.waitForSelector('.ant-tree.ant-tree-show-line')
    await page.mouse.click(312, 147, {delay:100}) // 展开tree
    await page.waitFor(200)

    const type = await page.$x(`.//span[text()='${TYPE}']/../../../ul`) // 找寻单元名称上级分类
    const typeName = await type[0].$x(`.//span[text()='${TYPE_NAME}']`) // 找寻单元名称末级分类
    // const { x, y } = await li[0].boundingBox()
    await typeName[0].click({delay:100})
    
    await page.waitForSelector('.antd-pro-components-we-tree2-index-treeWrap > .ant-tree')

    const unitName = await page.$x(`.//span[text()='${UNIT_NAME}']`)
    await unitName[0].click({delay:100})
    await page.waitForSelector('.ant-steps.ant-steps-horizontal.ant-steps-label-vertical')
    await page.waitFor(1000)
    const steps = await page.$$('.ant-steps.ant-steps-horizontal.ant-steps-label-vertical .ant-steps-item') // 步骤
    let index = 0
    // const stepNum = await page.$x(`.//div[text()='${TYPE_NAME}']`)
    const stepNum = await steps[index].$x(`.//span[text()='${++index}']`)
    await stepNum[0].click()
    await page.waitFor(1500)
    const a = await page.$x(".//a[text()='填报'] | .//a[text()='审批']") // table 
    a && await Promise.all(a.map(async el=> await el.click())) // 遍历table

    browser.on('targetcreated', async()=> {
      const pageList = await browser.pages();
      const page = pageList[pageList.length - 1]
      await page.waitFor(3000) // 等页面加载

      const allFrames = page.frames()
      const lastFrame = allFrames[allFrames.length - 1]
      const frameDoc = await lastFrame.evaluateHandle('document')
      const fr = frameDoc.asElement()
      
      await fr.$$eval('[id*="in_"]', all=> all.map(el=> {
        if(/.*_ca_.*/g.test(el.id)) {
          if(el.id === 'in_date_ca_1') {
            function getDate() {
              var date = new Date()
              return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            }
            el.value = getDate()
          }
        }else {
          el.value = 1
        }
      }))

      const checkBox = await fr.$('#checkbox_ca_1')
      checkBox && await checkBox.click()

      // await page.evaluate(()=> window.scrollTo(0, 2000))
      const signBtn = await fr.$('[for="img_ca_1"]')
      signBtn && await signBtn.click()
      
      const select = await page.$('.ant-select-selection__rendered')
      await select.click()
      await page.waitFor(200)

      const nextUser = await page.$x(`.//li[text()="${NEXT_USER}"][@role="option"]`)
      await nextUser[0].click()

      const submit = await page.$('button.ant-btn.ant-btn-primary')
      await submit.click()

      await page.waitForSelector('.ant-modal-footer > .ant-btn')
      const close = await page.$('.ant-modal-footer > .ant-btn')
      await close.click()
    })

    browser.on('targetdestroyed', async()=> {
      const pageList = await browser.pages();
      if(pageList.length === 2 && index < steps.length) {
        const page = pageList[pageList.length - 1]
        // const stepNum = await page.$x(`.//div[text()='${TYPE_NAME}']`)
        const stepNum = await steps[index].$x(`.//span[text()='${++index}']`)
        await stepNum[0].click()
        await page.waitFor(1500)
        const a = await page.$x(".//a[text()='填报'] | .//a[text()='审批']") // table 
        a && await Promise.all(a.map(async el=> await el.click())) // 遍历table
      }
    })
    // await browser.close()
  }catch (e) {
    console.log(e)
  }
})()