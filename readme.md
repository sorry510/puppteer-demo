## puppeteer试用

## 自动化测试质量表单
1. cnpm/cnpm install || yarn 注:puppteer版本是1.19.0，1.2部分函数异步机制有变动无法使用
2. cp env.examle env 填写相关信息
```
BASE_URL = 登录地址
USER = 用户名
PASSWORD = 密码
TYPE = 工程划分名称分类
TYPE_NAME = 工程划分名称
UNIT_NAME = 单元工程名称
STEP_INDEX = 步骤序号（从零开始）
TABLE_INDEX = 步骤下table序号（从零开始）
NEXT_USER = 下一步审批人

```

## 运行
node index.js 一次完成一个单元工程名称下所有步骤的第一步
node dragon.js 一次完成一个表单下的所有审批步骤