require('dotenv').config()
const puppeteer = require('puppeteer')

const { BASE_URL, USER, PASSWORD, TYPE, TYPE_NAME, UNIT_NAME, STEP_INDEX, TABLE_INDEX, NEXT_USER } = process.env
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

    await page.click(".ant-btn.antd-pro-components-login-index-submit", {delay:100}) // 登录

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

    // const stepNum = await page.$x(`.//div[text()='${TYPE_NAME}']`)
    const stepNum = await steps[STEP_INDEX].$x(`.//span[text()='${Number(STEP_INDEX) + 1}']`)
    await stepNum[0].click() // 点击选择步骤
    await page.waitFor(1500)
    const a = await page.$x(".//a[text()='填报'] | .//a[text()='审批']") // table列表
    a && a[TABLE_INDEX] && await a[TABLE_INDEX].click()

    browser.on('targetcreated', async()=> {
      const pageList = await browser.pages();
      const page = pageList[pageList.length - 1]
      await page.waitFor(3000) // 等页面加载

      const allFrames = page.frames()
      const lastFrame = allFrames[allFrames.length - 1]
      const frameDoc = await lastFrame.evaluateHandle('document')
      const fr = frameDoc.asElement()

      const step = await fr.$eval('#currentStep', el=> el.value) // 第几步骤
      
      await fr.$$eval('[id*="in_"]', all=> all.map(el=> {
        // 这里的线程在浏览器里面
        if(/.*_ca_.*/g.test(el.id)) {
          // if(el.id === `in_date_ca_${step}`) { // 签日期
            // function getDate() {
            //   var date = new Date()
            //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            // }
            // el.value = getDate()
          // }
        }else {
          el.value = 1
        }
      }), {step})

      const dates = await fr.$$(`[id*="in_date_ca_"][step="${step}"]`) // 选择日期
      let today = null
      if(dates) {
        for(let i = 0; i < dates.length; i++) {
          const dateValue = await fr.$eval('body', (body, el)=> el.value, dates[i])
          if(dateValue == '') {
            await dates[i].click()
            today = await fr.$x(".//th[text()='今天']")
            await today[0].click()
          }
        }
      }

      const checkBox = await fr.$(`#checkbox_ca_${(Number(step) + 1) * 2}`) // 选择多选框审批意见
      if(checkBox) {
        const checkBoxValue = await fr.$eval('body', (body, el)=> el.checked, checkBox)
        if(!checkBoxValue) {
          await checkBox.click()
        }
      }

      // await page.evaluate(()=> window.scrollTo(0, 2000))
      const signBtn = await fr.$(`[for="img_ca_${(Number(step) + 1)}"]`) // 签名
      signBtn && await signBtn.click()
      
      const select = await page.$('.ant-select-selection__rendered')
      if(select) { // 选择下一步审批人
        await select.click()
        await page.waitFor(200)
  
        const nextUser = await page.$x(`.//li[text()="${NEXT_USER}"][@role="option"]`)
        await nextUser[0].click()
      }
    
      await page.click('button.ant-btn.ant-btn-primary') // 提交表单

      await page.waitForSelector('.ant-modal-footer > .ant-btn')
      const close = await page.$('.ant-modal-footer > .ant-btn') // 关闭当前页
      await close.click()
    })

    browser.on('targetdestroyed', async()=> {
      const pageList = await browser.pages();
      if(pageList.length === 2) {
        const page = pageList[pageList.length - 1]
        // const stepNum = await page.$x(`.//div[text()='${TYPE_NAME}']`)
        const stepNum = await steps[STEP_INDEX].$x(`.//span[text()='${Number(STEP_INDEX) + 1}']`)
        await stepNum[0].click() // 点击选择步骤
        await page.waitFor(1500)
        const a = await page.$x(".//a[text()='填报'] | .//a[text()='审批']") // table列表
        if(a && a[TABLE_INDEX]) {
          await a[TABLE_INDEX].click()
        }else {
          console.info('success')
          await browser.close()
        }
      }
    })
    // await browser.close()
  }catch (e) {
    console.log(e)
  }
})()