import type { Activity } from '../types';
import type { DimensionId } from '../constants';

function preset(
  title: string,
  description: string,
  dimensionId: DimensionId,
  difficulty: Activity['difficulty'],
  durationMinutes: number,
  materials: string[],
  interactionType: Activity['interactionType'],
  tags: Activity['tags'],
  extra: Partial<Pick<Activity, 'isScreen' | 'isOutdoor'>> = {},
): Activity {
  return {
    title,
    description,
    dimensionId,
    difficulty,
    durationMinutes,
    materials,
    interactionType,
    tags,
    isScreen: extra.isScreen ?? false,
    isOutdoor: extra.isOutdoor ?? false,
    isPreset: true,
    createdAt: new Date().toISOString(),
  };
}

export const seedActivities: Activity[] = [
  // ====== 生活习惯/自理 (selfCare) ======
  preset(
    '自己穿袜子',
    '让孩子自己尝试穿袜子，家长在旁鼓励。可以先从宽松的袜子开始，降低难度。完成后击掌庆祝！',
    'selfCare', 2, 5, ['袜子'], 'guided', [],
  ),
  preset(
    '扣扣子练习',
    '用一件有大纽扣的衣服，手把手教孩子扣扣子。可以先从最上面一颗开始，逐步增加。',
    'selfCare', 2, 8, ['有纽扣的衣服'], 'guided', [],
  ),
  preset(
    '饭后收碗小帮手',
    '吃完饭后请孩子把自己的碗筷送到厨房台面上。给予口头表扬："宝宝真棒，会帮忙了！"',
    'selfCare', 1, 3, [], 'guided', [],
  ),
  preset(
    '玩具停车场收纳',
    '用胶带在地上或收纳盒上划分"停车位"，玩完后所有车必须"入库"。比赛谁停得快！',
    'selfCare', 1, 10, ['收纳盒', '彩色胶带'], 'collaborative', ['car'],
  ),
  preset(
    '自己挤牙膏刷牙',
    '让孩子自己挤牙膏、自己刷牙（家长最后检查补刷）。唱刷牙歌增加趣味。',
    'selfCare', 2, 5, ['儿童牙刷', '牙膏'], 'guided', [],
  ),

  // ====== 数理逻辑 (mathLogic) ======
  preset(
    '停车场数车',
    '把家里的车排成一排，一起数"1、2、3..."，数到多少辆？哪种颜色最多？',
    'mathLogic', 1, 10, ['玩具车（多辆）'], 'companion', ['car'],
  ),
  preset(
    '颜色分类停车场',
    '准备红黄蓝三个"停车场"（纸盒），把对应颜色的车停进去。认识颜色、学习分类。',
    'mathLogic', 1, 10, ['玩具车', '彩色纸盒'], 'collaborative', ['car'],
  ),
  preset(
    '桌游：颜色配对',
    '选择一款颜色/形状配对桌游，轮流翻牌找相同。认识规则，学习轮流。',
    'mathLogic', 2, 15, ['颜色配对桌游'], 'collaborative', ['boardGame', 'pictureBook'],
  ),
  preset(
    '数楼梯',
    '上下楼梯时一起数台阶数。先从1数到10，熟练后尝试倒数。',
    'mathLogic', 1, 5, [], 'companion', [],
  ),
  preset(
    '大小车排队',
    '把车按从大到小排队，认识"最大""最小""比XX大"。用积木搭坡道测试哪辆车滑得远。',
    'mathLogic', 2, 12, ['玩具车', '积木'], 'collaborative', ['car', 'building'],
  ),

  // ====== 财商启蒙 (financialLit) ======
  preset(
    '洗车店游戏',
    '开一家"洗车店"，用湿巾擦车收费（贴纸代币）。洗一辆车=1张贴纸，3张贴纸可以"买"一个小奖励。',
    'financialLit', 2, 15, ['玩具车', '湿巾', '贴纸'], 'collaborative', ['car', 'rolePlay'],
  ),
  preset(
    '超市购物扮演',
    '用家里的零食/玩具摆成小超市，给3个硬币（瓶盖），每次只能选一样。认识"买"和"交换"。',
    'financialLit', 2, 15, ['瓶盖/硬币', '零食/玩具'], 'collaborative', ['rolePlay'],
  ),
  preset(
    '存钱罐计划',
    '准备一个透明存钱罐，约定"每次自己收好玩具就放一枚硬币"。看到钱变多，约定5枚换一个心愿。',
    'financialLit', 2, 5, ['透明存钱罐', '硬币'], 'guided', [],
  ),

  // ====== 社交情感 (socialEmotion) ======
  preset(
    '情绪脸谱游戏',
    '画/打印开心、生气、难过、害怕四张脸。读绘本时问"这个角色现在什么心情？"指认对应脸谱。',
    'socialEmotion', 2, 10, ['情绪卡片', '绘本'], 'guided', ['pictureBook'],
  ),
  preset(
    '桌游：学习轮流和规则',
    '玩一款简单桌游（如飞行棋简化版），强调"轮到你了""等一等"。赢了庆祝，输了说"没关系下次加油"。',
    'socialEmotion', 2, 15, ['儿童桌游'], 'collaborative', ['boardGame'],
  ),
  preset(
    '角色扮演：小老师',
    '让孩子当"老师"，家长当"学生"。孩子教家长做一件事（比如停车入库），练习表达和自信。',
    'socialEmotion', 2, 10, [], 'companion', ['rolePlay'],
  ),
  preset(
    '绘本精读：交朋友的故事',
    '选一本关于交朋友/分享的绘本，读完后讨论："如果你是小熊，你会怎么做？"',
    'socialEmotion', 1, 12, ['社交主题绘本'], 'guided', ['pictureBook'],
  ),

  // ====== 大运动 (grossMotor) ======
  preset(
    '单脚跳比赛',
    '在地上画起点和终点，练习单脚跳。先扶着墙，熟练后放开手。左右脚轮流练习。',
    'grossMotor', 3, 10, ['粉笔/胶带'], 'collaborative', ['outdoor'],
  ),
  preset(
    '平衡木走线',
    '用胶带在地上贴一条直线，像走平衡木一样走。进阶：头顶放一个小玩偶不掉下来。',
    'grossMotor', 2, 8, ['胶带', '小玩偶'], 'companion', [],
  ),
  preset(
    '活力街：跟着跳',
    '打开活力街类体感游戏，跟着屏幕里的动作一起跳。限时15分钟，跳完记得做眼保健操。',
    'grossMotor', 1, 15, ['体感游戏设备'], 'companion', ['activeScreen'], { isScreen: true },
  ),
  preset(
    '障碍跑赛道',
    '用枕头、椅子、毯子搭一个家庭障碍赛道：钻隧道、跨小河、绕大树。计时挑战！',
    'grossMotor', 2, 15, ['枕头', '椅子', '毯子'], 'collaborative', [],
  ),

  // ====== 语言表达 (language) ======
  preset(
    '故事接龙',
    '家长起头"有一天，一辆红色小汽车出门了..."，让孩子接下一句。轮流编故事，越离谱越好玩。',
    'language', 2, 10, [], 'collaborative', ['car'],
  ),
  preset(
    '车迷小主播',
    '拿出3辆车，让孩子介绍每辆车的名字、颜色、用途。家长用手机录音，然后一起回听。',
    'language', 2, 8, ['玩具车', '手机'], 'companion', ['car'],
  ),
  preset(
    '绘本精读：重复句式',
    '选一本有重复句式的绘本（如《好饿的毛毛虫》），读到重复部分让孩子一起念。',
    'language', 1, 12, ['绘本'], 'guided', ['pictureBook'],
  ),

  // ====== 艺术创意 (art) ======
  preset(
    '车轮印画',
    '把玩具车轮子蘸颜料，在纸上滚出彩色轮胎印。观察不同花纹的效果。',
    'art', 1, 15, ['玩具车', '颜料', '大白纸'], 'companion', ['car'],
  ),
  preset(
    '贴纸停车场设计',
    '给一张大白纸画上道路和停车场，用贴纸装饰——"这是洗车店，这是加油站"。',
    'art', 1, 15, ['大白纸', '贴纸', '彩笔'], 'companion', ['car'],
  ),

  // ====== 音乐律动 (music) ======
  preset(
    '车身打击乐',
    '用不同大小的玩具车敲击桌面/地面，听不同音色。跟着儿歌节奏"开车"，重拍时按喇叭"滴滴"。',
    'music', 1, 8, ['玩具车'], 'collaborative', ['car', 'musicDance'],
  ),
  preset(
    '歌词填词游戏',
    '用熟悉的儿歌曲调，把歌词改成关于车的内容。"小燕子→小汽车，穿新衣→跑得快"。',
    'music', 2, 8, [], 'collaborative', ['musicDance'],
  ),

  // ====== 自然探索 (nature) ======
  preset(
    '大户外：自然寻宝',
    '带一个袋子去公园/小区，找5样东西：一片叶子、一颗石头、一朵花、一根树枝、一个松果。回家观察。',
    'nature', 1, 30, ['袋子', '放大镜（可选）'], 'collaborative', ['outdoor'], { isOutdoor: true },
  ),
  preset(
    '观察路上的车',
    '坐在窗边或路边，观察经过的车。"那是什么车？什么颜色？几个轮子？"记录5分钟经过了几辆车。',
    'nature', 1, 10, [], 'companion', ['car', 'outdoor'], { isOutdoor: true },
  ),
  preset(
    'STEAM：沉浮实验',
    '一盆水 + 各种小物件（玩具车、积木、瓶盖、叶子），猜猜哪个沉哪个浮？实验验证！',
    'nature', 2, 15, ['盆', '水', '各种小物件'], 'guided', ['steam'],
  ),
  preset(
    'STEAM：斜坡赛车',
    '用纸板/积木搭不同坡度的斜坡，让玩具车滑下来。哪个坡最快？为什么？',
    'nature', 2, 15, ['纸板/积木', '玩具车'], 'collaborative', ['steam', 'car'],
  ),

  // ====== 🔥 火旺适配：5分钟微活动 (适合注意力短暂的孩子) ======
  preset(
    '快速分类：红车蓝车',
    '拿出5辆车，按颜色分成两堆。数一数红的多还是蓝的多？30秒搞定就击掌！',
    'mathLogic', 1, 3, ['玩具车'], 'guided', ['car'],
  ),
  preset(
    '一分钟穿袜子挑战',
    '计时1分钟，看能不能自己穿上袜子。穿不上也没关系，明天再试试！',
    'selfCare', 1, 3, ['袜子'], 'guided', [],
  ),
  preset(
    '车喇叭节奏',
    '家长拍手打节奏，孩子按玩具车喇叭（嘴里"滴滴"）跟节奏。30秒换一个节奏。',
    'music', 1, 3, [], 'collaborative', ['car', 'musicDance'],
  ),
  preset(
    '快速收纳：三辆车回家',
    '只收三辆车到停车场，收完就结束。不求全收，只求三辆。每天多加一辆。',
    'selfCare', 1, 3, ['收纳盒', '玩具车'], 'guided', ['car'],
  ),

  // ====== 🪙 金弱适配：规则感/结构感训练 ======
  preset(
    '红绿灯过马路',
    '家长举红牌=停、绿牌=走、黄牌=慢。孩子推着车"过马路"。角色互换，孩子当交警。',
    'socialEmotion', 1, 8, ['红黄绿卡纸'], 'collaborative', ['car', 'rolePlay'],
  ),
  preset(
    '修车店排队',
    '3辆车排成一排"等修车"。孩子当修车师傅，一辆一辆修（擦）。学会"等一等""轮到你了"。',
    'selfCare', 1, 8, ['玩具车', '湿巾'], 'collaborative', ['car', 'rolePlay'],
  ),
  preset(
    '积木搭停车场',
    '不是搭塔！用积木搭一个多层停车场，每层停一辆车。搭好就是胜利，推倒重来也可以。',
    'mathLogic', 2, 10, ['积木', '玩具车'], 'collaborative', ['car', 'building'],
  ),
  preset(
    '一句话桌游：车轮颜色',
    '规则就一句话："翻到红色车归你，翻到蓝色车归我"。3分钟结束，不追求完整局数。',
    'socialEmotion', 1, 5, ['颜色配对桌游', '玩具车'], 'companion', ['boardGame', 'car'],
  ),

  // ====== 💧 水弱适配：水元素滋养活动 ======
  preset(
    '给车队洗澡',
    '一盆水 + 几辆不怕水的车，给它们"洗澡"。玩水本身就是滋养本命水元素。',
    'nature', 1, 12, ['盆', '水', '防水玩具车', '小毛巾'], 'companion', ['car', 'steam'],
  ),
  preset(
    '哪辆车游得快',
    '浴缸或水盆里，用手推玩具车在水面上滑。比赛哪辆"游"得快。水+车的双重快乐。',
    'grossMotor', 1, 8, ['浴缸/水盆', '防水玩具车'], 'collaborative', ['car'],
  ),

  // ====== 🫂 情绪管理系列 ======
  preset(
    '生气可以跺脚',
    '教孩子一个替代行为：生气的时候可以大力跺脚三下，但不能打人。家长先示范，孩子跟着做。',
    'socialEmotion', 1, 5, [], 'guided', [],
  ),
  preset(
    '我的情绪小怪兽',
    '读《我的情绪小怪兽》绘本，讨论"你现在是什么颜色？"用颜色表达情绪比直接说更容易。',
    'socialEmotion', 1, 10, ['情绪绘本'], 'guided', ['pictureBook'],
  ),
  preset(
    '请给我vs我要',
    '角色扮演：家长先演"哭闹要东西"，孩子笑。再演"好好说请给我"，对比哪个有效。',
    'socialEmotion', 2, 5, [], 'collaborative', ['rolePlay'],
  ),

  // ====== 🌳 大户外系列（周末深度日） ======
  preset(
    '公园车展',
    '带5辆车去公园，找不同的"地形"给它们开——草地、沙地、水泥地。哪种路面最快？',
    'nature', 1, 25, ['玩具车（5辆）'], 'companion', ['car', 'outdoor'], { isOutdoor: true },
  ),
  preset(
    '骑行探险',
    '骑平衡车/自行车去探险，设定一个目标点（"骑到那棵大树下"）。带上水壶，尊重他的骑行能力。',
    'grossMotor', 2, 25, ['平衡车/自行车', '水壶'], 'companion', ['outdoor'], { isOutdoor: true },
  ),
  preset(
    '石头彩绘车',
    '在公园捡光滑石头，回家用颜料画成小汽车。自然+艺术+车，三合一。',
    'art', 2, 20, ['石头', '颜料', '画笔'], 'companion', ['car', 'outdoor'], { isOutdoor: true },
  ),

  // ====== 🎓 入园准备专项 ======
  preset(
    '自己吃饭练习',
    '用训练筷或勺子自己吃一顿饭。先从不烫的、容易舀的食物开始。吃完大大表扬！',
    'selfCare', 3, 15, ['训练筷/勺子', '碗'], 'guided', [],
  ),
  preset(
    '如厕全套流程',
    '从脱裤子→坐马桶→擦屁股→冲水→洗手，练习整套流程。每步做到就贴一颗星星。',
    'selfCare', 3, 10, ['星星贴纸'], 'guided', [],
  ),
  preset(
    '幼儿园角色扮演',
    '家长演老师，孩子演小朋友。模拟幼儿园场景：排队、举手、自己吃饭、午睡。用玩偶当同学。',
    'socialEmotion', 2, 12, ['玩偶', '小桌子'], 'collaborative', ['rolePlay'],
  ),
  preset(
    '说再见不哭',
    '练习分离场景：妈妈"去上班"（走到门外），孩子数到10，妈妈回来大大的拥抱。逐渐延长。',
    'socialEmotion', 2, 5, [], 'guided', [],
  ),
];
