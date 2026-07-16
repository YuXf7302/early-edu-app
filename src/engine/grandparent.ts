/**
 * 老人白天早教指引
 *
 * 场景：工作日白天，老人带娃
 * 约束：
 *   - 老人可能不会英语，英语活动标注"可选"
 *   - 无需屏幕（保护眼睛）
 *   - 用家中常见物品
 *   - 每项5-10分钟，可穿插在日常活动中
 *   - 不强求完成，开心最重要
 */

export interface GrandparentActivity {
  title: string;
  when: string;             // 什么时间做
  duration: number;         // 分钟
  materials: string[];      // 需要的材料
  instructions: string;     // 简单步骤（老人能看懂）
  tip: string;              // 给老人的一句话提醒
  dimension: string;
  englishWord?: string;      // 可教的英文单词（可选）
}

export const GRANDPARENT_ACTIVITIES: GrandparentActivity[] = [
  // ====== 早晨 ======
  {
    title: '自己穿衣服比赛',
    when: '早晨起床',
    duration: 5,
    materials: ['衣服', '袜子'],
    instructions: '"宝宝，奶奶/外婆数到10，看你能不能自己穿好袜子！" 穿不上也没关系，每天试一下就进步了。',
    tip: '不帮忙穿，但可以帮忙拿着袜子让他自己套。慢不要紧，自己穿上的才有成就感。',
    dimension: 'selfCare',
  },
  {
    title: '早餐数数',
    when: '吃早饭',
    duration: 3,
    materials: ['早餐食物'],
    instructions: '吃包子/小馒头/水果的时候，一起数"1个、2个、3个"。吃完的也数"吃掉了几个"。',
    tip: '不用刻意教，边吃边数，像聊天一样自然。',
    dimension: 'mathLogic',
    englishWord: 'one, two, three',
  },

  // ====== 上午 ======
  {
    title: '颜色停车场',
    when: '上午游戏时间',
    duration: 10,
    materials: ['玩具车', '彩色纸/毛巾'],
    instructions: '铺红蓝黄三块布在地上当停车场。说"红色车回红色家！"让孩子把同颜色的车开过去。',
    tip: '他自己玩起来就别打断，在旁看着就好。如果分错了也不用纠正，他会自己发现。',
    dimension: 'mathLogic',
    englishWord: 'red, blue, yellow',
  },
  {
    title: '积木搭车道',
    when: '上午游戏时间',
    duration: 10,
    materials: ['积木', '玩具车'],
    instructions: '不是搭塔，是搭一条"路"或"桥"让车开过去。搭好就推着车走一遍。倒了就笑着说"地震啦重建！"',
    tip: '他不爱搭积木？没关系，你搭他看，他自然会被吸引过来"开车上路"。',
    dimension: 'art',
  },
  {
    title: '浇花小园丁',
    when: '上午',
    duration: 5,
    materials: ['小喷壶/小水杯', '植物'],
    instructions: '给家里的花/阳台植物浇水。告诉他"花花渴了要喝水，宝宝帮它倒水"。他自己喝水的习惯也会变好。',
    tip: '洒出来没关系，地上有水让他自己拿抹布擦（顺便练自理）。',
    dimension: 'nature',
    englishWord: 'water, flower',
  },

  // ====== 午餐前后 ======
  {
    title: '摆碗筷小帮手',
    when: '饭前',
    duration: 5,
    materials: ['碗', '筷子/勺子'],
    instructions: '"宝宝帮奶奶摆碗筷，爸爸的碗放这里，妈妈的放那里。" 让他数一数"今天几个人吃饭？"',
    tip: '一次只让他做一件事：先摆碗，熟练了再加摆筷子。不求多，只求坚持。',
    dimension: 'selfCare',
    englishWord: 'bowl, spoon',
  },
  {
    title: '饭后收碗',
    when: '饭后',
    duration: 3,
    materials: ['自己的碗筷'],
    instructions: '吃完饭，让他把自己的碗筷送到厨房。"宝宝会帮忙了，真棒！" 固定每天做。',
    tip: '不管做得好不好都夸"帮忙"这个行为。仪式感就是这样一天天建立起来的。',
    dimension: 'selfCare',
  },

  // ====== 下午 ======
  {
    title: '停车场收纳',
    when: '午睡后/游戏收尾',
    duration: 10,
    materials: ['收纳盒', '玩具车'],
    instructions: '在收纳盒上画停车位（或用胶带分区），玩完说"小汽车要回家睡觉了"。比赛谁停得快。',
    tip: '一开始只要求他收3辆车，不要全收。每天多一辆，慢慢来。',
    dimension: 'selfCare',
    englishWord: 'car, home',
  },
  {
    title: '洗车店',
    when: '下午',
    duration: 10,
    materials: ['玩具车', '湿巾/小抹布'],
    instructions: '"宝宝开洗车店啦，给脏了的车擦一擦。" 擦一辆=贴一张贴纸，攒到3张可以换一个零食。',
    tip: '这个游戏既练了精细动作，又学了财商。贴纸就是"钱"。3张贴纸=1份奖励。',
    dimension: 'financialLit',
  },
  {
    title: '模仿动物走路',
    when: '下午活动时间',
    duration: 8,
    materials: [],
    instructions: '"宝宝学小兔子跳！学大象跺脚！学小鸟飞！" 模仿各种动物，边玩边动起来。',
    tip: '火旺的孩子需要大量运动。在家也可以动起来，不用非得出门。',
    dimension: 'grossMotor',
    englishWord: 'jump, walk, fly',
  },

  // ====== 全天随时 ======
  {
    title: '数数接龙',
    when: '任何时候（坐车、走路、等饭）',
    duration: 3,
    materials: [],
    instructions: '奶奶说"1"→宝宝说"2"→奶奶说"3"...轮流数到10。谁卡住了就帮一下，笑一笑继续。',
    tip: '不用纠正对错，断了就笑着说"没关系，从1再来一次"。游戏重点是开心坚持。',
    dimension: 'mathLogic',
    englishWord: 'numbers 1-10',
  },
  {
    title: '找颜色',
    when: '任何时候',
    duration: 3,
    materials: [],
    instructions: '"宝宝找找，这个房间里有什么东西是红色的？" 找到就击掌！再找蓝色、黄色...',
    tip: '颜色找完了可以找形状："找找圆的东西在哪里？"（碗、钟、车轮...）',
    dimension: 'mathLogic',
    englishWord: 'red, blue, green',
  },
];

// 按时间段筛选
export function getActivitiesByTime(when: string): GrandparentActivity[] {
  return GRANDPARENT_ACTIVITIES.filter((a) => a.when.includes(when) || a.when === '任何时候');
}

// 每日推荐（3-4个活动，分布在一天中）
export function getDailyGrandparentPlan(): GrandparentActivity[] {
  return [
    GRANDPARENT_ACTIVITIES[0],  // 起床
    GRANDPARENT_ACTIVITIES[Math.floor(Math.random() * 4) + 2], // 随机上午活动
    GRANDPARENT_ACTIVITIES[5],  // 摆碗筷
    GRANDPARENT_ACTIVITIES[Math.floor(Math.random() * 4) + 8], // 随机下午活动
  ];
}
