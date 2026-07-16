/**
 * 蒙台梭利 & 主流教育法整合
 *
 * 适配：丁火从旺格，3岁男宝，入园前
 *
 * 核心方法：
 * - 蒙台梭利 Montessori：敏感期 + 有准备的环境 + 日常生活练习
 * - 瑞吉欧 Reggio Emilia：兴趣驱动的项目式学习
 * - 游戏力 Playful Parenting：以游戏为沟通语言
 * - 正面管教 Positive Discipline：温和而坚定
 */

// ====== 蒙台梭利敏感期 (3-4岁) ======
export const SENSITIVE_PERIODS = [
  { period: '秩序敏感期', age: '2-4岁', apply: '固定日常流程、物品归位、先后顺序' },
  { period: '感官精致期', age: '2.5-5岁', apply: '颜色分类、声音辨別、触觉探索、味觉体验' },
  { period: '语言敏感期', age: '0-6岁', apply: '大量绘本输入、故事接龙、录音回听' },
  { period: '动作协调期', age: '2.5-4.5岁', apply: '精细动作（扣扣子、串珠）+ 大运动（跑跳平衡）' },
  { period: '社会行为期', age: '2.5-6岁', apply: '轮流、分享、礼貌用语、照顾环境' },
  { period: '细小事物期', age: '1.5-4岁', apply: '观察蚂蚁、收集小石头、关注细节' },
];

// ====== 蒙氏日常生活练习（对应自理维度） ======
export const MONTESSORI_PRACTICAL_LIFE = [
  {
    name: '倒水练习',
    materials: ['小水壶', '杯子', '托盘'],
    skill: '手眼协调 + 独立喝水',
    ritual: '每天饭前自己倒水，洒了没关系，自己擦',
  },
  {
    name: '穿脱衣服架',
    materials: ['儿童衣架', '容易穿脱的外套'],
    skill: '独立穿脱 + 挂衣服',
    ritual: '进门第一件事：脱外套→挂衣架（仪式感建立秩序）',
  },
  {
    name: '擦桌子',
    materials: ['小抹布', '喷壶'],
    skill: '照顾环境 + 责任感',
    ritual: '饭后自己擦自己那片区域',
  },
  {
    name: '食物准备',
    materials: ['安全切刀', '香蕉/黄瓜等软食材'],
    skill: '动手能力 + 食物认知',
    ritual: '周末一起准备水果拼盘',
  },
  {
    name: '扫地/拖地',
    materials: ['儿童尺寸扫帚'],
    skill: '照顾环境 + 大运动',
    ritual: '玩具玩完→扫地→停车入库，三段式固定流程',
  },
];

// ====== 教育方法 × 活动类型映射 ======
export interface MethodMapping {
  method: string;
  icon: string;
  principle: string;
  applyTo: string[];  // 适用的维度/场景
  forbiddenFor: string[]; // 不适用的场景
  whyForThisChild: string;
}

export const METHODS: MethodMapping[] = [
  {
    method: '蒙台梭利',
    icon: '🏫',
    principle: '有准备的环境 + 自由选择 + 敏感期匹配',
    applyTo: ['selfCare', 'mathLogic', 'art'],
    forbiddenFor: ['强行要求、统一指令'],
    whyForThisChild: '从旺格忌命令。蒙氏的自由选择恰好尊重他的意志，准备好的环境引导他自然走向正确选择。',
  },
  {
    method: '瑞吉欧',
    icon: '🎨',
    principle: '兴趣驱动 + 项目式学习 + 百种语言表达',
    applyTo: ['art', 'nature', 'language'],
    forbiddenFor: ['预设结果、标准答案'],
    whyForThisChild: '偏印好学但兴趣广泛。瑞吉欧让他的兴趣成为课程来源，而不是被课程牵着走。车迷→学数数、学物理、学社交。',
  },
  {
    method: '游戏力',
    icon: '🎮',
    principle: '以游戏为沟通语言 + 笑声化解对抗',
    applyTo: ['socialEmotion', 'selfCare', 'grossMotor'],
    forbiddenFor: ['严肃说教、惩罚'],
    whyForThisChild: '七杀虚浮+比劫重。强硬对抗只会引爆火势。游戏化让规则变有趣，"谁先收好车"比"快去收玩具"有效100倍。',
  },
  {
    method: '正面管教',
    icon: '🤝',
    principle: '温和而坚定 + 自然后果 + 鼓励而非表扬',
    applyTo: ['socialEmotion', 'selfCare'],
    forbiddenFor: ['溺爱、反复妥协'],
    whyForThisChild: '家人宠爱但火旺反弹。正面管教的"温和"给了他安全感，"坚定"给了边界。不吼不罚但也不让步。',
  },
  {
    method: '费曼学习法(简化版)',
    icon: '👨‍🏫',
    principle: '教别人=最好的学习 + 用自己的话讲出来',
    applyTo: ['mathLogic', 'language', 'financialLit'],
    forbiddenFor: [],
    whyForThisChild: '比劫重喜欢被关注。让他当"小老师"教妈妈/爷爷奶奶，虚荣心（褒义）驱动学习动力。',
  },
];

// ====== 活动 × 方法标注 ======
export function getMethodForActivity(_tags: string[], dimensionId: string): MethodMapping[] {
  return METHODS.filter((m) => m.applyTo.includes(dimensionId));
}

// ====== 每周蒙氏提示 ======
export function getWeeklyMontessoriTip(): string {
  const tips = [
    '秩序敏感期：固定睡前流程（刷牙→读绘本→关灯），顺序不变，安全感自然建立。',
    '感官精致期：提供不同材质的小物件让他摸（木头、金属、布料），丰富感官体验。',
    '语言敏感期：多读少问。"这车什么颜色？"→"这辆红色消防车要去救火了！"，输入量比提问重要。',
    '动作协调期：让他自己来，慢就慢。大人帮他做一次=剥夺他一次学习机会。',
    '社会行为期：角色扮演中学习礼貌，"请""谢谢""对不起"在游戏中自然说出。',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}
