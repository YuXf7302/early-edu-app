/**
 * 绘本推荐系统
 *
 * 结合：
 * - 月龄 (3岁+，2023年5月出生)
 * - 兴趣 (车迷、桌游、STEAM)
 * - 八字 (丁火从旺格：喜木火土，偏印好学，食神爱表达)
 * - 入园准备需求
 * - 蒙台梭利敏感期 (3-6岁：秩序、感官、语言、动作、社会)
 */

export interface BookRecommendation {
  title: string;
  author: string;
  theme: string;              // 主题标签
  why: string;                // 为什么适合他
  dimension: string;          // 关联的能力维度
  ageRange: string;
  montessoriAlign?: string;  // 蒙氏理念对齐
}

export const BOOKS: BookRecommendation[] = [
  // ====== 车迷专属 ======
  {
    title: '《轱辘轱辘转》',
    author: '理查德·斯凯瑞',
    theme: '车·观察力',
    why: '几百种车藏在每一页，火旺的孩子能专注找很久。偏印好学，画面信息量越大越兴奋。',
    dimension: 'language',
    ageRange: '2-5岁',
    montessoriAlign: '感官敏感期 — 视觉搜索与细节观察',
  },
  {
    title: '《开车出发》系列',
    author: '间濑直方',
    theme: '车·自然',
    why: '车+自然=木生火的完美组合。全景式画面满足他的好奇心，食神爱美的天性。',
    dimension: 'nature',
    ageRange: '2-4岁',
  },
  {
    title: '《汽车嘟嘟嘟》系列',
    author: '竹下文子',
    theme: '车·社会认知',
    why: '每种车的工作场景。比劫重的孩子需要了解"每个人（每辆车）都有自己的工作"，为入园做准备。',
    dimension: 'socialEmotion',
    ageRange: '2-4岁',
  },

  // ====== 情绪管理（入园刚需） ======
  {
    title: '《我的情绪小怪兽》',
    author: '安娜·耶纳斯',
    theme: '情绪·颜色',
    why: '用颜色表达情绪，比直接说"我生气了"容易100倍。火旺的孩子需要具象化的情绪出口。',
    dimension: 'socialEmotion',
    ageRange: '2-5岁',
    montessoriAlign: '情绪认知 — 具象化抽象情绪',
  },
  {
    title: '《菲菲生气了》',
    author: '莫莉·卞',
    theme: '情绪·自然疗愈',
    why: '菲菲生气时跑到大自然里，火气被木（自然）化解。木生火的从旺格正需要这个。',
    dimension: 'socialEmotion',
    ageRange: '3-6岁',
  },
  {
    title: '《小手不是用来打人的》',
    author: '玛蒂娜·阿加西',
    theme: '行为·替代',
    why: '不给否定("不可以打人")，给替代方案("手可以用来画画、挥手、帮忙")。顺势引导，不硬压。',
    dimension: 'socialEmotion',
    ageRange: '2-4岁',
  },

  // ====== 生活自理 ======
  {
    title: '《阿立会穿裤子了》',
    author: '神泽利子',
    theme: '自理·成就感',
    why: '阿立学穿裤子失败了很多次最后成功。比劫重的孩子需要看到"别人也在学"来降低挫败感。',
    dimension: 'selfCare',
    ageRange: '2-4岁',
  },
  {
    title: '《小熊宝宝》系列',
    author: '佐佐木洋子',
    theme: '习惯·日常',
    why: '吃饭、刷牙、上厕所……每本一个生活场景。仪式感建立的最温和方式。固定睡前读两本，习惯就内化了。',
    dimension: 'selfCare',
    ageRange: '1-3岁',
    montessoriAlign: '秩序敏感期 — 建立日常生活节奏',
  },

  // ====== 数理逻辑 ======
  {
    title: '《首先有一个苹果》',
    author: '伊东宽',
    theme: '数数·因果',
    why: '混乱中诞生秩序的数数故事。火旺的孩子喜欢"越来越热闹"的情节，数数自然融入。',
    dimension: 'mathLogic',
    ageRange: '2-4岁',
  },
  {
    title: '《100层的巴士》',
    author: '麦克·史密斯',
    theme: '数字·想象力',
    why: '巴士每上一层就发生奇遇。车+数数+想象力=三重兴趣叠加，想不专注都难。',
    dimension: 'mathLogic',
    ageRange: '3-6岁',
  },

  // ====== 财商启蒙 ======
  {
    title: '《小兔子学花钱》系列',
    author: '麦克劳德',
    theme: '财商·选择',
    why: '巳中庚金弱，需要具象化的"花钱"概念。小兔子每周有3根胡萝卜（零花钱），每次只能选一样。',
    dimension: 'financialLit',
    ageRange: '3-6岁',
  },
  {
    title: '《妈妈，钱是什么？》',
    author: '格里·贝利',
    theme: '财商·基础',
    why: '用故事讲钱的历史：贝壳→金币→纸币→手机支付。偏印好学，喜欢"为什么"类知识。',
    dimension: 'financialLit',
    ageRange: '3-6岁',
  },

  // ====== STEAM/探索 ======
  {
    title: '《DK儿童科学百科全书》',
    author: 'DK出版社',
    theme: '科学·图鉴',
    why: '不是从头读到尾，而是每天翻一页感兴趣的。偏印的广撒网学习方式，图多字少正合适。',
    dimension: 'nature',
    ageRange: '3-8岁',
  },
  {
    title: '《水从哪里来》',
    author: '郭英直',
    theme: '水·科学',
    why: '从旺格忌水但不是怕水。了解水的循环，让"水"从威胁变成知识，化忌为喜。',
    dimension: 'nature',
    ageRange: '3-6岁',
    montessoriAlign: '文化敏感期 — 宇宙教育萌芽',
  },
];

// 按维度/主题获取推荐
export function getBooksByDimension(dimension: string): BookRecommendation[] {
  return BOOKS.filter((b) => b.dimension === dimension);
}

export function getBooksByTheme(theme: string): BookRecommendation[] {
  return BOOKS.filter((b) => b.theme.includes(theme));
}

// 本周主题推荐（最多3本）
export function getWeeklyBooks(themeName?: string, count: number = 3): BookRecommendation[] {
  if (!themeName) {
    // 默认：情绪+自理+车
    return [
      BOOKS.find((b) => b.title.includes('情绪小怪兽'))!,
      BOOKS.find((b) => b.title.includes('小熊宝宝'))!,
      BOOKS.find((b) => b.title.includes('开车出发'))!,
    ].filter(Boolean).slice(0, count);
  }
  // 基于主题名匹配
  const matched = BOOKS.filter(
    (b) => b.theme.includes(themeName) || b.dimension.includes(themeName),
  );
  return matched.slice(0, count);
}
