import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import CursorLightTrail from './components/motion/CursorLightTrail.jsx';
import IntroLoader from './components/motion/IntroLoader.jsx';
import PageTransitionOverlay from './components/motion/PageTransitionOverlay.jsx';
import ScrambleText from './components/motion/ScrambleText.jsx';
import WorkOpenTransition from './components/motion/WorkOpenTransition.jsx';
import WorksAmbientLayer from './components/motion/WorksAmbientLayer.jsx';
import usePrefersReducedMotion from './components/motion/usePrefersReducedMotion.js';

const MotionDirector = lazy(() => import('./components/motion/MotionDirector.jsx'));

const navItems = [
  { label: '介绍', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '视频', href: '#videos' },
  { label: '优势', href: '#strengths' },
];

const viewIds = ['top', 'about', 'projects', 'videos', 'strengths', 'contact'];
const transitionLabels = {
  top: 'ZHANG HAOYU',
  about: 'ABOUT',
  projects: 'WORKS',
  videos: 'VIDEO',
  strengths: 'METHOD',
  contact: 'CONTACT',
};

function getHashView(hash) {
  const normalizedHash = String(hash || '#top').replace('#', '') || 'top';
  return viewIds.includes(normalizedHash) ? normalizedHash : 'top';
}

function getInitialView() {
  if (typeof window === 'undefined') {
    return 'top';
  }

  return getHashView(window.location.hash);
}

function getViewClassName(baseClassName, view, activeView) {
  return `${baseClassName} top-entry-view ${activeView === view ? 'is-active' : 'is-hidden'}`;
}

function getWorkMotionType(project) {
  if (!project) {
    return 'archive';
  }

  if (project.layout === 'virtual-human-case') {
    return 'portrait-scan';
  }

  if (project.layout === 'toy-ip-case') {
    return 'toy-pop';
  }

  if (project.layout === 'brand-kv-case') {
    return 'poster-wipe';
  }

  if (project.layout === 'poster-sketch-case') {
    return 'poster-wipe';
  }

  if (project.layout === 'packaging-case') {
    return 'package-fold';
  }

  if (project.layout === 'wide-case') {
    return 'blueprint-pan';
  }

  if (project.layout === 'guitar-tuner-case') {
    return 'audio-scan';
  }

  return 'archive';
}

const stats = [
  { value: '7+', label: '项目档案方向' },
  { value: '2', label: '设计学位' },
  { value: '24-26', label: '装饰设计经历' },
  { value: 'AI+', label: 'AIGC 工作流实践' },
];

const videoLibraryItems = [
  {
    id: 'video-slot-01',
    poster: '/assets/videos/death-stranding-2-cover.png',
    videoSrc: '/assets/videos/death-stranding-2-on-the-beach.mp4',
    title: 'DEATH STRANDING 2: ON THE BEACH',
    date: '',
    tags: [],
    description:
      '以死亡搁浅周边雨伞为故事主线的产品宣传CG，故事发生在虚空噬灭的早期，一个少年拿到了一把能对抗命运的雨伞，但他会回来吗？',
    duration: '',
  },
  {
    id: 'video-slot-02',
    poster: '/assets/videos/heineken-cowboy-commercial-mv-cover.webp',
    videoSrc: '/assets/videos/heineken-cowboy-commercial-mv.mp4',
    title: 'Desert Brew MV',
    date: '2026',
    tags: ['Commercial MV', 'Heineken Beer', 'AI Music Video'],
    description:
      '他们说，别在日落后运啤酒穿过荒漠。可那天，火车还是来了。车上装满喜力啤酒，车外是风、沙，还有 Professor-E。他从山脊冲下来，像一颗喝过酒的子弹。马蹄贴着铁轨，枪声打在节拍上，整列火车在夕阳里发抖。等人们反应过来，货厢门已经开了，啤酒桶滚进尘土，Professor-Z 和一群疯子消失在西边。',
    duration: '01:33',
  },
  {
    id: 'video-slot-03',
    poster: '/assets/videos/skeleton-2026ss-cover.webp',
    videoSrc: '/assets/videos/skeleton-2026ss.mp4',
    title: 'SKELETON 2026SS',
    date: '2026',
    tags: ['Fashion Film', 'CRT Glitch', 'Skeleton System'],
    description: '以骨骼、电视噪点和故障色散构成 2026SS 服装影像，强调暗场质感和视觉冲击。',
    duration: '01:04',
  },
  {
    id: 'video-slot-04',
    poster: '/assets/videos/professor-z-neural-lab-cover.webp',
    videoSrc: '/assets/videos/professor-z-neural-lab.mp4',
    title: 'Abrasion',
    date: '2026',
    tags: ['Virtual Human', 'AIGC Video', 'Red Lab'],
    description:
      '灵魂是可以被反复擦写的，只要你有一张好椅子。神经接入口打开的那一刻，你的记忆、情感、人格，都变成了可读写的文件。掠夺、战斗、逃亡——每上线一次，系统就自动生成一段新的人格代码，覆盖掉一小片旧的你。',
    duration: '00:32',
  },
  {
    id: 'video-slot-05',
    poster: '/assets/videos/neon-alley-gunfight-cover.webp',
    videoSrc: '/assets/videos/neon-alley-gunfight.mp4',
    title: 'NEON ALLEY GUNFIGHT',
    date: '2026',
    tags: ['Cyberpunk Action', 'AIGC Video', 'Comic Motion'],
    description: '以蓝红霓虹巷战、机械角色和漫画线稿质感，完成一支赛博动作影像测试。',
    duration: '00:21',
  },
  {
    id: 'video-slot-06',
    poster: '/assets/videos/e-ren-cultural-creative-cover.webp',
    videoSrc: '/assets/videos/e-ren-cultural-creative.mp4',
    title: '蒜鸟～蒜鸟',
    date: '2026',
    tags: ['Cultural Creative', 'Brand Film', 'End Board'],
    description: '短片围绕蒜鸟有趣的 IP 形象结合实景照片，去宣传蒜鸟这个可爱的文创产品以及武汉这座城市。',
    duration: '00:15',
  },
];

const videoItems = [
  videoLibraryItems[0],
  videoLibraryItems[1],
  videoLibraryItems[3],
  videoLibraryItems[4],
  videoLibraryItems[2],
  videoLibraryItems[5],
].filter(Boolean);

const guitarTunerProcessSections = [
  {
    id: 'recording-problem',
    label: '问题起点',
    title: '手机录下来的吉他弹唱，坏处会叠在一起。',
    text:
      '第一轮处理暴露得很直接：人声偏小，低频嗡声重，个别音跑偏，吉他又会把歌词盖住。这个插件不是先做一个漂亮界面，而是先把这些真实录音问题拆开。',
    tags: ['人声小', '低频嗡', '吉他遮挡'],
  },
  {
    id: 'command-mvp',
    label: 'MVP',
    title: '先在命令行里跑通，再考虑产品界面。',
    text:
      '早期链路用 Demucs 分离 vocals 和 no_vocals，再用 Python 做音高检测、轻修、EQ、压缩和限幅。能输出 wav、mp3 和处理报告之后，才开始整理成网页工作台。',
    tags: ['Demucs', 'Python', '离线处理'],
  },
  {
    id: 'natural-tuning',
    label: '自然修音',
    title: '从“拉准”改成“轻修”。',
    text:
      '强行贴最近半音会让弹唱变硬，所以默认改成轻修：只处理稳定长音和明显跑偏的片段，保留滑音、尾音和气口。听感比参数更早进入判断链。',
    tags: ['轻修', '保留尾音', '不硬拉'],
  },
  {
    id: 'reference-guided',
    label: '原版参考',
    title: '原版只当参照，不进最终混音。',
    text:
      '一键流程会从原版里学习旋律和调性，再用 F0、chroma 和 DTW 对齐弹唱人声。它跟随原曲的方向，但不把原版音频混进输出文件。',
    tags: ['F0', 'chroma', 'DTW 对齐'],
  },
  {
    id: 'local-product',
    label: '产品化',
    title: '本地网页把信号链摆到用户面前。',
    text:
      '最终工作台按录入、录音修复、修音、人声声卡、吉他增强、母带和输出组织。用户能拿到 MP3、WAV、人声、吉他和 JSON 报告，过程可复查。',
    tags: ['七步信号链', '本地网页', '报告输出'],
  },
];

const guitarTunerVisualBoards = [
  {
    id: 'cover',
    title: '产品入口',
    image: '/assets/guitar-tuner-cover.png',
    text: '封面把本地引擎、原版歌曲上传、弹唱录音上传和七步流程放在同一屏，让访客先知道它真的能跑。',
  },
  {
    id: 'workflow',
    title: '七步工作台',
    image: '/assets/guitar-tuner-interface.png',
    text: '界面不让用户猜参数，而是按信号链检查：录入、修复、修音、人声、吉他、母带、输出，一步一步往下走。',
  },
  {
    id: 'result',
    title: '输出与复查',
    image: '/assets/guitar-tuner-system.png',
    text: '最后一屏只保留能交付的东西：试听 MP3、母带 WAV、人声、吉他和报告。本地处理，不主动上传音频。',
  },
];

const guitarTunerTechCards = [
  ['Demucs', '把弹唱拆成人声和吉他/伴奏，为后面的修音和混音留出空间。'],
  ['librosa.pyin', '提取人声 F0，用来判断稳定长音和明显跑偏的片段。'],
  ['DTW', '把原版旋律和弹唱人声按时间对齐，解决唱法速度不一样的问题。'],
  ['split-band de-esser', '只压 5.2-9.2 kHz 的齿音和分离毛刺，不把整个人声削暗。'],
  ['guitar ducking', '人声出现时让吉他清晰度频段轻轻后退，歌词会更靠前。'],
  ['-14 LUFS / -1 dBTP', '母带目标偏保守，适合流媒体转码，也给吉他弹唱保留动态。'],
];

const guitarTunerOutputFacts = [
  ['处理方式', '本地离线处理，不主动上传音频。'],
  ['输出文件', 'MP3、WAV、人声、吉他和 JSON 报告。'],
  ['默认取向', '人声自然靠前，吉他避让，母带不过载。'],
  ['当前边界', '它是可演示原型，还不是实时 VST 插件。'],
];

const welfareParkCaseBoards = [
  {
    id: 'layout-01',
    title: '福利公园系统设计展板 01',
    image: '/assets/welfare-park/layout-board-01.webp',
  },
  {
    id: 'layout-02',
    title: '福利公园系统设计展板 02',
    image: '/assets/welfare-park/layout-board-02.webp',
  },
  {
    id: 'layout-03',
    title: '福利公园系统设计展板 03',
    image: '/assets/welfare-park/layout-board-03.webp',
  },
  {
    id: 'layout-04',
    title: '福利公园系统设计展板 04',
    image: '/assets/welfare-park/layout-board-04.webp',
  },
  {
    id: 'layout-05',
    title: '福利公园系统设计展板 05',
    image: '/assets/welfare-park/layout-board-05.webp',
  },
];

const posterSketchPosters = [
  {
    id: 'poster-batman',
    title: '雨夜对峙',
    image: '/assets/poster-sketch/poster-01-batman.webp',
  },
  {
    id: 'poster-dragon-book',
    title: '龙书森林',
    image: '/assets/poster-sketch/poster-02-dragon-book.webp',
  },
  {
    id: 'poster-window-story',
    title: '窗边告白',
    image: '/assets/poster-sketch/poster-03-window-story.webp',
  },
  {
    id: 'poster-film-city',
    title: '土气影城',
    image: '/assets/poster-sketch/poster-04-film-city.webp',
  },
];

const posterSketchSketches = [
  {
    id: 'sketch-blue-eyes',
    title: '青眼白龙',
    image: '/assets/poster-sketch/sketch-01-blue-eyes-dragon.webp',
    featured: true,
  },
  {
    id: 'sketch-mecha-lineup',
    title: '机甲线稿',
    image: '/assets/poster-sketch/sketch-02-mecha-lineup.webp',
    featured: true,
  },
  {
    id: 'sketch-brain',
    title: '黑底图形',
    image: '/assets/poster-sketch/sketch-05-your-brain.webp',
  },
  {
    id: 'sketch-orbit',
    title: '轨道光环',
    image: '/assets/poster-sketch/sketch-06-orbit-scene.webp',
  },
];

const brandKvCaseSections = [
  {
    id: '7up-indoor-01',
    group: 'seven-up',
    brand: '7UP x Fido Dido',
    scene: '七喜室内活动 KV 01',
    format: 'Indoor retail',
    image: '/assets/brand-kv/7up-fido-indoor-store-kv-01-v1.jpg',
    copy: '走进 Fido Dido 的柠檬气泡商店，七喜已经为你冰好了。',
    design:
      '画面用联名商店做核心场景，把冰柜、货架、周边和角色装置集中在同一空间里。绿色和黄色负责建立七喜的清凉感，Fido Dido 手持产品靠近镜头，让“为你服务”的活动主题更像一次现场招呼。',
    tags: ['联名商店', '冰柜货架', '角色互动'],
  },
  {
    id: '7up-indoor-02',
    group: 'seven-up',
    brand: '7UP x Fido Dido',
    scene: '七喜室内活动 KV 02',
    format: 'Close-up poster',
    image: '/assets/brand-kv/7up-fido-indoor-store-kv-02-v1.jpg',
    copy: '这个夏天，进店就有人把清爽递到你手里。',
    design:
      '第二张把镜头推近，放大角色、罐身水珠和手写字体的冲击力。前景的大罐七喜与 Fido Dido 形成双主角关系，适合做室内灯箱、门店海报或社媒首图，信息更集中，记忆点也更直接。',
    tags: ['近景产品', '室内灯箱', '社媒首图'],
  },
  {
    id: '7up-outdoor-01',
    group: 'seven-up',
    brand: '7UP x Fido Dido',
    scene: '七喜室外活动 KV 01',
    format: 'Beach pop-up',
    image: '/assets/brand-kv/7up-fido-beach-store-kv-01-v1.jpg',
    copy: '海边开店，气泡开闸，保持自我也可以很轻松。',
    design:
      '室外版把联名商店放到海滩场景中，阳光、木平台、海浪和水花让活动从“店内消费”延展到“夏日目的地”。大面积绿色保持品牌识别，蓝天和沙滩补足户外度假感。',
    tags: ['户外快闪', '海边打卡', '水花动势'],
  },
  {
    id: '7up-outdoor-02',
    group: 'seven-up',
    brand: '7UP x Fido Dido',
    scene: '七喜室外活动 KV 02',
    format: 'Experience scene',
    image: '/assets/brand-kv/7up-fido-beach-store-kv-02-v1.jpg',
    copy: '和 Fido Dido 一起，把夏天冲成一场柠檬气泡浪。',
    design:
      '这张更偏动作镜头，角色坐在装置上拉出水流，画面从静态商店转成互动体验。产品罐、车体装置、喷溅水花和右侧大字形成强动势，适合强调活动现场的打卡属性。',
    tags: ['互动装置', '动作镜头', '打卡属性'],
  },
  {
    id: 'hema-indoor',
    group: 'hema',
    brand: '盒马鲜生',
    scene: '盒马室内活动 KV',
    format: 'Indoor cooking',
    image: '/assets/brand-kv/hema-seafood-indoor-kv-v1.jpg',
    copy: '鲜活海一刻，盒马现炒现享。',
    design:
      '室内版用厨房和现炒动作建立“新鲜马上发生”的感觉。盒马主角色穿厨师服，锅里的虾蟹贝类被火焰和水花托起，蓝色主视觉里加入橙红色食材和火光，让“海鲜”“热锅”“门店活动”同时被看见。',
    tags: ['现炒现场', '海鲜食材', '门店活动'],
  },
  {
    id: 'hema-outdoor',
    group: 'hema',
    brand: '盒马鲜生',
    scene: '盒马室外活动 KV',
    format: 'Outdoor market',
    image: '/assets/brand-kv/hema-seafood-outdoor-kv-v1.jpg',
    copy: '把海鲜市集搬到街边，今天的鲜味就这么简单。',
    design:
      '室外版把盒马鲜生做成一个开放式小街区：海鲜档、熟食铺、市集摊位、顾客和角色都在同一张图里。它更像活动落地场景图，重点不是单个产品，而是让观众看到盒马可以把买、逛、吃放在一个轻松的现场里。',
    tags: ['开放市集', '场景落地', '买逛吃'],
  },
];

const xiaoniaozhuoCaseSections = [
  {
    id: 'overview',
    title: '整体包装效果',
    image: '/assets/xiaoniaozhuo/xiaoniaozhuo-overview.jpg',
    text: '用完整场景图建立第一印象：山地苹果、树屋、采摘人物和包装盒一起出现，让品牌从单个产品变成有地域叙事的助农案例。',
    tags: ['主视觉', '包装组合', '场景叙事'],
  },
  {
    id: 'detail',
    title: '插画表意与包装细节',
    image: '/assets/xiaoniaozhuo/xiaoniaozhuo-detail.jpg',
    text: '把宣传册、种植流程、摘心套袋等农业步骤转译成插画语言，既说明产品来源，也保留亲和、自然、可传播的视觉气质。',
    tags: ['插画系统', '过程说明', '包装细节'],
  },
  {
    id: 'packaging',
    title: '箱型结构与落地规格',
    image: '/assets/xiaoniaozhuo/xiaoniaozhuo-packaging.jpg',
    text: '通过运输箱、礼盒 A、礼盒 B 和刀模展开呈现真实落地能力，能看到包装从概念到生产规格的完整链条。',
    tags: ['箱型结构', '礼盒规格', '落地物料'],
  },
];

const virtualHumanCaseSections = [
  {
    id: 'portrait',
    title: '一张不属于同一世纪的脸',
    image: '/assets/virtual-human/professor-z-portrait.png',
    text: '黄铜眼镜、混沌星轨纹与半遮耳尖共同构成 Professor-Z 的识别锚点。远看是学者，靠近才会意识到他不完全属于人类时间线。',
    tags: ['人物胸像', '黄铜眼镜', '猞猁式耳尖'],
  },
  {
    id: 'turnaround',
    title: '多角度拍摄',
    image: '/assets/virtual-human/professor-z-turnaround.jpg',
    text: '正面、三分侧与侧影用于锁定面部比例、眼镜结构和耳尖破绽，让角色不是一张漂亮单图，而是可持续生成的视觉系统。',
    tags: ['角色比例', '侧脸轮廓', '生成一致性'],
  },
  {
    id: 'astrologer-poster',
    title: '古代占星师宣传海报',
    image: '/assets/virtual-human/professor-z-astrologer-poster.jpg',
    text: '1492 年的地中海港城是他的起点。海报把航海、星盘和档案记录放在同一个历史光源里，强调他只记录、只旁观、只做最小的纠偏。',
    tags: ['1492 地中海', 'Scholar-Astrologer', '历史旁观者'],
  },
  {
    id: 'fashion-poster',
    title: '现代服装模特图',
    image: '/assets/virtual-human/professor-z-fashion-poster.jpg',
    text: '当代身份不是神秘主义表演者，而是克制、疏离的学者型占星师。黑色长衣与黄铜配件让永生被伪装成职业气质。',
    tags: ['现代伪装', '黑色长衣', '冷静疏离'],
  },
  {
    id: 'fashion-board',
    title: '现代服装设定图',
    image: '/assets/virtual-human/professor-z-fashion-board.png',
    text: '服装板整理正面、侧面、背面、包袋、手套、星芒胸针与眼镜链，说明角色如何从头像延展到完整可拍摄造型。',
    tags: ['服装系统', '配饰档案', '造型延展'],
  },
  {
    id: 'patek-poster',
    title: '6102P 概念商业代言视觉',
    image: '/assets/virtual-human/professor-z-patek-6102p-poster.jpg',
    text: '商业视觉把星图、月相和手腕上的时间装置连接起来。这里是 6102P 概念代言方向，不暗示官方合作关系。',
    tags: ['概念商业视觉', 'Moon Phase', 'Sky Chart'],
  },
  {
    id: 'watch-contact-sheet',
    title: '手表多角度展示',
    image: '/assets/virtual-human/professor-z-watch-contact-sheet.jpg',
    text: '多镜头近景把人物、眼镜链、手腕和星图纸面组合成一组可用于商业物料的影像证据，时间成为他的唯一饰品。',
    tags: ['近景镜头', '手表展示', '商业影像'],
  },
];

const virtualHumanJourneyScenes = [
  {
    id: 'baichuan-origin',
    act: '第一幕',
    title: '缘起 · 松壑云桥',
    image: '/assets/virtual-human/professor-z-baichuan-01-origin.jpg',
    text: '雾气把石桥、古松和瀑布压成一页湿润档案。白川以鹤羽与半侧目光进入画面，肩膀停着一只丹顶鹤幼雏，Professor-Z 第一次意识到这段东方路途不会只是一场旁观。',
    tags: ['松壑云桥', '初遇', '鹤羽步摇'],
  },
  {
    id: 'baichuan-companion',
    act: '第二幕',
    title: '同行 · 漓江竹筏',
    image: '/assets/virtual-human/professor-z-baichuan-02-companion.jpg',
    text: '漓江晨雾把群峰和倒影折成近乎对称的星盘。Professor-Z 沿羊皮纸星图划线讲解，白川捧着青瓷茶盏，茶雾隔在两人之间，让观察慢慢变成同行。',
    tags: ['漓江竹筏', '羊皮纸星图', '同行'],
  },
  {
    id: 'baichuan-stargazing',
    act: '第三幕',
    title: '观星 · 敦煌月夜沙丘',
    image: '/assets/virtual-human/professor-z-baichuan-03-stargazing.jpg',
    text: '银河从鸣沙山上空倾泻而下，黄铜望远镜对准北斗。白川的鹤氅被夜风掀起如振翅，身后的鹤影沙纹让 Professor-Z 在星序之外读到另一条来历。',
    tags: ['敦煌月夜', '黄铜望远镜', '鹤影'],
  },
  {
    id: 'baichuan-inquiry',
    act: '第四幕',
    title: '问道 · 黄山云海孤松',
    image: '/assets/virtual-human/professor-z-baichuan-04-inquiry.jpg',
    text: '云海吞没万峰，只留下孤松与刻有星宿的石台。Professor-Z 摘下黄铜眼镜，露出完整面容；白川以鹤翎笔蘸朱砂添注，像替人形档案写下第一次被回应的旁注。',
    tags: ['黄山云海', '步天歌', '朱砂添注'],
  },
  {
    id: 'baichuan-return',
    act: '第五幕',
    title: '归途 · 江南烟雨水巷',
    image: '/assets/virtual-human/professor-z-baichuan-05-return.jpg',
    text: '暮春雨声落在乌篷船与油纸伞上，伞面二十八宿缓慢旋转。白川怀中夹着鹤羽书签的《开元占经》，Professor-Z 罕见地露出极浅笑意，归途成为一段被允许保存的记忆。',
    tags: ['江南烟雨', '开元占经', '归途'],
  },
];

const projects = [
  {
    title: '虚拟人物设计',
    type: 'Professor-Z / Immortal Archive',
    year: '2026',
    image: '/assets/virtual-human/professor-z-portrait.png',
    tone: 'brass',
    accent: '#caa86a',
    layout: 'virtual-human-case',
    caseSections: virtualHumanCaseSections,
    journeyScenes: virtualHumanJourneyScenes,
    skillType: '角色视觉 / AIGC 镜头型',
    previewLabel: '展开人形档案',
    detailPromise: '12 张视觉资产展示胸像、多角度、古代占星师、现代服装、6102P 概念商业视觉与白川东方游历五幕。',
    status: '已补充角色档案',
    description:
      'Professor-Z 出生于 1492 年的地中海港城，从航海、星象与历史记录开始，把自己活成一份持续更新的人形档案。',
    tags: ['Professor-Z', '虚拟人 IP', '人形档案', '学者型占星师'],
  },
  {
    title: '潮玩 IP 设计',
    type: 'Toy IP / Character System',
    year: '2026',
    image: '/assets/toy-ip/band-home-glass-source.png',
    tone: 'lime',
    accent: '#13e65f',
    layout: 'toy-ip-case',
    skillType: '强视觉 / 潮玩 IP 案例',
    previewLabel: '展开角色档案',
    detailPromise: '查看乐队合照、成员切换、海报档案和角色视觉系统。',
    status: '重点展开案例',
    description:
      '以角色设定、表情体系、配色策略和衍生物料为核心的潮玩 IP 视觉方案。',
    tags: ['IP', '角色设计', '潮玩', '衍生品'],
  },
  {
    title: '品牌活动 KV 主视觉',
    type: 'Brand Campaign / Key Visual',
    year: '2026',
    image: '/assets/brand-kv/7up-fido-indoor-store-kv-01-v1.jpg',
    tone: 'orange',
    accent: '#24ce63',
    layout: 'brand-kv-case',
    caseSections: brandKvCaseSections,
    skillType: '品牌活动 / KV 场景延展型',
    previewLabel: '展开活动 KV 档案',
    detailPromise: '6 张活动主视觉覆盖七喜联名商店、海边快闪、盒马室内现炒和室外市集。',
    status: '已补充活动 KV',
    description:
      '七喜 x Fido Dido 与盒马鲜生活动 KV 视觉归档，重点展示活动主题、场景搭建、角色关系和门店传播落地。',
    tags: ['七喜联名', '盒马鲜生', '活动 KV', '场景延展'],
  },
  {
    title: '子洲县山地苹果小鸟啄',
    type: 'Agriculture Brand / Product Design',
    year: '2023',
    image: '/assets/xiaoniaozhuo/xiaoniaozhuo-overview-card-v2.webp',
    tone: 'green',
    accent: '#9ac45a',
    layout: 'packaging-case',
    caseSections: xiaoniaozhuoCaseSections,
    skillType: '助农品牌 / 包装落地型',
    previewLabel: '展开包装案例',
    detailPromise: '3 张完整图版展示整体包装、插画表意和箱型规格。',
    status: '已补充案例',
    description:
      '子洲县山地苹果助农产品包装设计，以小鸟、果树、采摘人物和苹果场景建立亲和、自然、可落地的品牌记忆。',
    tags: ['助农品牌', '包装设计', '插画系统', '产品落地'],
  },
  {
    title: '日本大阪萩之茶屋福利公园系统设计',
    type: 'Landscape / Public Welfare System',
    year: '2022',
    image: '/assets/welfare-park/board-01-card-reference-v2.webp',
    tone: 'welfare',
    accent: '#73ff2a',
    layout: 'wide-case',
    caseBoards: welfareParkCaseBoards,
    skillType: '景观系统 / 学术案例型',
    previewLabel: '展开横向展板',
    detailPromise: '5 张横向图面完整展示区位问题、设计策略、系统网络、节点场景和未来愿景。',
    status: '横向展板案例',
    description:
      '以景观公平视角重组萩之茶屋公共空间问题，将福利服务、路径网络和节点公园整合为城市支持系统。',
    tags: ['景观公平', '福利公园', '系统蓝图', '城市研究'],
  },
  {
    title: '海报与手绘零星展示',
    type: 'Poster / Sketch Archive',
    year: '2021-2026',
    image: '/assets/poster-sketch/poster-01-batman.webp',
    tone: 'ink',
    accent: '#f5f0e8',
    layout: 'poster-sketch-case',
    posterItems: posterSketchPosters,
    sketchItems: posterSketchSketches,
    archiveCode: 'PS-26',
    skillType: '视觉归档',
    previewLabel: '打开作品墙',
    detailPromise: '4 张海报，4 张手绘与设定图。',
    status: '持续更新',
    description: '海报、手绘、角色设定与图形实验。',
    tags: ['海报', '手绘', '设定', '图形'],
  },
  {
    title: '吉他弹唱调音插件',
    type: 'AIGC Tool / Audio AI',
    year: '2026',
    image: '/assets/guitar-tuner-cover.png',
    tone: 'red',
    accent: '#ff2a14',
    layout: 'guitar-tuner-case',
    skillType: '产品 Demo / 工具流程型',
    previewLabel: '展开研发过程',
    detailPromise: '30 秒视频、研发图文、七步信号链和输出文件说明。',
    status: '可演示原型',
    description:
      '用 Codex 协作完成的本地音频处理原型，把人声分离、参考旋律修音、吉他增强和母带输出整理成可演示流程。',
    tags: ['Codex', 'Python', '音频处理', 'AI Workflow'],
  },
];

const strengths = [
  {
    title: '视觉审美与版式控制',
    text: '把信息层级、图面密度和视觉节奏当成设计判断的核心，避免作品只停留在好看的单张图。',
    mark: 'Visual System',
    evidence: ['主视觉与品牌延展', '作品集叙事排序', '复杂图面信息组织'],
  },
  {
    title: 'AIGC 快速学习能力',
    text: '把 Codex、图像生成、视频生成和自动化工具当成真实生产力，能把新工具转成可展示流程。',
    mark: 'AI Workflow',
    evidence: ['Codex 协作开发', '生成式视觉生产', '流程拆解与验证'],
  },
  {
    title: '跨专业设计背景',
    text: '环境艺术与风景园林训练带来空间、场景、系统和叙事视角，可转译到品牌视觉与 AI 镜头设计。',
    mark: 'Spatial Logic',
    evidence: ['城市系统研究', '空间节点组织', '场景化视觉表达'],
  },
  {
    title: '从想法到原型的执行',
    text: '不只停留在概念图，能把作品整理为页面、工具、视频和可复用资产，让项目有继续迭代的基础。',
    mark: 'Prototype',
    evidence: ['网页落地', '本地工具原型', '案例素材归档'],
  },
];

const experience = [
  '2017-2021 西安建筑科技大学 环境艺术设计 本科',
  '2021-2024 西安建筑科技大学 风景园林 硕士',
  '2024.03-2026.03 中建八局西南分公司 装饰设计师',
  '2026-现在 AIGC 视觉、品牌与 AI 视频方向转型',
];

const toyIpMembers = [
  {
    id: 'band',
    label: '乐队合照',
    shortName: 'BAND',
    role: 'Morale Charge / Band System',
    accent: '#ff2a14',
    keywords: ['四人乐队', 'Neo comic', '合影档案', '海报系统'],
    spreads: [
      {
        layout: 'band-cover',
        kicker: '01 Band Cover',
        title: 'MORALE CHARGE',
        subtitle: 'Band / Toy IP System',
        caption: '四位成员在蓝色舞台光里完成合体：焰牙的红、墨碧的黑绿、破晓的黄绿和银珀的金属银，被压进同一张乐队主视觉。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'BLUE STAGE / GROUP COVER',
        },
        images: [
          {
            src: '/assets/toy-ip/band/group-blue-stage.png',
            label: 'Blue stage group portrait',
            frame: 'band-hero',
            fit: 'contain',
          },
        ],
        tags: ['Band cover', 'Blue backlight', 'Toy IP entrance', 'Stage system'],
        writeups: [
          {
            title: '视觉定位',
            text: '这一页作为乐队合照板块入口，让四个角色先以统一阵列出现，再引导到成员、档案和海报系统。',
          },
          {
            title: '情绪关键词',
            text: '冷蓝背光、低姿态站位、舞台设备和线缆让画面有乐队登场前的压迫感。',
          },
        ],
        specs: ['主视觉：蓝色背光合影 / 四人阵列', '用途：作品集封面、项目入口、社媒横幅', '信息层级：乐队名优先，成员身份随后展开'],
      },
      {
        layout: 'band-lineup',
        kicker: '02 Line Up',
        title: 'LINE UP',
        subtitle: 'Yanya / Mobi / Poxiao / Yinpo',
        caption: 'Morale Charge 不是单张合影，而是一套可拆分的角色乐队系统：每个人都有乐器、色彩和动作记忆点，组合后形成完整的舞台关系。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'BAND MEMBER SIGNAL',
        },
        images: [
          {
            src: '/assets/toy-ip/band/group-color-lineup.jpg',
            label: 'Color four-member lineup',
            frame: 'band-lineup-full',
            fit: 'contain',
          },
        ],
        tags: ['Yanya guitar', 'Mobi bass', 'Poxiao drums', 'Yinpo vocal'],
        writeups: [
          {
            title: '焰牙 / Guitar',
            text: '红色吉他手，负责把画面推向冲撞、破碎和高能开场。',
          },
          {
            title: '墨碧 / Bass',
            text: '黑绿贝斯手，承担低频骨架和冷静的反向凝视。',
          },
          {
            title: '破晓 / Drums',
            text: '黄绿鼓手，用节拍、爆点和肢体动作组织乐队节奏。',
          },
          {
            title: '银珀 / Vocal',
            text: '银蓝主唱，以金属反光、麦克风和未来偶像感收束舞台中心。',
          },
        ],
        specs: ['构成：四人乐器身份 / 色彩分工 / 站位关系', '图像：黑白棚拍、鱼眼靶心、角色阵列', '用途：成员页入口、乐队关系说明、展示页导视'],
      },
      {
        layout: 'band-archive',
        kicker: '03 Photo Archive',
        title: 'PHOTO ARCHIVE',
        subtitle: 'Group photo / Scene archive',
        caption: '四张合影承担不同语境：白底演奏讲清乐队身份，金色街区强调角色关系，鱼眼靶心制造视觉符号，暖色舞台形成宣传照气质。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'GROUP PHOTO ARCHIVE',
        },
        images: [
          {
            src: '/assets/toy-ip/band/group-white-studio.png',
            label: 'Black and white performance',
            frame: 'band-wide',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/band/group-amber-blocks.png',
            label: 'Amber street blocks',
            frame: 'band-square',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/band/group-fisheye-target.png',
            label: 'Fisheye target group',
            frame: 'band-square',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/band/group-prism-stage.png',
            label: 'Warm prism stage portrait',
            frame: 'band-tall',
            fit: 'contain',
          },
        ],
        tags: ['Archive matrix', 'Studio shot', 'Fisheye target', 'Prism stage'],
        writeups: [
          {
            title: '档案定位',
            text: '这一页不只展示合影数量，而是把不同摄影语气整理成可用于作品集的视觉资料库。',
          },
          {
            title: '应用方向',
            text: '适合做展览墙、社媒轮播、演出预告、专辑内页和角色关系图。',
          },
        ],
        specs: ['构图：横图 / 方图 / 竖图混排', '控制点：统一边框、统一 caption、不同照片比例不拉伸', '用途：乐队合影板块、项目过程页、宣传延展素材'],
      },
      {
        layout: 'band-poster',
        kicker: '04 Poster System',
        title: 'WE GOING FASTER',
        subtitle: 'Neo comic newspaper poster',
        caption: '根据复古 neo-comic 报纸海报形式，把五张合影重组为半调网点分镜：粗标题、斜切图框、手写边栏和成员名单共同形成 Morale Charge 的宣传海报。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'NEO COMIC POSTER',
        },
        images: [
          {
            src: '/assets/toy-ip/band/morale-charge-neo-comic-poster-v2.jpg',
            label: 'Morale Charge neo comic poster',
            frame: 'band-poster',
            fit: 'contain',
          },
        ],
        elements: [
          {
            title: '报纸纸感',
            text: '米黄色旧纸、细噪点和黑色外框，把照片转译成可印刷的乐队宣传物料。',
          },
          {
            title: '漫画标题',
            text: 'MORALE CHARGE 与 WE GOING FASTER 作为主口号，保留夸张、快速、冲撞的音乐情绪。',
          },
          {
            title: '半调分镜',
            text: '五张合影被处理成黑白网点分格，既像漫画页，也像乐队档案剪报。',
          },
          {
            title: '成员名单',
            text: 'YANYA / MOBI / POXIAO / YINPO 放在底部，保证海报图像之外仍能读到乐队结构。',
          },
        ],
        tags: ['Neo comic', 'Halftone poster', 'Band promotion', 'Newspaper layout'],
        writeups: [
          {
            title: '海报定位',
            text: '这张海报是乐队合照板块的收束物：它把五张合影变成一张可单独发布的宣传图。',
          },
          {
            title: '展示方式',
            text: '页面中以独立竖版资产展示，旁边保留元素拆解，避免关键信息只存在于图片里。',
          },
        ],
        specs: ['尺寸：1536 x 2048 竖版海报', '图形：半调网点 / 斜切分镜 / 手写边栏', '用途：宣传海报、作品集收尾页、社媒竖图'],
      },
    ],
  },
  {
    id: 'mobi',
    label: '贝斯墨碧',
    shortName: 'MOBI',
    role: 'Bass / Privacy Punk',
    accent: '#13e65f',
    keywords: ['黑绿', '贝斯', '朋克发刺', '隐私监控'],
    spreads: [
      {
        layout: 'impact',
        kicker: '01 Character Impact',
        title: 'MOBI',
        subtitle: 'Bass / Privacy Punk',
        caption: '墨碧是 Morale Charge 的贝斯手：黑色皮革、放射状发刺、面部金属钉和低频姿态，让他像一条贴地运行的黑绿音轨。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'MOBI / BASS UNIT',
        },
        images: [
          {
            src: '/assets/toy-ip/mobi/front-character.png',
            label: 'Front character setting',
            frame: 'hero',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/mobi-logo.png',
            label: 'Mobi instrument logo',
            frame: 'logo',
            fit: 'contain',
          },
        ],
        tags: ['Bass unit', 'Black leather', 'Spike hair', 'Privacy punk'],
        writeups: [
          {
            title: '人物设定',
            text: '乐队贝斯手，负责把混乱情绪压成低频底线；存在感不吵，但一直在画面底部推动节奏。',
          },
          {
            title: '性格关键词',
            text: '敏感、疏离、警觉；像总在观察镜头的人，靠冷静和距离感保护自己的边界。',
          },
        ],
        specs: ['主色：墨黑 / 荧光绿 / 金属银', '身份：贝斯手 / 低频骨架', '记忆点：放射发刺、鼻梁金属、皮革绑带'],
      },
      {
        layout: 'motion',
        kicker: '02 Motion Study',
        title: 'LOW TRACE',
        subtitle: 'Reach / Step / Bassline',
        caption: '墨碧的动作不是正面冲撞，而是靠近、伸手、滑步和突然转向。手指近景与完整姿态并置，形成“被观看”和“反向凝视”的张力。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'LOW FREQUENCY FILE',
        },
        images: [
          {
            src: '/assets/toy-ip/mobi/reach-pose.png',
            label: 'Reach pose',
            frame: 'tall',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/mobi/step-motion.png',
            label: 'Step motion',
            frame: 'close',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/mobi/green-stage-trace.png',
            label: 'Green trace stage',
            frame: 'mini',
            fit: 'contain',
          },
        ],
        tags: ['Low trace', 'Camera reach', 'Silent pressure', 'Stage drift'],
        writeups: [
          {
            title: '动作设定',
            text: '低姿态和伸手动作把镜头关系拉到最前，观众不再只是观看者，也像被墨碧反向捕捉。',
          },
          {
            title: '设计元素',
            text: '大面积黑皮革吸光，荧光绿只落在眼神、场景和轮廓边缘，形成冷硬的低频质感。',
          },
        ],
        specs: ['动作：蹲伏、伸手、滑步、转向', '镜头：近手前景 / 低机位 / 完整留白', '细节：皮革褶皱、绑带、金属钉'],
      },
      {
        layout: 'scene',
        kicker: '03 Scene Energy',
        title: 'SURVEILLANCE',
        subtitle: 'Fisheye / Green Light / Gaze',
        caption: '绿色鱼眼空间把墨碧推向“被监控”的叙事：地下车库、镜头畸变、伸手遮挡和暗场绿光，让贝斯手变成一段隐私警报。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'PRIVACY SIGNAL',
        },
        images: [
          {
            src: '/assets/toy-ip/mobi/green-fisheye-scene.png',
            label: 'Green fisheye scene',
            frame: 'wide',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/mobi/green-stage-trace.png',
            label: 'Stage green trace',
            frame: 'wide',
            fit: 'contain',
          },
        ],
        tags: ['Fisheye lens', 'Green tunnel', 'Privacy alert', 'Reverse gaze'],
        writeups: [
          {
            title: '场景性格',
            text: '墨碧适合被放进地下空间、监控屏幕和绿光隧道里，空间要冷、窄、带一点不安全感。',
          },
          {
            title: '乐队元素',
            text: '贝斯信号贴纸和 Morale Charge lockup 作为系统标识出现，连接角色个人页与乐队整体视觉。',
          },
        ],
        specs: ['场景：鱼眼车库、绿光暗场、监控视角', '情绪：疏离、警觉、低频压迫', '延展：MV 镜头、成员卡、舞台屏幕'],
      },
      {
        layout: 'archive',
        kicker: '04 Visual Archive',
        title: 'PRIVATE BASS',
        subtitle: 'Poster / Camera / Logo System',
        caption: '档案页把墨碧的完整海报、贝斯信号贴纸和元素拆解合在一起，证明角色不只是单张图，而是一套可扩展的乐队视觉模块。',
        brand: {
          title: 'MORALE CHARGE',
          code: 'ARCHIVE / M-01',
        },
        images: [
          {
            src: '/assets/toy-ip/mobi/camera-archive-poster.jpg',
            label: 'Mobi camera archive poster',
            frame: 'poster',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/mobi-logo.png',
            label: 'Mobi instrument logo',
            frame: 'emblem',
            fit: 'contain',
          },
        ],
        elements: [
          {
            title: '乐队标识',
            text: 'Morale Charge 作为固定 lockup 出现在页眉，角色页和乐队介绍页可以保持同一识别系统。',
          },
          {
            title: '贝斯信号',
            text: '贝斯、波形和监控镜头组成辅助贴纸，强化墨碧的低频身份与隐私主题。',
          },
          {
            title: '黑绿配色',
            text: '黑色负责压低画面，荧光绿只做信号和高光，避免整页变成单一绿色。',
          },
          {
            title: '完整素材',
            text: '所有角色图以 contain 为主，优先保留发刺、手势、鞋底和边缘轮廓。',
          },
        ],
        tags: ['Morale Charge', 'Bass signal', 'Privacy file', 'Camera archive'],
        writeups: [
          {
            title: '海报定位',
            text: '墨碧的海报语言更接近监控档案和低频信号：冷、密、带距离，但保留潮玩角色的可识别轮廓。',
          },
          {
            title: '应用方向',
            text: '适合做角色设定页、乐队 Logo 辅助图形、成员卡、专辑内页、社媒长图和舞台屏幕纹理。',
          },
        ],
        specs: ['构图：相机屏幕 / 角色全身 / 贴纸系统', '图形：贝斯波形、监控框、点阵数据', '用途：成员介绍、乐队档案、视觉周边'],
      },
    ],
  },
  {
    id: 'yanya',
    label: '吉他手焰牙',
    shortName: 'YAN YA',
    role: 'Guitar / Red Impact',
    accent: '#ff2a14',
    keywords: ['红色', '吉他', '机械手甲', '爆裂姿态'],
    spreads: [
      {
        layout: 'impact',
        kicker: '01 Character Impact',
        title: 'YAN YA',
        subtitle: 'Guitar / Red Impact',
        caption: '红发、机械爪、破碎吉他构成焰牙的第一记忆点：像一段被放大的失真和弦，短促、直接、带攻击性。',
        images: [
          {
            src: '/assets/toy-ip/yanya/impact-guitar-break.png',
            label: 'Broken guitar hero',
            frame: 'hero',
            fit: 'cover',
          },
          {
            src: '/assets/toy-ip/logos/yanya-logo.png',
            label: 'Yan Ya instrument logo',
            frame: 'logo',
            fit: 'contain',
          },
        ],
        tags: ['Red hair', 'Broken guitar', 'Spike claw', 'Bad temper'],
        writeups: [
          {
            title: '人物设定',
            text: '乐队里负责制造第一声噪音的吉他手，体型小但情绪压迫感强。',
          },
          {
            title: '性格关键词',
            text: '不服管、反应快、容易炸毛，越被围观越要把音量拧到最大。',
          },
        ],
        specs: ['主色：高饱和红 / 黑', '身份：吉他手 / 突击位', '记忆点：红发、墨镜、机械爪、破碎吉他'],
      },
      {
        layout: 'motion',
        kicker: '02 Motion Study',
        title: 'BREAK POSE',
        subtitle: 'Jump / Invert / Attack',
        caption: '用倒置动作和近距离机械爪，把角色从静态设定推进到可发行的动态镜头语言。',
        images: [
          {
            src: '/assets/toy-ip/yanya/motion-handstand.png',
            label: 'Inverted motion',
            frame: 'tall',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/yanya/claw-closeup.png',
            label: 'Claw pressure',
            frame: 'close',
            fit: 'cover',
          },
          {
            src: '/assets/toy-ip/yanya/legacy-character-b.png',
            label: 'Red crowd reference',
            frame: 'mini',
            fit: 'cover',
          },
        ],
        tags: ['Motion', 'Low angle', 'Mechanical detail', 'Action pose'],
        writeups: [
          {
            title: '动作设定',
            text: '焰牙不走稳定站姿，身体经常处在跳跃、倒置、前冲的失衡瞬间。',
          },
          {
            title: '设计元素',
            text: '鞋底机械块、爪尖护腕和破损黑裤形成从手到脚的攻击线。',
          },
        ],
        specs: ['动作：倒立 / 前压 / 下坠', '镜头：低机位与近景压迫', '细节：鞋底、护腕、爪尖、破损布料'],
      },
      {
        layout: 'scene',
        kicker: '03 Scene Energy',
        title: 'RED NOISE',
        subtitle: 'Stage / Street / Room',
        caption: '红色人群与涂鸦空间把焰牙从单个角色推进到完整 IP 场景：躁动、密集、带一点挑衅。',
        images: [
          {
            src: '/assets/toy-ip/yanya/red-crowd-stage.png',
            label: 'Red crowd stage',
            frame: 'wide',
            fit: 'cover',
          },
          {
            src: '/assets/toy-ip/yanya/graffiti-room-guitar.png',
            label: 'Graffiti room',
            frame: 'wide',
            fit: 'cover',
          },
        ],
        tags: ['Red crowd', 'Graffiti room', 'Street punk', 'Stage pressure'],
        writeups: [
          {
            title: '场景性格',
            text: '他不适合干净展台，更适合红灯、人群、墙面涂鸦和拥挤的后台角落。',
          },
          {
            title: '情绪表达',
            text: '画面要让观众先感到热、吵、近，然后才看清角色的表情和装备。',
          },
        ],
        specs: ['场景：舞台红光 / 涂鸦房间', '情绪：躁动、挑衅、压迫', '延展：海报、短片、包装背景、展陈灯箱'],
      },
      {
        layout: 'archive',
        kicker: '04 Visual Archive',
        title: 'CAMERA TRACE',
        subtitle: 'Poster / Screen / Glitch',
        caption: '用相机屏幕、坐标框和故障切片收束视觉系统，让焰牙像一份被追踪和放大的角色档案。',
        images: [
          {
            src: '/assets/toy-ip/yanya/camera-archive-poster.jpg',
            label: 'Camera archive poster',
            frame: 'poster',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/yanya-logo.png',
            label: 'Yan Ya instrument logo',
            frame: 'emblem',
            fit: 'contain',
          },
        ],
        elements: [
          {
            title: '屏幕嵌套',
            text: '用相机取景框制造“被追踪”的档案感，增强角色的视觉传播属性。',
          },
          {
            title: '故障切片',
            text: '局部 RGB 错位和横向撕裂条，让机械爪与表情更像危险信号。',
          },
          {
            title: '斜切字形',
            text: '尖锐字形呼应红发、爪尖和破碎吉他，形成统一的攻击轮廓。',
          },
          {
            title: '坐标标注',
            text: '细线框和坐标信息把海报从单图展示转为可分析的视觉系统。',
          },
        ],
        tags: ['Camera screen', 'Glitch crop', 'Poster system', 'Archive'],
        writeups: [
          {
            title: '海报定位',
            text: '这一页是焰牙视觉系统的收束页，用来证明角色可以被转译成海报语言。',
          },
          {
            title: '应用方向',
            text: '适合做角色档案、展览导视、社媒首图、盲盒卡牌和短视频封面。',
          },
        ],
        specs: ['构图：屏幕嵌套与局部放大', '图形：坐标框 / 故障条 / 斜切字', '用途：角色海报、档案卡、社媒视觉'],
      },
    ],
  },
  {
    id: 'poxiao',
    label: '鼓手破晓',
    shortName: 'PO XIAO',
    role: 'Drums / Lime Break',
    accent: '#9cff3f',
    keywords: ['荧光绿', '鼓手', '重拍残影', '绅士反差'],
    spreads: [
      {
        layout: 'impact',
        kicker: '01 Character Impact',
        title: 'PO XIAO',
        subtitle: 'Drums / Lime Break',
        caption: '破晓是乐队里的低频核心：绿色尖角发、烟雾袖和正装轮廓让他像一记压住全场的重拍，冷脸站定，却随时能把节奏砸开。',
        images: [
          {
            src: '/assets/toy-ip/poxiao/front-character.png',
            label: 'Front character setting',
            frame: 'hero',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/poxiao-logo.png',
            label: 'Po Xiao instrument logo',
            frame: 'logo',
            fit: 'contain',
          },
        ],
        tags: ['Lime hair', 'Drummer core', 'Smoke sleeves', 'Suit contrast'],
        writeups: [
          {
            title: '人物设定',
            text: '鼓手破晓负责乐队的节拍骨架，外表克制，动作干脆，是把混乱压成秩序的人。',
          },
          {
            title: '性格关键词',
            text: '冷静、固执、少说话；舞台上不抢声量，但每一次出手都像在给全队定拍。',
          },
        ],
        specs: ['主色：荧光绿 / 琥珀黄 / 黑皮革', '身份：鼓手 / 节奏控制', '记忆点：尖角绿发、烟雾袖、绿色护目镜'],
      },
      {
        layout: 'motion',
        kicker: '02 Motion Study',
        title: 'BASS KICK',
        subtitle: 'Kick / Drop / Impact',
        caption: '破晓的动作语言不是跳脱，而是下压、踢击、停顿和突然爆发。大靴前景、皮革裤褶和手势残影共同形成鼓点般的视觉节奏。',
        images: [
          {
            src: '/assets/toy-ip/poxiao/boot-kick.png',
            label: 'Boot kick impact',
            frame: 'tall',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/poxiao/floor-pose.png',
            label: 'Low pose structure',
            frame: 'close',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/poxiao/motion-glitch.png',
            label: 'Motion echo study',
            frame: 'mini',
            fit: 'contain',
          },
        ],
        tags: ['Bass kick', 'Heavy boot', 'Motion echo', 'Hard stop'],
        writeups: [
          {
            title: '动作设定',
            text: '低机位强化鞋底和腿部重量，让鼓手的“重拍”从声音转译成视觉冲击。',
          },
          {
            title: '设计元素',
            text: '宽大黑靴、皮革裤、金属扣具和绿色镜片组成硬质底盘，烟雾袖负责制造反差。',
          },
        ],
        specs: ['动作：踢击、落点、低姿态', '镜头：低机位 / 鞋底前景 / 残影叠化', '细节：扣具、皮革褶皱、手势'],
      },
      {
        layout: 'scene',
        kicker: '03 Scene Energy',
        title: 'GREEN DOWNBEAT',
        subtitle: 'Pulse / Cage / Band',
        caption: '绿色竖线场景把破晓变成被节拍栅格切分的鼓点符号；与焰牙的合照补充成员关系，让他既是个人角色，也是乐队结构的一部分。',
        images: [
          {
            src: '/assets/toy-ip/poxiao/green-bars-scene.png',
            label: 'Green rhythm cage',
            frame: 'wide',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/poxiao/duo-yanya-reference.png',
            label: 'Band relation with Yan Ya',
            frame: 'wide',
            fit: 'contain',
          },
        ],
        tags: ['Green bars', 'Rhythm grid', 'Band relation', 'Fisheye room'],
        writeups: [
          {
            title: '场景性格',
            text: '绿色竖向光栅像鼓谱里的小节线，压迫、精准，也让角色的沉默感更强。',
          },
          {
            title: '成员关系',
            text: '和焰牙同框时形成“躁动吉他 / 冷静低频”的对照，适合后续做乐队群像叙事。',
          },
        ],
        specs: ['场景：绿光栅格、鱼眼室内、乐队合照', '情绪：压低、克制、突然爆发', '延展：成员关系页、故事卡、专辑视觉'],
      },
      {
        layout: 'archive',
        kicker: '04 Visual Archive',
        title: 'FIX ON',
        subtitle: 'Poster / Camera / Pulse',
        caption: '海报页把正面角色、动作残影、绿光场景和合照统一进相机屏幕拼贴，适合作为破晓的视觉档案总览。',
        images: [
          {
            src: '/assets/toy-ip/poxiao/camera-archive-poster.jpg',
            label: 'Po Xiao poster archive',
            frame: 'poster',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/poxiao-logo.png',
            label: 'Po Xiao instrument logo',
            frame: 'emblem',
            fit: 'contain',
          },
        ],
        elements: [
          {
            title: '荧光绿标题',
            text: '用高饱和绿色作为人物主题，与焰牙的红和银珀的蓝区分，形成乐队成员色谱。',
          },
          {
            title: '鼓点栅格',
            text: '竖线、相机屏幕和分割框像节拍器，把破晓的稳定感转译成版面秩序。',
          },
          {
            title: '琥珀反差',
            text: '琥珀黄补足舞台温度，避免绿色单一，也呼应角色的沉默爆发。',
          },
          {
            title: '成员同框',
            text: '合照素材证明角色可以进入乐队叙事，为后续团体介绍页面预留结构。',
          },
        ],
        tags: ['Camera archive', 'Lime pulse', 'Band story', 'Poster system'],
        writeups: [
          {
            title: '海报定位',
            text: '破晓的档案页重点不是炫技，而是把角色识别、动作节奏和乐队关系收成一张可读的视觉说明。',
          },
          {
            title: '应用方向',
            text: '适合做角色设定页、乐队成员卡、演出视觉、周边卡牌和社媒长图封面。',
          },
        ],
        specs: ['构图：相机拼贴 / 角色大图 / 关系画面', '图形：竖向节拍线 / 星形贴片 / 屏幕框', '用途：角色档案、成员介绍、乐队关系页'],
      },
    ],
  },
  {
    id: 'yinpo',
    label: '主唱银珀',
    shortName: 'YIN PO',
    role: 'Vocal / Chrome Future',
    accent: '#78dfff',
    keywords: ['银蓝', '主唱', '镜面墨镜', '未来舞台'],
    spreads: [
      {
        layout: 'impact',
        kicker: '01 Character Impact',
        title: 'YIN PO',
        subtitle: 'Vocal / Chrome Future',
        caption: '银珀是乐队里的冷光主唱：用镜面墨镜、银色服装和红色发束，把舞台气质压成一个安静但醒目的未来信号。',
        images: [
          {
            src: '/assets/toy-ip/yinpo/front-character.png',
            label: 'Front character setting',
            frame: 'hero',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/yinpo-logo.png',
            label: 'Yin Po instrument logo',
            frame: 'logo',
            fit: 'contain',
          },
        ],
        tags: ['Chrome silver', 'Mirror visor', 'Vocal lead', 'Future idol'],
        writeups: [
          {
            title: '人物设定',
            text: '乐队主唱，负责把躁动的节奏收束成清晰的舞台中心。',
          },
          {
            title: '性格关键词',
            text: '外表温和，舞台上极稳；像冷色灯光一样不急不慢地控制全场。',
          },
        ],
        specs: ['主色：铬银 / 冰蓝 / 红色点缀', '身份：主唱 / 舞台中心', '记忆点：镜面墨镜、银色套装、麦克风线'],
      },
      {
        layout: 'motion',
        kicker: '02 Motion Study',
        title: 'CHROME KICK',
        subtitle: 'Kick / Glide / Vocal',
        caption: '银珀的动作不是攻击，而是滑行、抬腿、轻跃和挥手；肢体像反光材质一样流动，带出主唱的舞台掌控感。',
        images: [
          {
            src: '/assets/toy-ip/yinpo/motion-high-kick.png',
            label: 'High kick motion',
            frame: 'tall',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/yinpo/microphone-jump.png',
            label: 'Mic cable gesture',
            frame: 'close',
            fit: 'cover',
          },
          {
            src: '/assets/toy-ip/yinpo/legacy-character-b.png',
            label: 'Blue motion reference',
            frame: 'mini',
            fit: 'cover',
          },
        ],
        tags: ['High kick', 'Mic cable', 'Chrome boots', 'Soft control'],
        writeups: [
          {
            title: '动作设定',
            text: '以抬腿、跳跃和麦克风线条制造舞台轨迹，动作轻但轮廓很大。',
          },
          {
            title: '设计元素',
            text: '银色靴套、镜面护目、星形裤面和长发弧线共同形成未来偶像感。',
          },
        ],
        specs: ['动作：高踢 / 漂移 / 挥手', '镜头：冷色近景与全身动态', '细节：镜面墨镜、麦克风线、铬银褶皱'],
      },
      {
        layout: 'scene',
        kicker: '03 Scene Energy',
        title: 'BLUE RUSH',
        subtitle: 'Stage / Light / Speed',
        caption: '银珀的场景语言更偏冷光、速度残影和舞台逆光；她不靠冲撞制造存在感，而像一道突然掠过的蓝色音轨。',
        images: [
          {
            src: '/assets/toy-ip/yinpo/blue-speed-scene.png',
            label: 'Blue speed scene',
            frame: 'wide',
            fit: 'cover',
          },
          {
            src: '/assets/toy-ip/yinpo/dark-stage-vocal.png',
            label: 'Dark stage vocal',
            frame: 'wide',
            fit: 'cover',
          },
        ],
        tags: ['Blue light', 'Backlight', 'Speed trace', 'Stage vocal'],
        writeups: [
          {
            title: '场景性格',
            text: '适合蓝色灯廊、舞台逆光、暗场观众和高反光材质组成的未来空间。',
          },
          {
            title: '情绪表达',
            text: '画面应先让观众感到冷、亮、远，再通过麦克风和微笑拉近角色距离。',
          },
        ],
        specs: ['场景：蓝色通道 / 暗场舞台', '情绪：冷静、梦幻、掌控', '延展：演唱会海报、角色卡、舞台屏幕'],
      },
      {
        layout: 'archive',
        kicker: '04 Visual Archive',
        title: 'FUTURE IS NOW',
        subtitle: 'Poster / Chrome / Y2K',
        caption: '银珀的海报系统把相机屏幕、镭射渐变、银色设备和 Y2K 字形组合在一起，像一份未来舞台的视觉档案。',
        images: [
          {
            src: '/assets/toy-ip/yinpo/camera-archive-poster.jpg',
            label: 'Chrome archive poster',
            frame: 'poster',
            fit: 'contain',
          },
          {
            src: '/assets/toy-ip/logos/yinpo-logo.png',
            label: 'Yin Po instrument logo',
            frame: 'emblem',
            fit: 'contain',
          },
        ],
        elements: [
          {
            title: '镜面主色',
            text: '银色服装和相机设备形成铬面反光，把角色从潮玩设定推向未来偶像视觉。',
          },
          {
            title: '冰蓝光场',
            text: '青蓝渐变负责区分焰牙的红色躁动，让银珀更冷、更轻、更像舞台光束。',
          },
          {
            title: '麦克风线条',
            text: '黑色线缆穿过画面，既是主唱身份，也能成为版式中的动态路径。',
          },
          {
            title: 'Y2K 档案',
            text: '相机、条码、播放器和金属字形让海报具备可延展的专辑封面气质。',
          },
        ],
        tags: ['Chrome archive', 'Y2K poster', 'Future is now', 'Vocal system'],
        writeups: [
          {
            title: '海报定位',
            text: '这一页负责收束银珀的视觉系统：冷色、镜面、舞台设备和主唱身份。',
          },
          {
            title: '应用方向',
            text: '适合做演唱会视觉、角色海报、专辑封面、卡牌、社媒封面和展览灯箱。',
          },
        ],
        specs: ['构图：相机屏幕 / 镭射渐变 / 设备拼贴', '图形：星形、条码、金属字、Y2K 标注', '用途：主唱海报、专辑封面、舞台视觉'],
      },
    ],
  },
];

const toyIpMemberBlocks = [
  { name: '贝斯墨碧', role: 'BASS', color: '#19d56b' },
  { name: '吉他手焰牙', role: 'GUITAR', color: '#ff2a14' },
  { name: '鼓手破晓', role: 'DRUMS', color: '#b7f346' },
  { name: '主唱银珀', role: 'VOCAL', color: '#8fd9ff' },
];

const HERO_POSTER_SRC = '/assets/optimized/hero-uploaded-background-poster.webp';
const HERO_VIDEO_SRC = '/assets/optimized/hero-uploaded-background-lite.mp4';

const OPTIMIZED_IMAGE_SOURCES = new Set([
  '/assets/guitar-tuner-cover.png',
  '/assets/guitar-tuner-interface.png',
  '/assets/guitar-tuner-system.png',
  '/assets/brand-kv/7up-fido-beach-store-kv-01-v1.jpg',
  '/assets/brand-kv/7up-fido-beach-store-kv-02-v1.jpg',
  '/assets/brand-kv/7up-fido-indoor-store-kv-01-v1.jpg',
  '/assets/brand-kv/7up-fido-indoor-store-kv-02-v1.jpg',
  '/assets/brand-kv/hema-seafood-indoor-kv-v1.jpg',
  '/assets/brand-kv/hema-seafood-outdoor-kv-v1.jpg',
  '/assets/toy-ip/logos/mobi-logo.png',
  '/assets/toy-ip/logos/poxiao-logo.png',
  '/assets/toy-ip/logos/yanya-logo.png',
  '/assets/toy-ip/logos/yinpo-logo.png',
  '/assets/toy-ip/band-group.jpg',
  '/assets/toy-ip/band-home-glass-source.png',
  '/assets/toy-ip/band/group-amber-blocks.png',
  '/assets/toy-ip/band/group-blue-stage.png',
  '/assets/toy-ip/band/group-color-lineup.jpg',
  '/assets/toy-ip/band/group-fisheye-target.png',
  '/assets/toy-ip/band/group-prism-stage.png',
  '/assets/toy-ip/band/group-white-studio.png',
  '/assets/toy-ip/band/morale-charge-neo-comic-poster-v2.jpg',
  '/assets/toy-ip/mobi/bass-signal-emblem.png',
  '/assets/toy-ip/mobi/camera-archive-poster.jpg',
  '/assets/toy-ip/mobi/front-character.png',
  '/assets/toy-ip/mobi/green-fisheye-scene.png',
  '/assets/toy-ip/mobi/green-stage-trace.png',
  '/assets/toy-ip/mobi/reach-pose.png',
  '/assets/toy-ip/mobi/step-motion.png',
  '/assets/toy-ip/poxiao/amber-portrait.png',
  '/assets/toy-ip/poxiao/boot-kick.png',
  '/assets/toy-ip/poxiao/camera-archive-poster.jpg',
  '/assets/toy-ip/poxiao/duo-yanya-reference.png',
  '/assets/toy-ip/poxiao/floor-pose.png',
  '/assets/toy-ip/poxiao/front-character.png',
  '/assets/toy-ip/poxiao/green-bars-scene.png',
  '/assets/toy-ip/poxiao/motion-glitch.png',
  '/assets/toy-ip/yanya/camera-archive-poster.jpg',
  '/assets/toy-ip/yanya/claw-closeup.png',
  '/assets/toy-ip/yanya/front-character.png',
  '/assets/toy-ip/yanya/graffiti-room-guitar.png',
  '/assets/toy-ip/yanya/impact-guitar-break.png',
  '/assets/toy-ip/yanya/legacy-character-b.png',
  '/assets/toy-ip/yanya/motion-handstand.png',
  '/assets/toy-ip/yanya/red-crowd-stage.png',
  '/assets/toy-ip/yinpo/blue-speed-scene.png',
  '/assets/toy-ip/yinpo/camera-archive-poster.jpg',
  '/assets/toy-ip/yinpo/dark-stage-vocal.png',
  '/assets/toy-ip/yinpo/front-character.png',
  '/assets/toy-ip/yinpo/legacy-character-b.png',
  '/assets/toy-ip/yinpo/microphone-jump.png',
  '/assets/toy-ip/yinpo/motion-high-kick.png',
  '/assets/virtual-human/professor-z-baichuan-01-origin.jpg',
  '/assets/virtual-human/professor-z-baichuan-02-companion.jpg',
  '/assets/virtual-human/professor-z-baichuan-03-stargazing.jpg',
  '/assets/virtual-human/professor-z-baichuan-04-inquiry.jpg',
  '/assets/virtual-human/professor-z-baichuan-05-return.jpg',
  '/assets/virtual-human/professor-z-astrologer-poster.jpg',
  '/assets/virtual-human/professor-z-fashion-board.png',
  '/assets/virtual-human/professor-z-fashion-poster.jpg',
  '/assets/virtual-human/professor-z-patek-6102p-poster.jpg',
  '/assets/virtual-human/professor-z-portrait.png',
  '/assets/virtual-human/professor-z-turnaround.jpg',
  '/assets/virtual-human/professor-z-watch-contact-sheet.jpg',
  '/assets/xiaoniaozhuo/xiaoniaozhuo-detail.jpg',
  '/assets/xiaoniaozhuo/xiaoniaozhuo-overview.jpg',
  '/assets/xiaoniaozhuo/xiaoniaozhuo-packaging.jpg',
  '/assets/zhang-haoyu-portrait.jpg',
]);

function getOptimizedImageSrc(src) {
  if (!OPTIMIZED_IMAGE_SOURCES.has(src)) {
    return null;
  }

  return src.replace('/assets/', '/assets/optimized/').replace(/\.(png|jpe?g)$/i, '.webp');
}

function OptimizedImage({ src, alt, className, eager = false, sizes, ...props }) {
  const optimizedSrc = getOptimizedImageSrc(src);
  const runtimeSrc = optimizedSrc ?? src;
  const image = (
    <img
      {...props}
      className={className}
      src={runtimeSrc}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'low'}
      sizes={sizes}
    />
  );

  if (!optimizedSrc) {
    return image;
  }

  return (
    <picture className="media-picture">
      <source srcSet={optimizedSrc} type="image/webp" sizes={sizes} />
      {image}
    </picture>
  );
}

function GuitarTunerPortfolio({ panelId, labelledBy }) {
  return (
    <div
      id={panelId}
      className="guitar-tuner-panel"
      role="region"
      aria-labelledby={labelledBy}
      onClick={(event) => event.stopPropagation()}
    >
      <section className="guitar-tuner-video-block" aria-label="吉他弹唱调音插件介绍视频">
        <div className="guitar-tuner-video-copy">
          <span>Local Acoustic Vocal Studio</span>
          <h4>第一个能跑的音乐产品。</h4>
          <p>
            这段 30 秒视频记录的是已经跑通的本地声卡修音台：上传原版歌曲和自己的弹唱录音，按信号链处理，最后拿到可试听、可复查的输出文件。
          </p>
          <div className="guitar-tuner-video-facts" aria-label="视频说明">
            <strong>30 秒介绍视频</strong>
            <strong>本地处理</strong>
            <strong>真实工作流</strong>
          </div>
        </div>
        <figure className="guitar-tuner-video-frame">
          <video
            src="/assets/hero-aigc-guitar-tuner.mp4"
            poster="/assets/optimized/guitar-tuner-cover.webp"
            controls
            preload="metadata"
            aria-label="吉他弹唱调音插件 30 秒介绍视频"
          />
        </figure>
      </section>

      <section className="guitar-tuner-process" aria-label="吉他弹唱调音插件研发过程">
        <div className="guitar-tuner-section-copy">
          <span>Research Log</span>
          <h5>研发过程不是一条直线，先被录音问题打断，再一步步收回来。</h5>
        </div>
        <div className="guitar-tuner-process-grid">
          {guitarTunerProcessSections.map((item, index) => (
            <article className="guitar-tuner-process-card" key={item.id}>
              <div className="guitar-tuner-process-index">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
              </div>
              <h6>{item.title}</h6>
              <p>{item.text}</p>
              <div className="guitar-tuner-chip-row">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="guitar-tuner-boards" aria-label="吉他弹唱调音插件图文说明">
        {guitarTunerVisualBoards.map((board, boardIndex) => (
          <article className="guitar-tuner-board" key={board.id}>
            <figure>
              <OptimizedImage
                src={board.image}
                alt={`${board.title} 图文界面`}
                eager={boardIndex === 0}
                sizes="(max-width: 960px) 100vw, 32vw"
              />
            </figure>
            <div>
              <span>{String(boardIndex + 1).padStart(2, '0')}</span>
              <h6>{board.title}</h6>
              <p>{board.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="guitar-tuner-tech" aria-label="吉他弹唱调音插件技术说明">
        <div className="guitar-tuner-section-copy">
          <span>Signal Chain</span>
          <h5>技术取舍围绕一个目标：人声更清楚，但不要把弹唱压成机器声。</h5>
        </div>
        <div className="guitar-tuner-tech-grid">
          {guitarTunerTechCards.map(([title, text]) => (
            <article className="guitar-tuner-tech-card" key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guitar-tuner-output" aria-label="吉他弹唱调音插件输出结果">
        {guitarTunerOutputFacts.map(([title, text]) => (
          <div key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function PosterSketchPortfolio({ posterItems = [], sketchItems = [], panelId, labelledBy }) {
  return (
    <div
      id={panelId}
      className="poster-sketch-panel"
      role="region"
      aria-labelledby={labelledBy}
      onClick={(event) => event.stopPropagation()}
    >
      <section className="poster-sketch-section poster-sketch-posters" aria-label="海报展示">
        <div className="poster-sketch-copy">
          <span>Poster Archive</span>
          <h4>海报展示</h4>
        </div>

        <div className="poster-sketch-poster-grid">
          {posterItems.map((item, index) => (
            <article className="poster-sketch-card" key={item.id}>
              <figure>
                <OptimizedImage
                  src={item.image}
                  alt={`${item.title} 海报展示`}
                  eager={index === 0}
                  sizes="(max-width: 760px) 88vw, (max-width: 1180px) 42vw, 22vw"
                />
              </figure>
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h5>{item.title}</h5>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="poster-sketch-section" aria-label="手绘展示">
        <div className="poster-sketch-copy">
          <span>Sketch Board</span>
          <h4>手绘与设定</h4>
        </div>

        <div className="poster-sketch-sketch-grid">
          {sketchItems.map((item, index) => (
            <article
              className={`poster-sketch-card poster-sketch-card--sketch ${
                item.featured ? 'is-featured' : ''
              }`}
              key={item.id}
            >
              <figure>
                <OptimizedImage
                  src={item.image}
                  alt={`${item.title} 手绘展示`}
                  eager={index < 2}
                  sizes="(max-width: 760px) 88vw, (max-width: 1180px) 42vw, 30vw"
                />
              </figure>
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h5>{item.title}</h5>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function BrandKvPortfolio({ sections, panelId, labelledBy }) {
  const groups = [
    {
      id: 'seven-up',
      title: '七喜 x Fido Dido',
      summary: '室内联名商店负责建立活动入口，海边快闪把同一套识别延展成夏日目的地。',
      accent: '#24ce63',
      items: sections.filter((section) => section.group === 'seven-up'),
    },
    {
      id: 'hema',
      title: '盒马鲜生',
      summary: '室内现炒讲“马上发生”，室外市集讲“可以逛起来”，两张图把新鲜从货架转成现场体验。',
      accent: '#2d74ff',
      items: sections.filter((section) => section.group === 'hema'),
    },
  ];

  return (
    <div
      id={panelId}
      className="brand-kv-panel"
      role="region"
      aria-labelledby={labelledBy}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="brand-kv-header">
        <div>
          <span>Brand Campaign KV</span>
          <h4>活动主视觉先抓住现场，再把品牌记忆留下来。</h4>
        </div>
        <p>
          这组 KV 按品牌与场景整理：七喜负责联名商店和海边快闪，盒马负责门店现炒和开放市集。页面保留完整图面，同时把活动配文与设计说明放到图片外侧，避免遮挡原始版式。
        </p>
      </div>

      <div className="brand-kv-group-list">
        {groups.map((group) => (
          <section
            className={`brand-kv-group is-${group.id}`}
            style={{ '--brand-kv-accent': group.accent }}
            aria-label={`${group.title} 活动 KV`}
            key={group.id}
          >
            <div className="brand-kv-group-copy">
              <span>{group.title}</span>
              <p>{group.summary}</p>
            </div>

            <div className="brand-kv-grid">
              {group.items.map((item, itemIndex) => (
                <article className="brand-kv-item" key={item.id}>
                  <figure>
                    <OptimizedImage
                      src={item.image}
                      alt={`${item.scene} 主视觉`}
                      eager={group.id === 'seven-up' && itemIndex === 0}
                      sizes="(max-width: 960px) 100vw, 48vw"
                    />
                  </figure>
                  <div className="brand-kv-copy-block">
                    <div className="brand-kv-meta">
                      <span>{item.scene}</span>
                      <strong>{item.format}</strong>
                    </div>
                    <h5>{item.copy}</h5>
                    <p>{item.design}</p>
                    <div className="brand-kv-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="brand-kv-summary" aria-label="品牌活动 KV 设计归纳">
        {[
          ['活动入口', '用商店、厨房和市集把 KV 变成观众能想象到达的现场。'],
          ['品牌资产', '七喜的绿、盒马的蓝都只在项目内部增强识别，不打乱作品集暗色系统。'],
          ['传播适配', '横向主视觉适合灯箱、门店海报、社媒首图和户外快闪导视。'],
          ['角色关系', 'Fido Dido 和盒马角色不只是装饰，它们承担招呼、服务和现场引导。'],
        ].map(([title, text]) => (
          <div key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WelfareParkPortfolio({ boards, panelId, labelledBy }) {
  return (
    <div
      id={panelId}
      className="welfare-case-panel"
      role="region"
      aria-labelledby={labelledBy}
      style={{ '--welfare-accent': '#73ff2a' }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="welfare-board-list">
        {boards.map((board, boardIndex) => (
          <figure className="welfare-board" key={board.id}>
            <OptimizedImage src={board.image} alt={`${board.title} 横向排版图面`} eager={boardIndex === 0} />
          </figure>
        ))}
      </div>
    </div>
  );
}

function XiaoniaozhuoPortfolio({ sections, panelId, labelledBy }) {
  const [heroSection, ...detailSections] = sections;

  return (
    <div
      id={panelId}
      className="xiaoniaozhuo-case-panel"
      role="region"
      aria-labelledby={labelledBy}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="xiaoniaozhuo-case-header">
        <div>
          <span>Xiaoniaozhuo Agriculture Brand</span>
          <h4>把一箱苹果讲成一个有自然记忆点的助农品牌。</h4>
        </div>
        <p>
          三张原始图版分别承担总览、细节和结构说明。作品集里保留完整画面，同时用深色展陈框架重新组织阅读顺序。
        </p>
      </div>

      <section className="xiaoniaozhuo-hero-board" aria-label="小鸟啄品牌包装总览">
        <figure>
          <OptimizedImage src={heroSection.image} alt="小鸟啄山地苹果整体包装效果图" eager />
        </figure>
        <div className="xiaoniaozhuo-hero-copy">
          <span>Core Idea</span>
          <h5>小鸟啄后的苹果</h5>
          <p>
            以小鸟、果树和采摘人物建立品牌故事，把“自然发生的痕迹”变成包装识别点。
          </p>
          <div className="xiaoniaozhuo-proof-grid">
            {['地域农产品价值', '插画化生产过程', '包装盒型落地', '品牌亲和力表达'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="xiaoniaozhuo-board-grid">
        {detailSections.map((section) => (
          <article className="xiaoniaozhuo-board" key={section.id}>
            <figure>
              <OptimizedImage src={section.image} alt={`${section.title} 图版`} />
            </figure>
            <div>
              <h5>{section.title}</h5>
              <p>{section.text}</p>
              <div className="xiaoniaozhuo-tags">
                {section.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="xiaoniaozhuo-summary" aria-label="小鸟啄案例总结">
        {[
          ['品牌识别', '用小鸟和苹果建立简单、可记忆的产品符号。'],
          ['信息说明', '用插画把播种、旋耕、摘心、套袋等过程转为可读内容。'],
          ['落地能力', '用包装结构、尺寸和刀模证明设计不是停留在概念图。'],
        ].map(([title, text]) => (
          <div key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VirtualHumanPortfolio({ sections, journeyScenes = [], panelId, labelledBy }) {
  const [portraitSection, ...archiveSections] = sections;
  const identityFacts = [
    ['1492', '地中海航线交汇的小港城'],
    ['Observer', '只记录、只旁观、只做最小的纠偏'],
    ['Method', '把占星重新整理成可验证的观察方法'],
    ['Flaw', '猞猁式耳尖与极短黑色簇毛'],
  ];
  const signatureDetails = [
    ['黄铜眼镜', '镜框刻混沌星轨纹，像一把打开时间的钥匙。'],
    ['学者型占星师', '对外职业身份克制可信，不靠神秘话术制造距离。'],
    ['人形档案', '他穿梭于东西方文明的转折点，却始终不站上舞台。'],
  ];

  return (
    <div
      id={panelId}
      className="virtual-human-panel"
      role="region"
      aria-labelledby={labelledBy}
      onClick={(event) => event.stopPropagation()}
    >
      <section className="virtual-human-hero" aria-label="Professor-Z 虚拟人物主档案">
        <figure className="virtual-human-portrait">
          <OptimizedImage src={portraitSection.image} alt="Professor-Z 人物胸像" eager />
        </figure>
        <div className="virtual-human-hero-copy">
          <span>Professor-Z / Immortal Archive</span>
          <h4>如果一个人从不衰老，你会在历史里怎么找到他？</h4>
          <p>
            Professor-Z 出生于 1492 年的地中海港城，从航海、星象与历史记录开始，把自己活成一份持续更新的人形档案。
          </p>
          <p>
            在当代，他以学者型占星师的身份出现。复古星盘、黄铜天文仪器与羊皮纸星图不是神秘话术，而是一套观察世界的方法。
          </p>
        </div>
      </section>

      <div className="virtual-human-fact-grid" aria-label="Professor-Z 身份档案">
        {identityFacts.map(([label, text]) => (
          <div key={label}>
            <strong>{label}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <section className="virtual-human-signature" aria-label="Professor-Z 角色破绽">
        <div>
          <h5>平静疏离，像看过千年又不愿解释。</h5>
          <p>
            他永远带着黄铜眼镜，发丝半遮住耳尖。远看无异，靠近才会发现那一点不属于人类时间线的破绽。
          </p>
        </div>
        <div className="virtual-human-signature-list">
          {signatureDetails.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="virtual-human-archive-grid">
        {archiveSections.map((section) => (
          <article className={`virtual-human-asset is-${section.id}`} key={section.id}>
            <figure>
              <OptimizedImage src={section.image} alt={`Professor-Z ${section.title}`} />
            </figure>
            <div>
              <h5>{section.title}</h5>
              <p>{section.text}</p>
              <div className="virtual-human-tags">
                {section.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {journeyScenes.length > 0 ? (
        <section className="virtual-human-journey" aria-label="Professor-Z 与白川东方游历五幕故事板">
          <div className="virtual-human-journey-heading">
            <span>Eastern Journey / Bai Chuan</span>
            <div>
              <h5>白川出现以后，观察第一次变成同行。</h5>
              <p>
                她的身世与鹤相关，像 Professor-Z 在东方档案里遇到的另一条时间线。五幕故事板从松壑云桥、漓江竹筏、敦煌沙丘、黄山云海到江南水巷，把一段游历写成由星图与鹤羽共同校准的路线。
              </p>
            </div>
          </div>

          <div className="virtual-human-journey-list">
            {journeyScenes.map((scene) => (
              <article className={`virtual-human-journey-scene is-${scene.id}`} key={scene.id}>
                <figure>
                  <OptimizedImage
                    src={scene.image}
                    alt={`Professor-Z 与白川${scene.title}故事板`}
                    sizes="(max-width: 960px) 100vw, 62vw"
                  />
                </figure>
                <div className="virtual-human-journey-copy">
                  <span>{scene.act}</span>
                  <h6>{scene.title}</h6>
                  <p>{scene.text}</p>
                  <div className="virtual-human-tags">
                    {scene.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function useDeferredHeroVideo() {
  const [shouldUseHeroVideo, setShouldUseHeroVideo] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallViewport = window.matchMedia('(max-width: 720px)').matches;
    const isConstrainedConnection =
      connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);

    if (prefersReducedMotion || isSmallViewport || isConstrainedConnection) {
      return undefined;
    }

    const startVideo = () => setShouldUseHeroVideo(true);
    let idleId;
    let timeoutId;

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(startVideo, { timeout: 1600 });
    } else {
      timeoutId = window.setTimeout(startVideo, 900);
    }

    return () => {
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return shouldUseHeroVideo;
}

function HeroBackground() {
  const shouldUseHeroVideo = useDeferredHeroVideo();

  return (
    <div className={`hero-background ${shouldUseHeroVideo ? 'has-video' : 'is-poster'}`} aria-hidden="true">
      {shouldUseHeroVideo ? (
        <video src={HERO_VIDEO_SRC} poster={HERO_POSTER_SRC} autoPlay muted loop playsInline preload="metadata" />
      ) : null}
    </div>
  );
}

function ToyIpTemplateSpread({ activeMember, spread, spreadIndex }) {
  return (
    <article className={`toy-ip-template-spread toy-ip-template-${spread.layout} toy-ip-${activeMember.id}-spread`}>
      <div className="toy-ip-template-index">
        <span>{String(spreadIndex + 1).padStart(2, '0')}</span>
        <small>{spread.kicker}</small>
      </div>

      {spread.brand ? (
        <div className="toy-ip-band-lockup" aria-label={`${spread.brand.title} ${spread.brand.code}`}>
          <strong>{spread.brand.title}</strong>
          <span>{spread.brand.code}</span>
        </div>
      ) : null}

      <div className="toy-ip-template-copy">
        <p>{spread.subtitle}</p>
        <h4>{spread.title}</h4>
        <span>{spread.caption}</span>
      </div>

      <div className="toy-ip-template-media" aria-label={`${activeMember.label} ${spread.kicker} 素材`}>
        {spread.images.map((image) => (
          <figure className={`toy-ip-asset-frame toy-ip-asset-${image.frame}`} key={image.src}>
            <OptimizedImage
              className={image.fit === 'contain' ? 'is-contained' : undefined}
              src={image.src}
              alt={`${activeMember.label} ${image.label}`}
            />
            <figcaption>{image.label}</figcaption>
          </figure>
        ))}
        {spread.elements ? (
          <div className="toy-ip-poster-breakdown" aria-label={`${activeMember.label} 海报元素拆解`}>
            {spread.elements.map((element) => (
              <div className="toy-ip-breakdown-item" key={element.title}>
                <strong>{element.title}</strong>
                <span>{element.text}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="toy-ip-template-footer">
        {spread.writeups ? (
          <div className="toy-ip-writeup-grid">
            {spread.writeups.map((item) => (
              <div className="toy-ip-writeup" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        ) : null}
        <div className="toy-ip-template-tags">
          {spread.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="toy-ip-spec-list">
          {spread.specs.map((spec) => (
            <span key={spec}>{spec}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ToyIpMemberPanel({ member, isActive }) {
  return (
    <div
      id={`toy-ip-member-panel-${member.id}`}
      className="toy-ip-wall"
      role="tabpanel"
      aria-labelledby={`toy-ip-tab-${member.id}`}
      aria-hidden={!isActive}
      hidden={!isActive}
    >
      {member.spreads.map((spread, spreadIndex) =>
        spread.layout ? (
          <ToyIpTemplateSpread
            activeMember={member}
            spread={spread}
            spreadIndex={spreadIndex}
            key={spread.title}
          />
        ) : (
          <article className={`toy-ip-spread toy-ip-spread-${spread.type}`} key={spread.title}>
            <div className="toy-ip-spread-mark">
              <span>{String(spreadIndex + 1).padStart(2, '0')}</span>
              <small>{spread.kicker}</small>
            </div>

            {spread.image ? (
              <div className="toy-ip-spread-image">
                <OptimizedImage src={spread.image} alt={`${member.label} ${spread.kicker}`} />
              </div>
            ) : null}

            {spread.type === 'members' ? (
              <div className="toy-ip-member-grid">
                {toyIpMemberBlocks.map((memberBlock) => (
                  <div
                    className="toy-ip-member-block"
                    style={{ '--member-color': memberBlock.color }}
                    key={memberBlock.name}
                  >
                    <span>{memberBlock.role}</span>
                    <strong>{memberBlock.name}</strong>
                  </div>
                ))}
              </div>
            ) : null}

            {spread.type === 'system' ? (
              <div className="toy-ip-system-list">
                {['角色色彩', '乐队身份', '海报档案', '衍生展示'].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ) : null}

            <div className="toy-ip-copy">
              <p>{member.role}</p>
              <h4>{spread.title}</h4>
              <span>{spread.caption}</span>
            </div>

            <div className="toy-ip-keywords">
              {member.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </article>
        ),
      )}
    </div>
  );
}

function ToyIpPortfolio({ activeMember, onSelect, panelId, labelledBy }) {
  const selectMember = (memberId, shouldFocus = false) => {
    onSelect(memberId);

    if (shouldFocus && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById(`toy-ip-tab-${memberId}`)?.focus();
      });
    }
  };

  const handleTabKeyDown = (event) => {
    const currentIndex = toyIpMembers.findIndex((member) => member.id === activeMember.id);
    const selectAt = (nextIndex) => {
      const nextMember = toyIpMembers[(nextIndex + toyIpMembers.length) % toyIpMembers.length];
      event.preventDefault();
      event.stopPropagation();
      selectMember(nextMember.id, true);
    };

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      selectAt(currentIndex + 1);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      selectAt(currentIndex - 1);
    }

    if (event.key === 'Home') {
      selectAt(0);
    }

    if (event.key === 'End') {
      selectAt(toyIpMembers.length - 1);
    }
  };

  return (
    <div
      id={panelId}
      className="toy-ip-panel"
      role="region"
      aria-labelledby={labelledBy}
      style={{ '--toy-accent': activeMember.accent }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="toy-ip-tabs" role="tablist" aria-label="潮玩 IP 成员切换">
        {toyIpMembers.map((member) => (
          <button
            type="button"
            id={`toy-ip-tab-${member.id}`}
            role="tab"
            className={`toy-ip-tab ${member.id === activeMember.id ? 'is-active' : ''}`}
            key={member.id}
            aria-selected={member.id === activeMember.id}
            aria-controls={`toy-ip-member-panel-${member.id}`}
            tabIndex={member.id === activeMember.id ? 0 : -1}
            onClick={(event) => {
              event.stopPropagation();
              selectMember(member.id);
            }}
            onKeyDown={handleTabKeyDown}
          >
            <span>{member.role}</span>
            <strong>{member.label}</strong>
          </button>
        ))}
      </div>

      {toyIpMembers.map((member) => (
        <ToyIpMemberPanel member={member} isActive={member.id === activeMember.id} key={member.id} />
      ))}

    </div>
  );
}

function formatVideoTime(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function VideoPlayerOverlay({ item, index, total, onClose, onPrevious, onNext }) {
  const hasVideo = Boolean(item?.videoSrc);
  const hasMeta = Boolean(item?.date || item?.duration || item?.description);
  const displayIndex = String(index + 1).padStart(2, '0');
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekDraggingRef = useRef(false);
  const seekProgress = duration > 0 ? Math.min(100, Math.max(0, (seekValue / duration) * 100)) : 0;

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setSeekValue(0);
    setIsSeeking(false);
  }, [item?.id, item?.videoSrc]);

  function syncVideoTime(video) {
    const nextTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;

    setDuration(nextDuration);
    setCurrentTime(nextTime);

    if (!isSeeking) {
      setSeekValue(nextTime);
    }
  }

  function handleSeekChange(event) {
    const nextValue = Number(event.target.value);
    setSeekValue(nextValue);
    setCurrentTime(nextValue);
  }

  function commitSeek() {
    if (!videoRef.current || !duration) {
      isSeekDraggingRef.current = false;
      setIsSeeking(false);
      return;
    }

    const nextTime = Math.min(duration, Math.max(0, seekValue));
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
    isSeekDraggingRef.current = false;
    setIsSeeking(false);
  }

  function getSeekTimeFromPoint(clientX, element) {
    if (!duration || !element) {
      return 0;
    }

    const rect = element.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return duration * ratio;
  }

  function updateSeekFromPoint(clientX, element) {
    const nextTime = getSeekTimeFromPoint(clientX, element);
    setSeekValue(nextTime);
    setCurrentTime(nextTime);
    return nextTime;
  }

  function commitSeekToTime(nextTime) {
    if (videoRef.current && duration) {
      videoRef.current.currentTime = Math.min(duration, Math.max(0, nextTime));
    }

    isSeekDraggingRef.current = false;
    setIsSeeking(false);
  }

  function handleSeekPointerDown(event) {
    if (!duration) {
      return;
    }

    isSeekDraggingRef.current = true;
    setIsSeeking(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateSeekFromPoint(event.clientX, event.currentTarget);
  }

  function handleSeekPointerMove(event) {
    if (!isSeekDraggingRef.current) {
      return;
    }

    updateSeekFromPoint(event.clientX, event.currentTarget);
  }

  function handleSeekPointerUp(event) {
    if (!isSeekDraggingRef.current) {
      return;
    }

    const nextTime = updateSeekFromPoint(event.clientX, event.currentTarget);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    commitSeekToTime(nextTime);
  }

  function handleSeekKeyDown(event) {
    if (!duration) {
      return;
    }

    const step = event.shiftKey ? 10 : 5;
    let nextTime = seekValue;

    if (event.key === 'ArrowLeft') {
      nextTime -= step;
    } else if (event.key === 'ArrowRight') {
      nextTime += step;
    } else if (event.key === 'Home') {
      nextTime = 0;
    } else if (event.key === 'End') {
      nextTime = duration;
    } else {
      return;
    }

    event.preventDefault();
    const clampedTime = Math.min(duration, Math.max(0, nextTime));
    setSeekValue(clampedTime);
    setCurrentTime(clampedTime);
    commitSeekToTime(clampedTime);
  }

  return (
    <div className="video-player-backdrop" role="dialog" aria-modal="true" aria-labelledby="video-player-title" onClick={onClose}>
      <article className="video-player-shell" onClick={(event) => event.stopPropagation()}>
        <header className="video-player-header">
          <div>
            <span>VIDEO {displayIndex} / {String(total).padStart(2, '0')}</span>
            <h2 id="video-player-title">{item?.title || 'VIDEO SLOT'}</h2>
          </div>
          <div className="video-player-controls" aria-label="视频播放控制">
            <button type="button" onClick={onPrevious}>PREV</button>
            <button type="button" onClick={onNext}>NEXT</button>
            <button type="button" onClick={onClose}>CLOSE</button>
          </div>
        </header>

        <div className="video-player-stage">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={item.videoSrc}
                poster={item.poster || undefined}
                controls
                autoPlay
                playsInline
                onLoadedMetadata={(event) => syncVideoTime(event.currentTarget)}
                onDurationChange={(event) => syncVideoTime(event.currentTarget)}
                onTimeUpdate={(event) => syncVideoTime(event.currentTarget)}
              />
              <div className="video-player-seek" style={{ '--seek-progress': `${seekProgress}%` }}>
                <span>{formatVideoTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={Math.min(seekValue, duration || 0)}
                  disabled={!duration}
                  aria-label="视频播放进度"
                  onPointerDown={() => setIsSeeking(true)}
                  onMouseDown={() => setIsSeeking(true)}
                  onTouchStart={() => setIsSeeking(true)}
                  onChange={handleSeekChange}
                  onPointerUp={commitSeek}
                  onMouseUp={commitSeek}
                  onTouchEnd={commitSeek}
                  onKeyUp={commitSeek}
                  onBlur={commitSeek}
                />
                <button
                  type="button"
                  className="video-player-seek-hit"
                  role="slider"
                  aria-label="Video progress"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration || 0)}
                  aria-valuenow={Math.round(seekValue || 0)}
                  aria-valuetext={`${formatVideoTime(seekValue)} / ${formatVideoTime(duration)}`}
                  disabled={!duration}
                  onPointerDown={handleSeekPointerDown}
                  onPointerMove={handleSeekPointerMove}
                  onPointerUp={handleSeekPointerUp}
                  onPointerCancel={commitSeek}
                  onKeyDown={handleSeekKeyDown}
                >
                  <span className="sr-only">Video progress</span>
                </button>
                <span>{formatVideoTime(duration)}</span>
              </div>
            </>
          ) : (
            <div className="video-player-pending" role="status">
              <span>VIDEO SOURCE</span>
              <strong>待上传</strong>
            </div>
          )}
        </div>

        {hasMeta ? (
          <footer className="video-player-meta">
            {item?.date ? <span>{item.date}</span> : null}
            {item?.duration ? <span>{item.duration}</span> : null}
            {item?.description ? <p>{item.description}</p> : null}
          </footer>
        ) : null}
      </article>
    </div>
  );
}

function WorkModal({
  project,
  index,
  total,
  phase = 'opening',
  direction = 'open',
  motionType = 'archive',
  onClose,
  onExited,
  onPrevious,
  onNext,
  children,
}) {
  const titleId = 'work-modal-title';
  const descriptionId = 'work-modal-description';

  return (
    <div
      className={`work-modal-backdrop is-${phase}`}
      data-work-motion={motionType}
      data-work-direction={direction}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={onClose}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && phase === 'closing') {
          onExited?.();
        }
      }}
    >
      <article
        className={`work-modal is-${phase}`}
        style={{ '--project-tone': project.accent }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="work-modal-header">
          <div className="work-modal-title-block">
            <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <h2 id={titleId}>{project.title}</h2>
            <p id={descriptionId}>{project.type} / {project.year}</p>
          </div>
          <div className="work-modal-controls" aria-label="Work navigation">
            <button type="button" onClick={onPrevious}>PREV</button>
            <button type="button" onClick={onNext}>NEXT</button>
            <button type="button" className="work-modal-close" onClick={onClose}>CLOSE</button>
          </div>
        </header>

        <div className="work-modal-hero">
          <div className="work-modal-media">
            {project.image ? (
              <OptimizedImage src={project.image} alt={`${project.title} preview`} eager />
            ) : (
              <div className="work-modal-placeholder">
                <strong>{project.archiveCode ?? String(index + 1).padStart(2, '0')}</strong>
                <span>{project.status}</span>
              </div>
            )}
          </div>
          <div className="work-modal-summary">
            <span>{project.skillType}</span>
            <p>{project.description}</p>
            <div className="work-modal-tags">
              {project.tags.slice(0, 5).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="work-modal-detail">
          {children ?? (
            <div className="work-modal-empty">
              <strong>{project.previewLabel}</strong>
              <span>{project.detailPromise}</span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function App() {
  const [activeToyIpId, setActiveToyIpId] = useState('band');
  const [activeView, setActiveView] = useState(getInitialView);
  const [scrambleView, setScrambleView] = useState(getInitialView);
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const [transitionLabel, setTransitionLabel] = useState(() => transitionLabels[getInitialView()] ?? 'ZHANG HAOYU');
  const [transitionSignal, setTransitionSignal] = useState(0);
  const [activeWorkFilter, setActiveWorkFilter] = useState('all');
  const [workFilterSignal, setWorkFilterSignal] = useState(0);
  const [workFilterPhase, setWorkFilterPhase] = useState('ready');
  const [hoveredWorkIndex, setHoveredWorkIndex] = useState(null);
  const [workOpenTransition, setWorkOpenTransition] = useState(null);
  const [videoOpenTransition, setVideoOpenTransition] = useState(null);
  const [workModalPhase, setWorkModalPhase] = useState('idle');
  const [workModalDirection, setWorkModalDirection] = useState('open');
  const [workModalSignal, setWorkModalSignal] = useState(0);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [introInstanceKey, setIntroInstanceKey] = useState(0);
  const [introExitSignal, setIntroExitSignal] = useState(0);
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [openingVideoIndex, setOpeningVideoIndex] = useState(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const transitionTimersRef = useRef([]);
  const workFilterTimersRef = useRef([]);
  const workModalTimersRef = useRef([]);
  const workOpenTransitionTimersRef = useRef([]);
  const videoOpenTimersRef = useRef([]);
  const videoTrackRef = useRef(null);
  const activeToyIpMember = toyIpMembers.find((member) => member.id === activeToyIpId) ?? toyIpMembers[0];
  const topEntryNavItems = useMemo(
    () => [
      { label: '首页', href: '#top', view: 'top', transitionLabel: 'ZHANG HAOYU' },
      ...navItems.map((item) => {
        const view = getHashView(item.href);
        return {
          ...item,
          view,
          transitionLabel: transitionLabels[view] ?? item.label,
        };
      }),
    ],
    [],
  );
  const workCategoryItems = useMemo(() => {
    const counts = new Map();
    projects.forEach((project) => {
      counts.set(project.type, (counts.get(project.type) ?? 0) + 1);
    });

    return [
      { label: 'ALL', value: 'all', count: projects.length },
      ...Array.from(counts.entries()).map(([label, count]) => ({
        label,
        value: label,
        count,
      })),
    ];
  }, []);
  const visibleProjects = useMemo(
    () =>
      activeWorkFilter === 'all'
        ? projects
        : projects.filter((project) => project.type === activeWorkFilter),
    [activeWorkFilter],
  );
  const selectedProject = selectedWorkIndex === null ? null : visibleProjects[selectedWorkIndex] ?? null;
  const hoveredProject = hoveredWorkIndex === null ? null : visibleProjects[hoveredWorkIndex] ?? null;
  const selectedVideo = selectedVideoIndex === null ? null : videoItems[selectedVideoIndex] ?? null;
  const shouldRenderWorkDetail = Boolean(
    selectedProject && (prefersReducedMotion || workModalPhase === 'ready' || workModalPhase === 'closing'),
  );
  const ambientProject = selectedProject ?? hoveredProject ?? visibleProjects[0] ?? null;
  const ambientMotionType = getWorkMotionType(selectedProject ?? hoveredProject ?? ambientProject);
  const viewClass = (baseClassName, view) => getViewClassName(baseClassName, view, activeView);

  const normalizeVideoIndex = (index) => (index + videoItems.length) % videoItems.length;

  const scrollVideoCardIntoView = (index, behavior = prefersReducedMotion ? 'auto' : 'smooth') => {
    window.requestAnimationFrame(() => {
      videoTrackRef.current
        ?.querySelector(`[data-video-index="${index}"]`)
        ?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
    });
  };

  const selectActiveVideo = (index, { scroll = true, behavior } = {}) => {
    const nextIndex = normalizeVideoIndex(index);
    setActiveVideoIndex(nextIndex);
    if (scroll) {
      scrollVideoCardIntoView(nextIndex, behavior);
    }
    return nextIndex;
  };

  const moveActiveVideo = (direction) => {
    clearVideoOpenTimers();
    setOpeningVideoIndex(null);
    setVideoOpenTransition(null);
    selectActiveVideo(activeVideoIndex + (direction === 'previous' ? -1 : 1));
  };

  const handleVideoCoverClick = (index, event) => {
    const nextIndex = normalizeVideoIndex(index);
    const item = videoItems[nextIndex];
    clearVideoOpenTimers();

    if (!item) {
      setOpeningVideoIndex(null);
      return;
    }

    if (nextIndex !== activeVideoIndex) {
      setOpeningVideoIndex(null);
      setVideoOpenTransition(null);
      selectActiveVideo(nextIndex);
      return;
    }

    setOpeningVideoIndex(nextIndex);

    const source = event?.currentTarget?.closest?.('.video-card') ?? event?.currentTarget;
    const media = source?.querySelector?.('.video-cover') ?? source;
    const rect = media?.getBoundingClientRect?.();

    if (rect && !prefersReducedMotion) {
      setVideoOpenTransition({
        id: `${item.id}-${Date.now()}`,
        kind: 'video',
        title: item.title || `VIDEO ${String(nextIndex + 1).padStart(2, '0')}`,
        imageSrc: item.poster,
        label: 'OPENING',
        accent: '#ff2a14',
        motionType: 'video-scan',
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    } else {
      setVideoOpenTransition(null);
    }

    if (prefersReducedMotion) {
      setOpeningVideoIndex(null);
      setSelectedVideoIndex(nextIndex);
      return;
    }

    videoOpenTimersRef.current = [
      window.setTimeout(() => {
        setSelectedVideoIndex(nextIndex);
      }, 220),
      window.setTimeout(() => {
        setVideoOpenTransition(null);
      }, 980),
      window.setTimeout(() => {
        setOpeningVideoIndex(null);
      }, 1040),
    ];
  };

  const closeVideoOverlay = () => {
    clearVideoOpenTimers();
    setOpeningVideoIndex(null);
    setVideoOpenTransition(null);
    setSelectedVideoIndex(null);
  };

  const moveSelectedVideo = (direction) => {
    const currentIndex = selectedVideoIndex ?? activeVideoIndex;
    const nextIndex = selectActiveVideo(currentIndex + (direction === 'previous' ? -1 : 1));
    setSelectedVideoIndex(nextIndex);
  };

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimersRef.current = [];
  };

  const clearWorkFilterTimers = () => {
    workFilterTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    workFilterTimersRef.current = [];
  };

  const clearWorkModalTimers = () => {
    workModalTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    workModalTimersRef.current = [];
  };

  const clearWorkOpenTransitionTimers = () => {
    workOpenTransitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    workOpenTransitionTimersRef.current = [];
  };

  const clearVideoOpenTimers = () => {
    videoOpenTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    videoOpenTimersRef.current = [];
  };

  const pushViewHash = (nextView) => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextHash = `#${nextView}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  };

  const runViewTransition = (nextView, nextLabel) => {
    setScrambleView(nextView);
    setTransitionLabel(nextLabel);
    setTransitionSignal((current) => current + 1);
    clearTransitionTimers();

    if (prefersReducedMotion) {
      setActiveView(nextView);
      setTransitionPhase('idle');
      pushViewHash(nextView);
      return;
    }

    if (nextView === activeView) {
      setTransitionPhase('entering');
      pushViewHash(nextView);
      transitionTimersRef.current = [window.setTimeout(() => setTransitionPhase('idle'), 360)];
      return;
    }

    setTransitionPhase('leaving');
    transitionTimersRef.current = [
      window.setTimeout(() => {
        setActiveView(nextView);
        pushViewHash(nextView);
        setTransitionPhase('entering');
      }, 360),
      window.setTimeout(() => {
        setTransitionPhase('idle');
      }, 860),
    ];
  };

  const navigateToView = (event, href, label) => {
    event?.preventDefault();
    const nextView = getHashView(href);
    const nextLabel = label ?? transitionLabels[nextView] ?? 'ZHANG HAOYU';
    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setSelectedWorkIndex(null);
    setWorkOpenTransition(null);
    setWorkModalPhase('idle');
    setSelectedVideoIndex(null);
    clearVideoOpenTimers();
    setOpeningVideoIndex(null);
    setVideoOpenTransition(null);

    if (isIntroVisible) {
      setIntroExitSignal((current) => current + 1);
      window.setTimeout(() => {
        setIsIntroVisible(false);
        runViewTransition(nextView, nextLabel);
      }, prefersReducedMotion ? 90 : 520);
      return;
    }

    setIsIntroVisible(false);
    runViewTransition(nextView, nextLabel);
  };

  const wakeIntroZ = (event) => {
    event?.preventDefault();
    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setSelectedWorkIndex(null);
    setWorkOpenTransition(null);
    setWorkModalPhase('idle');
    setSelectedVideoIndex(null);
    clearVideoOpenTimers();
    setOpeningVideoIndex(null);
    setVideoOpenTransition(null);
    setIntroExitSignal(0);
    setIntroInstanceKey((current) => current + 1);
    setIsIntroVisible(true);
  };

  const handleWorkFilterChange = (nextFilter) => {
    if (nextFilter === activeWorkFilter) {
      return;
    }

    setWorkFilterSignal((current) => current + 1);
    setHoveredWorkIndex(null);
    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setSelectedWorkIndex(null);
    setWorkOpenTransition(null);
    setWorkModalPhase('idle');
    clearVideoOpenTimers();
    setOpeningVideoIndex(null);
    setVideoOpenTransition(null);

    clearWorkFilterTimers();

    if (prefersReducedMotion) {
      setActiveWorkFilter(nextFilter);
      setWorkFilterPhase('ready');
      return;
    }

    setWorkFilterPhase('partial-out');
    workFilterTimersRef.current = [
      window.setTimeout(() => {
        setActiveWorkFilter(nextFilter);
        setWorkFilterPhase('partial-in');
      }, 260),
      window.setTimeout(() => {
        setWorkFilterPhase('ready');
      }, 760),
    ];
  };

  const openWorkModal = (index, event) => {
    const nextProject = visibleProjects[index];

    if (!nextProject) {
      return;
    }

    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setHoveredWorkIndex(index);
    setWorkModalDirection('open');
    setWorkModalPhase('opening');
    setWorkModalSignal((current) => current + 1);

    const source = event?.currentTarget?.closest?.('.project-card') ?? event?.currentTarget;
    const media = source?.querySelector?.('.project-media') ?? source;
    const rect = media?.getBoundingClientRect?.();

    if (rect && !prefersReducedMotion) {
      setWorkOpenTransition({
        id: `${nextProject.title}-${Date.now()}`,
        kind: 'work',
        project: nextProject,
        imageSrc: getOptimizedImageSrc(nextProject.image) ?? nextProject.image,
        motionType: getWorkMotionType(nextProject),
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    } else {
      setWorkOpenTransition(null);
    }

    if (prefersReducedMotion) {
      setSelectedWorkIndex(index);
      setWorkModalPhase('ready');
      return;
    }

    workModalTimersRef.current = [
      window.setTimeout(() => {
        setSelectedWorkIndex(index);
      }, 110),
      window.setTimeout(() => {
        setWorkModalPhase('ready');
      }, 820),
    ];
    workOpenTransitionTimersRef.current = [
      window.setTimeout(() => {
        setWorkOpenTransition(null);
      }, 760),
    ];
  };

  const finishWorkModalClose = () => {
    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setSelectedWorkIndex(null);
    setWorkOpenTransition(null);
    setWorkModalPhase('idle');
  };

  const closeWorkModal = () => {
    if (workModalPhase === 'closing') {
      return;
    }

    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setWorkOpenTransition(null);

    if (prefersReducedMotion || !selectedProject) {
      finishWorkModalClose();
      return;
    }

    setWorkModalPhase('closing');
  };

  const moveWorkModal = (direction) => {
    if (selectedWorkIndex === null || visibleProjects.length <= 1) {
      return;
    }

    clearWorkModalTimers();
    clearWorkOpenTransitionTimers();
    setWorkOpenTransition(null);

    const nextIndex =
      direction === 'previous'
        ? (selectedWorkIndex - 1 + visibleProjects.length) % visibleProjects.length
        : (selectedWorkIndex + 1) % visibleProjects.length;

    setWorkModalDirection(direction);
    setWorkModalPhase(direction === 'previous' ? 'switch-prev' : 'switch-next');
    setWorkModalSignal((current) => current + 1);

    if (prefersReducedMotion) {
      setSelectedWorkIndex(nextIndex);
      setWorkModalPhase('ready');
      return;
    }

    workModalTimersRef.current = [
      window.setTimeout(() => {
        setSelectedWorkIndex(nextIndex);
      }, 90),
      window.setTimeout(() => {
        setWorkModalPhase('ready');
      }, 460),
    ];
  };

  const showPreviousWork = () => moveWorkModal('previous');

  const showNextWork = () => moveWorkModal('next');

  const renderSelectedWorkDetail = () => {
    if (!selectedProject) {
      return null;
    }

    if (selectedProject.layout === 'guitar-tuner-case') {
      return <GuitarTunerPortfolio panelId="work-modal-case-panel" labelledBy="work-modal-title" />;
    }

    if (selectedProject.layout === 'toy-ip-case') {
      return (
        <ToyIpPortfolio
          activeMember={activeToyIpMember}
          onSelect={setActiveToyIpId}
          panelId="work-modal-case-panel"
          labelledBy="work-modal-title"
        />
      );
    }

    if (selectedProject.layout === 'brand-kv-case') {
      return (
        <BrandKvPortfolio
          sections={selectedProject.caseSections}
          panelId="work-modal-case-panel"
          labelledBy="work-modal-title"
        />
      );
    }

    if (selectedProject.layout === 'poster-sketch-case') {
      return (
        <PosterSketchPortfolio
          posterItems={selectedProject.posterItems}
          sketchItems={selectedProject.sketchItems}
          panelId="work-modal-case-panel"
          labelledBy="work-modal-title"
        />
      );
    }

    if (selectedProject.layout === 'virtual-human-case') {
      return (
        <VirtualHumanPortfolio
          sections={selectedProject.caseSections}
          journeyScenes={selectedProject.journeyScenes}
          panelId="work-modal-case-panel"
          labelledBy="work-modal-title"
        />
      );
    }

    if (selectedProject.layout === 'packaging-case') {
      return (
        <XiaoniaozhuoPortfolio
          sections={selectedProject.caseSections}
          panelId="work-modal-case-panel"
          labelledBy="work-modal-title"
        />
      );
    }

    if (selectedProject.layout === 'wide-case') {
      return (
        <WelfareParkPortfolio
          boards={selectedProject.caseBoards}
          panelId="work-modal-case-panel"
          labelledBy="work-modal-title"
        />
      );
    }

    return null;
  };

  useEffect(() => {
    const syncViewFromLocation = () => {
      const nextView = getHashView(window.location.hash);
      setActiveView(nextView);
      setScrambleView(nextView);
      setTransitionLabel(transitionLabels[nextView] ?? 'ZHANG HAOYU');
      clearWorkModalTimers();
      clearWorkOpenTransitionTimers();
      setSelectedWorkIndex(null);
      setWorkOpenTransition(null);
      setWorkModalPhase('idle');
      setSelectedVideoIndex(null);
      clearVideoOpenTimers();
      setOpeningVideoIndex(null);
      setVideoOpenTransition(null);
    };

    window.addEventListener('hashchange', syncViewFromLocation);
    window.addEventListener('popstate', syncViewFromLocation);

    return () => {
      window.removeEventListener('hashchange', syncViewFromLocation);
      window.removeEventListener('popstate', syncViewFromLocation);
      clearTransitionTimers();
      clearWorkFilterTimers();
      clearWorkModalTimers();
      clearWorkOpenTransitionTimers();
      clearVideoOpenTimers();
    };
  }, []);

  useEffect(() => {
    if (selectedWorkIndex !== null && selectedWorkIndex >= visibleProjects.length) {
      setSelectedWorkIndex(null);
    }
  }, [selectedWorkIndex, visibleProjects.length]);

  useEffect(() => {
    if (workModalPhase !== 'closing') {
      return undefined;
    }

    const closeTimerId = window.setTimeout(finishWorkModalClose, 360);

    return () => {
      window.clearTimeout(closeTimerId);
    };
  }, [workModalPhase]);

  useEffect(() => {
    if (hoveredWorkIndex !== null && hoveredWorkIndex >= visibleProjects.length) {
      setHoveredWorkIndex(null);
    }
  }, [hoveredWorkIndex, visibleProjects.length]);

  useEffect(() => {
    if (activeView === 'videos') {
      scrollVideoCardIntoView(activeVideoIndex, prefersReducedMotion ? 'auto' : 'instant');
    }
  }, [activeView, prefersReducedMotion]);

  useEffect(() => {
    const handleVideoKeys = (event) => {
      const tagName = event.target?.tagName;
      const isTypingTarget = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';

      if (isTypingTarget) {
        return;
      }

      if (selectedVideo) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeVideoOverlay();
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          moveSelectedVideo('previous');
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          moveSelectedVideo('next');
        }

        return;
      }

      if (activeView !== 'videos') {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveActiveVideo('previous');
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveActiveVideo('next');
      }
    };

    window.addEventListener('keydown', handleVideoKeys);

    return () => {
      window.removeEventListener('keydown', handleVideoKeys);
    };
  }, [activeView, activeVideoIndex, selectedVideo, selectedVideoIndex]);

  useEffect(() => {
    if (!selectedVideo) {
      return undefined;
    }

    document.body.classList.add('has-video-player');

    return () => {
      document.body.classList.remove('has-video-player');
    };
  }, [selectedVideo]);

  useEffect(() => {
    if (!selectedProject) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        closeWorkModal();
      }
    };

    document.body.classList.add('has-work-modal');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('has-work-modal');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedProject]);

  return (
    <main
      className="top-entry-main"
      data-active-view={activeView}
      data-transitioning={transitionPhase !== 'idle' ? 'true' : 'false'}
      data-work-phase={workFilterPhase}
      data-work-modal-phase={workModalPhase}
    >
      {!prefersReducedMotion ? (
        <Suspense fallback={null}>
          <MotionDirector
            activeView={activeView}
            transitionPhase={transitionPhase}
            isIntroVisible={isIntroVisible}
            introInstanceKey={introInstanceKey}
            workFilterPhase={workFilterPhase}
            workFilterSignal={workFilterSignal}
            workModalPhase={workModalPhase}
            workModalSignal={workModalSignal}
            selectedProjectKey={selectedProject?.title ?? ''}
          />
        </Suspense>
      ) : null}
      <IntroLoader
        key={introInstanceKey}
        isVisible={isIntroVisible}
        exitSignal={introExitSignal}
        ignoreDismissSelector="[data-intro-wake]"
        onComplete={() => setIsIntroVisible(false)}
      />
      <CursorLightTrail />
      <PageTransitionOverlay
        phase={transitionPhase}
        label={transitionLabel}
        signal={transitionSignal}
        view={scrambleView}
      />
      <WorkOpenTransition transition={workOpenTransition ?? videoOpenTransition} />
      <header className="site-header" aria-label="主导航">
        <a
          className={`brand ${activeView === 'top' ? 'is-active' : ''}`}
          href="#top"
          data-intro-wake
          aria-label="返回首页"
          aria-current={activeView === 'top' ? 'page' : undefined}
          onClick={wakeIntroZ}
        >
          <span>
            <ScrambleText text="ZH" trigger={scrambleView === 'top' ? transitionSignal : 0} />
          </span>
          <strong>
            <ScrambleText text="张浩宇" trigger={scrambleView === 'top' ? transitionSignal : 0} />
          </strong>
          <small className="brand-z-hint">唤醒 Z</small>
        </a>
        <nav aria-label="页面入口">
          {topEntryNavItems.map((item) => (
            <a
              key={item.href}
              className={activeView === item.view ? 'is-active' : ''}
              href={item.href}
              aria-current={activeView === item.view ? 'page' : undefined}
              onClick={(event) => navigateToView(event, item.href, item.transitionLabel)}
            >
              <ScrambleText text={item.label} trigger={scrambleView === item.view ? transitionSignal : 0} />
            </a>
          ))}
        </nav>
        <a
          className={`header-cta ${activeView === 'contact' ? 'is-active' : ''}`}
          href="#contact"
          onClick={(event) => navigateToView(event, '#contact', 'CONTACT')}
        >
          <ScrambleText text="联系合作" trigger={scrambleView === 'contact' ? transitionSignal : 0} />
        </a>
      </header>

      <section className={viewClass('hero', 'top')} id="top">
        <HeroBackground />
        <div className="hero-glass" />
        <div className="hero-poster hero-poster-compact shell">
          <div className="hero-word hero-word-top">ZHANG</div>
          <div className="hero-word hero-word-bottom">HAOYU</div>

          <div className="hero-title-block hero-title-block-compact">
            <p className="eyebrow">AIGC Visual Designer</p>
            <h1>
              <span>ZHANG</span>
              <span>HAOYU</span>
            </h1>
            <p className="hero-lede hero-lede-compact">Visual systems, AI video, character IP.</p>
            <div className="hero-role-list hero-role-list-compact" aria-label="Portfolio directions">
              <span>Visual Systems</span>
              <span>AI Video</span>
              <span>Character IP</span>
            </div>
          </div>

          <div className="hero-actions hero-bottom-actions">
            <a
              className="primary-button"
              href="#projects"
              onClick={(event) => navigateToView(event, '#projects', 'WORKS')}
            >
              <ScrambleText text="查看作品" trigger={scrambleView === 'projects' ? transitionSignal : 0} />
            </a>
            <a
              className="ghost-button"
              href="#videos"
              onClick={(event) => navigateToView(event, '#videos', 'VIDEO')}
            >
              <ScrambleText text="查看视频" trigger={scrambleView === 'videos' ? transitionSignal : 0} />
            </a>
            <a
              className="ghost-button"
              href="#about"
              onClick={(event) => navigateToView(event, '#about', 'ABOUT')}
            >
              <ScrambleText text="了解经历" trigger={scrambleView === 'about' ? transitionSignal : 0} />
            </a>
          </div>
        </div>
      </section>

      <section className={viewClass('intro-section', 'about')} id="about">
        <div className="shell two-column">
          <div className="section-heading">
            <h2>从空间系统训练，转向 AIGC 视觉生产。</h2>
          </div>
          <div className="intro-copy">
            <p>
              我叫张浩宇，环境艺术设计与风景园林背景让我习惯从空间、场景和系统关系里组织视觉表达。
              2024-2026 年在中建八局西南分公司担任装饰设计师后，我开始把主要精力转向视觉、品牌、
              AI 视频和 AIGC 工具化创作。
            </p>
            <p>
              这个作品集会持续呈现我如何使用 Codex、生成式视觉工具和设计判断，把一个想法拆成可执行流程，
              再落成主视觉、视频、角色、产品品牌或可运行原型。
            </p>
          </div>
        </div>

        <div className="shell profile-grid">
          <article className="portrait-card">
            <OptimizedImage src="/assets/zhang-haoyu-portrait.jpg" alt="张浩宇个人照片" />
            <div>
              <span className="profile-role">Current Positioning</span>
            <h3>AIGC 设计师</h3>
            <p>
                具备视觉审美、品牌设计、AI 视频设计兴趣，以及对 Codex 等先进 AI 工具的强学习能力。当前作品集重点呈现可执行的视觉成果，而不是泛泛的工具清单。
            </p>
          </div>
        </article>

          <article className="bio-card">
            <div className="bio-header">
              <span>Experience</span>
              <strong>1999 / Xi'an / AIGC</strong>
            </div>
            <ul className="timeline">
              {experience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="contact-card">
            <span>Contact</span>
            <div className="contact-list">
              <strong>微信号：zhy1140126014</strong>
              <a href="tel:18392861619">电话：18392861619</a>
              <strong>小红书号：18686993725</strong>
            </div>
          </article>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={viewClass('projects-section works-entry-view', 'projects')} id="projects">
        <WorksAmbientLayer project={ambientProject} phase={workFilterPhase} motionType={ambientMotionType} />
        <div className="shell works-layout">
          <aside className="works-sidebar" aria-label="作品分类">
            <div className="works-sidebar-copy">
              <span className="works-kicker">WORKS INDEX</span>
              <h2>SELECTED WORKS</h2>
            </div>
            <div className="works-category-list" role="list" aria-label="按作品类型筛选">
              {workCategoryItems.map((category) => (
                <button
                  type="button"
                  key={category.value}
                  className={activeWorkFilter === category.value ? 'is-active' : ''}
                  aria-pressed={activeWorkFilter === category.value}
                  onClick={() => handleWorkFilterChange(category.value)}
                >
                  <span>
                    <ScrambleText
                      text={category.label}
                      trigger={activeWorkFilter === category.value ? workFilterSignal : 0}
                    />
                  </span>
                  <strong>{String(category.count).padStart(2, '0')}</strong>
                </button>
              ))}
            </div>
          </aside>

          <div className="works-stage" data-work-phase={workFilterPhase}>
            <div className="works-stage-head">
              <span>SELECTED WORKS</span>
              <strong>{String(visibleProjects.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</strong>
            </div>
            <div className="project-grid">
          {visibleProjects.map((project, index) => {
            const isGuitarTunerProject = project.layout === 'guitar-tuner-case';
            const isToyIpProject = project.layout === 'toy-ip-case';
            const isBrandKvProject = project.layout === 'brand-kv-case';
            const isVirtualHumanProject = project.layout === 'virtual-human-case';
            const isXiaoniaozhuoProject = project.layout === 'packaging-case';
            const isWelfareParkProject = project.layout === 'wide-case';
            const isWideCaseCard =
              isGuitarTunerProject ||
              isBrandKvProject ||
              isVirtualHumanProject ||
              isXiaoniaozhuoProject ||
              isWelfareParkProject;
            const projectCardClassName = [
              `project-card tone-${project.tone}`,
              isToyIpProject ? 'toy-ip-card' : '',
              isWideCaseCard ? 'wide-case-card' : '',
              isGuitarTunerProject ? 'guitar-tuner-case-card' : '',
              isBrandKvProject ? 'brand-kv-case-card' : '',
              isVirtualHumanProject ? 'virtual-human-case-card' : '',
              isXiaoniaozhuoProject ? 'xiaoniaozhuo-case-card' : '',
              isWelfareParkProject ? 'welfare-case-card' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <article
                className={projectCardClassName}
                style={{
                  '--project-tone': project.accent,
                  '--i': index,
                  '--work-delay-out': `${Math.min(index, 8) * 18}ms`,
                  '--work-delay-in': `${Math.min(index, 8) * 42}ms`,
                }}
                key={project.title}
                onMouseEnter={() => setHoveredWorkIndex(index)}
                onMouseLeave={() => setHoveredWorkIndex((current) => (current === index ? null : current))}
                onFocus={() => setHoveredWorkIndex(index)}
                onBlur={() => setHoveredWorkIndex((current) => (current === index ? null : current))}
                onClick={(event) => openWorkModal(index, event)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                  }

                  event.preventDefault();
                  openWorkModal(index, event);
                }}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`打开 ${project.title} 项目详情`}
              >
                <div className="project-media">
                  {project.image ? (
                    <OptimizedImage src={project.image} alt={`${project.title} 作品预览`} />
                  ) : (
                    <div className="project-placeholder">
                      <div className="archive-register">
                        <span>{project.archiveCode ?? String(index + 1).padStart(2, '0')}</span>
                        <small>{project.status}</small>
                      </div>
                      <strong>{project.title}</strong>
                      <em>{project.type}</em>
                    </div>
                  )}
                  {project.secondaryImage ? (
                    <div className="wide-case-secondary" aria-hidden="true">
                      <OptimizedImage src={project.secondaryImage} alt="" />
                    </div>
                  ) : null}
                </div>
                <div className="project-body">
                  <div className="project-kicker">
                    <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                    <span>{project.type}</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="project-skill-row">
                    <span>{project.skillType}</span>
                    <strong>{project.status}</strong>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-promise">
                    <span>{project.previewLabel}</span>
                    <strong>{project.detailPromise}</strong>
                  </div>
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
            </div>
          </div>
        </div>
      </section>

      <section className={viewClass('videos-section', 'videos')} id="videos" aria-label="视频作品">
        <div className="videos-bg" aria-hidden="true">
          <span className="videos-bg-word">VIDEO ARCHIVE</span>
          <span className="videos-bg-scan" />
        </div>

        <div className="shell videos-shell">
          <div className="videos-head">
            <h2>VIDEO</h2>
            <div className="videos-controls" aria-label="视频切换">
              <button type="button" onClick={() => moveActiveVideo('previous')}>PREV</button>
              <span>{String(activeVideoIndex + 1).padStart(2, '0')} / {String(videoItems.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => moveActiveVideo('next')}>NEXT</button>
            </div>
          </div>

          <div className="video-track-shell">
            <div className="video-track" ref={videoTrackRef} role="listbox" aria-label="视频作品横向列表">
              {videoItems.map((item, index) => {
                const isActiveVideo = index === activeVideoIndex;
                const isOpeningVideo = index === openingVideoIndex;
                const slotLabel = `视频占位 ${String(index + 1).padStart(2, '0')}`;

                return (
                  <article
                    className={`video-card ${isActiveVideo ? 'is-active' : ''} ${isOpeningVideo ? 'is-opening' : ''}`}
                    data-video-index={index}
                    role="option"
                    aria-selected={isActiveVideo}
                    style={{
                      '--video-opacity': isActiveVideo ? 1 : 0.74,
                      '--video-y': isActiveVideo ? '0px' : '22px',
                      '--video-scale': isActiveVideo ? 1 : 0.68,
                      '--video-stagger': `${Math.min(index, 6) * 72}ms`,
                      '--video-meta-opacity': isActiveVideo ? 1 : 0.72,
                      opacity: 'var(--video-opacity)',
                      transform: 'translate3d(0, var(--video-y), 0) scale(var(--video-scale))',
                      zIndex: isActiveVideo ? 3 : 1,
                    }}
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="video-cover"
                      aria-label={item.title ? `播放 ${item.title}` : `播放 ${slotLabel}`}
                      onClick={(event) => handleVideoCoverClick(index, event)}
                    >
                      {item.poster ? (
                        <OptimizedImage src={item.poster} alt={item.title || slotLabel} />
                      ) : (
                        <span className="video-cover-placeholder" aria-hidden="true">
                          <span>VIDEO</span>
                          <strong>{String(index + 1).padStart(2, '0')}</strong>
                        </span>
                      )}
                    </button>

                    <div className="video-card-meta" aria-hidden={!item.title && !item.date && item.tags.length === 0 && !item.description}>
                      <div className="video-card-row">
                        {item.date ? <span>{item.date}</span> : <span className="video-skeleton-line short" />}
                        {item.tags.length > 0 ? (
                          <span>{item.tags.join(', ')}</span>
                        ) : (
                          <span className="video-skeleton-line medium" />
                        )}
                      </div>
                      {item.title ? <h3>{item.title}</h3> : <span className="video-skeleton-line title" />}
                      {item.description ? <p>{item.description}</p> : <span className="video-skeleton-line copy" />}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={viewClass('strengths-section', 'strengths')} id="strengths">
        <div className="shell section-top">
          <div>
            <h2>核心能力</h2>
          </div>
          <p>视觉判断、AIGC 流程、空间背景、原型落地。</p>
        </div>
        <div className="shell strengths-grid">
          {strengths.map((item, index) => (
            <article className="strength-card" key={item.title}>
              <div className="strength-card-top">
                <span>{item.mark}</span>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="strength-evidence" aria-label={`${item.title} 证据点`}>
                {item.evidence.map((proof) => (
                  <span key={proof}>{proof}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={viewClass('contact-section', 'contact')} id="contact">
        <div className="shell contact-inner">
          <span className="contact-kicker">Collaboration</span>
          <h2>欢迎交流 AIGC 视觉、品牌与 AI 视频设计方向。</h2>
          <p>
            微信：zhy1140126014 / 电话：18392861619 / 小红书：18686993725
          </p>
          <div className="contact-actions">
            <a className="primary-button dark" href="tel:18392861619">
              <ScrambleText text="联系合作" trigger={scrambleView === 'contact' ? transitionSignal : 0} />
            </a>
            <a
              className="ghost-button light"
              href="#top"
              onClick={(event) => navigateToView(event, '#top', 'ZHANG HAOYU')}
            >
              <ScrambleText text="回到顶部" trigger={scrambleView === 'top' ? transitionSignal : 0} />
            </a>
          </div>
        </div>
      </section>

      {selectedProject ? (
        <WorkModal
          key={selectedProject.title}
          project={selectedProject}
          index={selectedWorkIndex}
          total={visibleProjects.length}
          phase={workModalPhase}
          direction={workModalDirection}
          motionType={getWorkMotionType(selectedProject)}
          onClose={closeWorkModal}
          onExited={finishWorkModalClose}
          onPrevious={showPreviousWork}
          onNext={showNextWork}
        >
          {shouldRenderWorkDetail ? renderSelectedWorkDetail() : null}
        </WorkModal>
      ) : null}

      {selectedVideo ? (
        <VideoPlayerOverlay
          item={selectedVideo}
          index={selectedVideoIndex}
          total={videoItems.length}
          onClose={closeVideoOverlay}
          onPrevious={() => moveSelectedVideo('previous')}
          onNext={() => moveSelectedVideo('next')}
        />
      ) : null}
    </main>
  );
}

export default App;
