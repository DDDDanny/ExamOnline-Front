<div>
  <p align="center"><img src="src/images/ExamOnlineLogo.png" style="zoom:20%;width:20%;" /></p>
</div>

# 在线考试系统（前端）

这个项目已经拖延了好几年了，2024年要重新开始动工，有需要这个项目做参考的同学，可以加我微信:MintBlueD，留言：GitHub  + 你的问题  

👉：如果你有想做的需求，可以提issue，我会尽量安排～

👉：不会没关系，我可以给你方向，但我不会教你。没有脑子的就别加了！

后端项目：https://github.com/DDDDanny/ExamOnline-Server

---

#### 功能点

功能模块有4大模块：`用户管理模块`、`试题管理模块`、`试卷管理模块`和`考试管理模块`

系统角色有3类：系统管理员、学生用户和教师用户

#### 功能模块

- [x] 登录页面
  - [x] 页面开发
  - [x] 记住密码
  - [x] Request Header 增加 Token
  - [x] 后端联调
  
- [x] 主体容器
  - [x] 菜单栏开发
  - [x] 顶部开发
    - [x] 修改密码
    - [x] 退出登录
    - [ ] 消息通知
  - [x] 主体开发
  
- [x] 试题管理页面
  - [x] 个人题库
    - [x] CURD
  - [x] 公共题库
    - [x] 收藏试题逻辑
  - [x] 错题库
    - [x] 错题库列表（查询）
    - [x] 取消收藏（删除）错题
    - [x] 收藏错题
  
- [x] 试卷管理页面
  - [x] 个人试卷库
    - [x] 组卷逻辑 - 模块新增与变更
    - [x] 组卷逻辑 - 关联试卷
  - [x] 公共试卷库
  
  - [x] 预览试卷
  
- [x] 考试管理页面

  - [x] CURD考试信息

  - [x] 基础接口及逻辑

  - [x] 操作显示逻辑

    > 未发布：编辑、删除、发布、关联学生
    >
    > 已发布：
    >
    > 1. 未开始：取消发布、关联学生
    > 2. 进行中：--
    > 3. 已完成：查看成绩

  - [x] 发布考试

    - [x] 基础接口及逻辑
    - [x] 增加判断
      - [x] 距离考试开始时间小于30分钟，无法发布考试
      - [x] 没有关联考生无法发布
      - [x] 前端校验
      - [x] 后端兜底校验
    
  - [x] 取消发布考试
  
  - [x] 正在进行和已经完成的无法取消（前端判断）
    - [x] 增加判断：距离考试开始时间小于2小时，无法取消
    - [x] 前端校验
      - [x] 后端兜底校验
    
  - [x] 关联考生
  
    - [x] 关联考生基本逻辑处理
    
    - [x] 考试信息安排展示

- [x] 在线考试页面

- [x] 用户管理页面

  - [x] 学生管理页面
    - [x] CURD学生信息
    - [x] 学生激活
  - [x] 教师管理页面
  
- [x] 考试结果管理页面

  - [x] 基础页面结构
  - [x] 考试结果详情页面
  - [x] 学生考试结果详情页面

#### 扩展（功能）需求

- [ ] 项目启动教程
- [ ] 批量上传试题
- [x] 批量上传学生
- [ ] 发送消息通知
  - [ ] 系统内消息推送
  - [ ] 三方消息推送（Email？钉钉？企微？）
- [ ] 实现随机试题组卷

#### 技术栈

Node16、Vue3，Lucide Icons、ElementUI PLUS，Pinia，Vue-Router

#### 特别说明（持续更新）

1. 所有表格都会有分页，默认pageSize是50，前端没有开放修改入口，但后端已预留；
2. 筛选项只会提供基础项，如有需要可自己定制开放；
3. 目前试题只有选择题和判断题，如有需要可自己扩展；
4. 题库（个人、公共和错题）默认都是以创建时间降序排序； 
4. 试卷发布时会校验是否关联试题，若没有，则不允许发布；
4. 试卷最多关联4个模块，新增模块后，会自动排序到最后一个；
4. 目前安排考试无法跨天安排，时间选择的步长是10min；
4. 没有关联学生的考试，无法发布；
4. 已经发布的考试，无法进行删除操作；
4. 已经开始的考试，无法进行编辑、取消发布、关联考生、删除等操作；
4. 新增学生用户时，若没有填写登录账号，默认为学生学号；
4. 新增教师用户时，若没有填写登录账号，默认为教师编号；
4. 学号、教师编号、登录账号全局唯一；
4. 考试结果详情页面默认排序是根据学生考试成绩降序排列；
4. 考试进行中时，点击除了提交按钮外的其他能够切换路由的按钮或菜单时，会有警告提示，如果选择离开，则该考试成绩为0分

#### TODO

- [x] 学生成绩单详情页面 -- `p1`
- [x] 在线考试功能 -- `p0`
- [x] 错题收藏 -- `p1`
- [x] 学生-成绩管理 -- `p1`
- [x] 学生-试卷查看 -- `p1`
- [ ] 下载成绩单 -- `p2`
- [ ] 新增&编辑试题时，选项调整为可动态伸缩 -- `p1`
- [ ] 重构管理员端 -- `p2`
- [ ] 试题导入 -- `p2`
- [ ] 首页日历交互优化 -- `p2`
