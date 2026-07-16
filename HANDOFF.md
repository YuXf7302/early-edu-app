# 早教计划助手 — 完整项目上下文

> **用途**: 给任何 AI（Claude、Codex、Gemini 等）接手本项目时，读完此文档即可完全理解背景、架构和当前状态，继续开发。
> **最后更新**: 2026-07-10
> **项目路径**: `early-edu-app/`
> **Dev Server**: `cd early-edu-app && npm run dev` → http://localhost:5173/

---

## 一、孩子画像（不可丢失的核心上下文）

### 基础信息
- 昵称：待填写
- 出生：**2023年5月19日 14:30**（公历），上海
- 性别：男
- 妊娠：35周+4早产，紧急剖腹产，脐带打结（极低概率）
- 入园时间线：2026年9月入园（当前距入园约2个月）

### 八字命理（已验证正确）
```
癸卯    丁巳    丁丑    丁未
(年)    (月)    (日)    (时)

格局：丁火从旺格（炎上变格）
日主：丁火，生于巳月得令，四柱三丁一巳，火势冲天不可逆

五行力量：
  🔥 火 9/10 — 极旺（比劫重重，从旺格核心）
  🌿 木 4/10 — 偏旺（偏印好学）
  ⛰ 土 4/10 — 中等（食神泄秀，创造力出口）
  🪙 金 1/10 — 极弱（规则感、理财观念需后天环境培养）
  💧 水 0/10 — 极弱忌神（不可压制、不可吼骂）

教育总纲：顺势引导，不硬压。
  木生火 → 大量绘本、故事、知识输入
  火助火 → 比赛、社交、表演、被关注
  土泄火 → 动手创造、画画、积木、表达
  禁用金水 → 不命令、不惩罚、不冷战
```

### 能力基线（9维度）
| 维度 | 当前水平 | 优先级 | 说明 |
|------|---------|--------|------|
| 生活习惯/自理 | 1/5 | ⭐⭐⭐ | 不会独立穿衣吃饭扣扣子、不会擦屁股、收纳弱 |
| 数理逻辑 | 2/5 | ⭐⭐⭐ | 1-10熟练，到20勉强，颜色图形认识 |
| 财商启蒙 | 1/5 | ⭐⭐⭐ | 尚未接触，需环境创设 |
| 社交情感 | 3/5 | ⭐⭐⭐ | 情商高会转弯，但情绪剧烈、规则弱、哭闹达诉求 |
| 大运动 | 3/5 | ⭐⭐ | 平衡车/自行车强，单脚跳不会，偶尔摔跤 |
| 语言表达 | 3/5 | ⭐ | 完整句子，会用比喻句 |
| 艺术创意 | 1/5 | ⭐ | 上过画画课但不专注，记不住内容 |
| 音乐律动 | 2/5 | ⭐ | 喜欢音乐爱跳舞，歌词串台但自信 |
| 自然探索 | 2/5 | ⭐ | 喜欢植物，极度痴迷各种车 |

### 兴趣标签
🚗 车迷（核心杠杆，家里几百辆车）| 🎲 儿童桌游 | 🔬 STEAM实验 | 📚 绘本 | 📺 活力街体感游戏

### 家庭约束
- 工作日可用：19:30-20:30（1小时）
- 周末可用：全天分段
- 屏幕：每周2-3次，每次≤20分钟
- 家里已有：绘本、积木、运动器材少量、儿童桌游
- 老人白天带娃：需要简短、无需屏幕、家中常见物品的活动
- 积木不爱搭但可以搭车相关场景（斜坡赛道、停车场）

---

## 二、产品设计

### 核心定位
一个**轻量、有温度**的早教计划 Web 应用。核心循环：「看计划 → 做活动 → 记一笔 → 下周调优」。移动端优先，本地数据存储。

### 功能模块（已实现 ✅ / 规划中 🔲）

| 模块 | 状态 | 说明 |
|------|------|------|
| 🧒 孩子档案 | ✅ | 3步表单+9维评估+兴趣标签+八字自动推算+入园倒计时 |
| 📋 周计划生成 | ✅ | 权重驱动+动静交替+精力曲线+周节奏+主题周+八字调优 |
| 📅 日视图 | ✅ | 今日活动+精力档切换+打卡+明日预览 |
| ✍️ 观察记录 | ✅ | 活动关联笔记+里程碑+时间线 |
| 📊 看板 | ✅ | 周完成率+自理进度+9维×7天热力图 |
| 📦 材料清单 | ✅ | 自动汇总本周所需材料 |
| 📚 绘本推荐 | ✅ | 15本精选+按主题推荐+每本标注适配理由 |
| 👵 老人指引 | ✅ | 13个简短活动+时间段标注+英文单词可选 |
| 🏫 蒙氏整合 | ✅ | 4种教育法+敏感期匹配+日常练习 |
| 🪷 八字分析 | ✅ | 从旺格分析+引擎自动调优 |
| 🔄 周日总结 | ✅ | Proma定时任务每周日晚8点 |

### 教育方法论整合
1. **蒙台梭利**: 敏感期匹配、有准备的环境、日常生活练习
2. **瑞吉欧**: 兴趣驱动项目式学习（车主题贯穿）
3. **游戏力**: 以游戏为沟通语言，笑声化解对抗
4. **正面管教**: 温和而坚定，自然后果替代惩罚
5. **费曼学习法(简化)**: 让孩子当"小老师"教别人

---

## 三、技术架构

### 技术栈
```
React 18 + TypeScript (strict)
Vite 5 (build tool)
Tailwind CSS 3 (utility-first CSS)
Zustand (state management)
Dexie.js (IndexedDB wrapper)
Recharts (charts, 已安装待使用)
React Router v6 (routing)
Lucide React (icons)
```

### 数据存储
- **IndexedDB** (via Dexie.js): 本地优先，离线可用
- 表: `childProfile`, `activities`, `weeklyPlans`, `dailyRecords`, `milestones`
- 无后端依赖，数据完全由用户掌控

### 项目结构
```
early-edu-app/
├── src/
│   ├── types/index.ts          # 所有 TS 类型
│   ├── constants/index.ts      # 维度、标签、权重常量
│   ├── db/
│   │   ├── index.ts            # Dexie 实例+表定义
│   │   └── seed.ts             # 52条预设活动
│   ├── stores/
│   │   ├── useAppStore.ts      # 全局UI状态
│   │   ├── useChildStore.ts    # 孩子档案
│   │   ├── usePlanStore.ts     # 周计划
│   │   └── useRecordStore.ts   # 打卡记录
│   ├── engine/
│   │   ├── planGenerator.ts    # 周计划生成核心算法
│   │   ├── recommend.ts        # 替代活动推荐+周总结
│   │   ├── bazi.ts             # 八字排盘+五行分析+教育启示
│   │   ├── books.ts            # 绘本推荐系统(15本)
│   │   ├── montessori.ts       # 蒙氏+主流教育法整合
│   │   └── grandparent.ts      # 老人白天早教指引(13个活动)
│   ├── components/
│   │   ├── layout/             # AppLayout + TabBar
│   │   ├── home/               # DailyView + ActivityCard + EnergyToggle + TomorrowPreview
│   │   ├── plan/               # WeekPlanView + WeekDayCell
│   │   ├── profile/            # ChildProfile + DimensionForm
│   │   ├── record/             # NoteEditor + Timeline
│   │   └── dashboard/          # Dashboard + HeatmapGrid
│   └── pages/                  # HomePage, PlanPage, RecordPage, DashboardPage, ProfilePage
```

### 路由
```
/            → HomePage（今日活动+明日预览）
/plan        → PlanPage（周计划+材料+绘本+老人指引+蒙氏贴士）
/record      → RecordPage（笔记编辑+成长时间线）
/dashboard   → DashboardPage（看板+热力图）
/profile     → ProfilePage（孩子档案+八字信息）
```

### 核心算法：周计划生成器 (`engine/planGenerator.ts`)

```
输入: ChildProfile + Activity[]
输出: WeeklyPlan { weekStart, days[7], selfCareGoal, selfCareSkill }

流程:
1. detectTheme() — 找最弱的高优维度作为本周主题
2. getBaziAdjustment() — 从旺格: boost grossMotor, socialEmotion, language, art
3. getDayConfig(i) — 周一轻量→周二三四发力→周五轻松→周末深度
4. 每天填充:
   a. 槽位1(必做): 自理优先 or 主题维度
   b. 剩余槽位: 按精力曲线+动静交替排序
   c. 车迷主题线每周2-3次
   d. 主题周+八字 boost 维度活动追加
5. 动静交替: isDynamic()/isStatic()分类，相邻不重复类型
```

### Zustand Store 设计
- `useAppStore`: currentDate, energyMode, activeTab
- `useChildStore`: profile (load/save/updateDimension), isFirstLaunch
- `usePlanStore`: currentPlan (load/generate/save/toggleComplete), getTodayPlan
- `useRecordStore`: records (addNote/loadByDateRange), milestones

---

## 四、待办 / 可优化方向

### 高优先级
- [ ] **用户真实数据**: 首次使用录入孩子信息+生成周计划，端到端流程测试
- [ ] **多周视图**: 目前只能看本周，加一个"历史周"浏览
- [ ] **活动完成后的自动记录**: 打卡时自动弹出笔记输入框
- [ ] **PWA 离线支持**: manifest.json 已有，缺 service worker 注册

### 中优先级
- [ ] **AI 活动变体生成**: 集成 Proma API，基于现有活动生成车主题变体
- [ ] **数据导出**: 一键导出成长记录为 PDF/CSV
- [ ] **Recharts 图表**: 看板加入趋势折线图（已安装但未深入使用）
- [ ] **多娃支持**: 当前 childProfile 固定 id=1，可扩展为多记录
- [ ] **英文启蒙专项**: 老人指引中的英文单词可扩展为系统化英文活动

### 低优先级
- [ ] **云同步**: 可选的云端备份
- [ ] **声音/震动反馈**: 打卡成功时的小动画
- [ ] **主题自定义**: 家长可调整维度优先级权重

---

## 五、种子活动库概况 (52条)

| 维度 | 数量 | 车标签 | 特色 |
|------|------|--------|------|
| selfCare | 10 | 3 | 含入园专项4条、微活动1条 |
| mathLogic | 8 | 4 | 含微活动1条、积木变体1条 |
| financialLit | 3 | 1 | 洗车店、超市、存钱罐 |
| socialEmotion | 11 | 2 | 含情绪管理3条、规则训练4条、入园模拟2条 |
| grossMotor | 6 | 1 | 含微活动1条、户外骑行1条 |
| language | 3 | 2 | 故事接龙、车迷小主播 |
| art | 4 | 3 | 车轮印画、石头彩绘车 |
| music | 3 | 2 | 车身打击乐、车喇叭节奏 |
| nature | 4 | 2 | 含STEAM实验2条、水游戏2条 |

---

## 六、绘本推荐库 (15本)

| 书名 | 关联维度 | 适配理由 |
|------|---------|---------|
| 轱辘轱辘转 | language | 几百种车+细节搜索，偏印好学 |
| 开车出发系列 | nature | 车+自然=木生火完美组合 |
| 汽车嘟嘟嘟系列 | socialEmotion | 社会认知，为入园准备 |
| 我的情绪小怪兽 | socialEmotion | 颜色表达情绪，具象化 |
| 菲菲生气了 | socialEmotion | 自然疗愈怒火，木化解火 |
| 小手不是用来打人的 | socialEmotion | 给替代方案而非否定 |
| 阿立会穿裤子了 | selfCare | 同理心+成就感 |
| 小熊宝宝系列 | selfCare | 秩序敏感期，建立日常节奏 |
| 首先有一个苹果 | mathLogic | 混乱中数数 |
| 100层的巴士 | mathLogic | 车+数字+想象力 |
| 小兔子学花钱 | financialLit | 具象化零花钱 |
| 妈妈钱是什么 | financialLit | 钱的起源故事 |
| DK儿童科学百科 | nature | 偏印广撒网 |
| 水从哪里来 | nature | 化忌为喜 |
| — | — | — |

---

## 七、关键设计决策（修改时需注意）

1. **移动优先**: `#root` max-width 480px，居中带阴影。不要改这个约束。
2. **本地存储优先**: 所有数据在 IndexedDB，没有后端。新增功能不要引入强制后端依赖。
3. **八字引擎联动**: `profile.bazi` 存在时，`getBaziAdjustment()` 自动调优。修改推荐权重时需同步更新此函数。
4. **从旺格策略**: 不压制、不吼罚、不命令。活动设计应为引导式/游戏式，不应有惩罚机制。
5. **车主题是核心兴趣杠杆**: 新增活动至少30%应含 `car` 标签。
6. **活动时长**: 5-8分钟为主（火旺注意力短），周末深度日可有15-20分钟活动。
7. **个人信息不写入版本控制**: 孩子八字、真名等信息不要硬编码到公共代码中。
8. **TabBar 5入口**: 首页/周计划/记录/看板/档案，不要随意增减。

---

## 八、启动命令

```bash
cd early-edu-app
npm install        # 安装依赖
npm run dev        # 开发服务器 → http://localhost:5173/
npm run build      # 生产构建 → dist/
npx tsc --noEmit   # 类型检查（不产生输出）
```

手机访问: 同 WiFi 下访问 `http://<本机IP>:5173/`

---

## 九、文件清单 (35个TS/TSX文件)

```
src/types/index.ts               — TS类型定义
src/constants/index.ts            — 维度/标签/权重常量
src/db/index.ts                   — Dexie 数据库
src/db/seed.ts                    — 52条种子活动
src/stores/useAppStore.ts         — 全局状态
src/stores/useChildStore.ts       — 孩子档案状态
src/stores/usePlanStore.ts        — 周计划状态
src/stores/useRecordStore.ts      — 记录状态
src/engine/planGenerator.ts       — 周计划生成算法（核心）
src/engine/recommend.ts           — 活动推荐+周总结
src/engine/bazi.ts                — 八字分析+教育启示
src/engine/books.ts               — 绘本推荐(15本)
src/engine/montessori.ts          — 蒙氏+教育法整合
src/engine/grandparent.ts         — 老人白天指引(13个)
src/components/layout/AppLayout.tsx
src/components/layout/TabBar.tsx
src/components/home/DailyView.tsx
src/components/home/ActivityCard.tsx
src/components/home/EnergyToggle.tsx
src/components/home/CheckInButton.tsx
src/components/home/TomorrowPreview.tsx
src/components/plan/WeekPlanView.tsx   — 周计划+材料+绘本+老人+蒙氏
src/components/plan/WeekDayCell.tsx
src/components/profile/ChildProfile.tsx
src/components/profile/DimensionForm.tsx
src/components/record/NoteEditor.tsx
src/components/record/Timeline.tsx
src/components/dashboard/Dashboard.tsx
src/pages/HomePage.tsx
src/pages/PlanPage.tsx
src/pages/RecordPage.tsx
src/pages/DashboardPage.tsx
src/pages/ProfilePage.tsx
src/App.tsx
src/main.tsx
```
