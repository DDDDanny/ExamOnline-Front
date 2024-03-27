<div>
  <p align="center"><img src="src/images/ExamOnlineLogo.png" style="zoom:20%;width:20%;" /></p>
</div>

# 在线考试系统（前端）

这个项目已经拖延了好几年了，2024年要重新开始动工，有需要这个项目做参考的同学，可以加我微信:MintBlueD，留言：GitHub  

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
- [ ] 试卷管理页面
  - [ ] 个人试卷库
    - [ ] 组卷逻辑（模块+试题）
  - [ ] 公共试卷库
- [ ] 考试管理页面
- [ ] 在线考试页面
- [ ] 用户管理页面

#### 技术栈

Node16、Vue3，Lucide Icons、ElementUI PLUS

#### 特别说明（持续更新）

1. 所有表格都会有分页，默认pageSize是50，前端没有开放修改入口，但后端已预留；
2. 筛选项只会提供基础项，如有需要可自己定制开放；
3. 目前试题只有选择题和判断题，如有需要可自己扩展；
4. 题库（个人、公共和错题）默认都是以创建时间降序排序； 
4. 试卷发布时会校验是否关联试题，若没有，则不允许发布；


#### 后期优化点
1. 新增&编辑试题时，选项调整为可动态伸缩
