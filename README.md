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

#### 技术栈

Node16、Vue3，Lucide Icons、ElementUI PLUS，Pinia，Vue-Router

#### 特别说明（持续更新）

1. 所有表格都会有分页，默认pageSize是50，前端没有开放修改入口，但后端已预留；
2. 筛选项只会提供基础项，如有需要可自己定制开放；
3. 目前试题只有选择题和判断题，如有需要可自己扩展；
4. 题库（个人、公共和错题）默认都是以创建时间降序排序； 
5. 试卷发布时会校验是否关联试题，若没有，则不允许发布；
6. 试卷最多关联4个模块，新增模块后，会自动排序到最后一个； 
7. 目前安排考试无法跨天安排，时间选择的步长是10min； 
8. 没有关联学生的考试，无法发布； 
9. 已经发布的考试，无法进行删除操作； 
10. 已经开始的考试，无法进行编辑、取消发布、关联考生、删除等操作； 
11. 新增学生用户时，若没有填写登录账号，默认为学生学号； 
12. 新增教师用户时，若没有填写登录账号，默认为教师编号； 
13. 学号、教师编号、登录账号全局唯一； 
14. 考试结果详情页面默认排序是根据学生考试成绩降序排列； 
15. 考试进行中时，点击除了提交按钮外的其他能够切换路由的按钮或菜单时，会有警告提示，如果选择离开，则该考试成绩为0分 
16. 成绩单目前会生成在项目根目录下的`ExamResultFiles/`文件夹下，如有需求，可以调整成文件服务器或其他存储器

#### ExamOnline

![ExamOnlineImage1](docs_images/001.png)

![ExamOnlineImage2](docs_images/002.png)

![ExamOnlineImage3](docs_images/003.png)

![ExamOnlineImage4](docs_images/004.png)

![ExamOnlineImage5](docs_images/005.png)

![ExamOnlineImage6](docs_images/006.png)


