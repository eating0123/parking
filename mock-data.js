window.CityPilotMock = {
  spots: [
    { id: 1, name: '枣园北里 12号院', addr: '兴华大街三段 · 小区内部地面车位', type: 'community', badge: '居委会认证', rate: 3, cap: 15, window: '19:00–次日8:00', dist: '280m', walk: '4分钟', count: 4, ev: false, monthly: 168, x: 28, y: 43, noSlope: true, size: 'standard', covered: false, elevator: true, code: 'ZY-B07', rule: '夜间封顶 ¥15，白天需在 8:00 前驶离', occupancy: 72 },
    { id: 2, name: '大兴荟聚 P2', addr: '欣宁街 15 号 · 商场地下车库 P2 层', type: 'mall', badge: '商场认证', rate: 2, cap: 12, window: '22:00–次日9:00', dist: '450m', walk: '6分钟', count: 23, ev: true, monthly: 168, x: 57, y: 29, noSlope: true, size: 'large', covered: true, elevator: true, code: 'P2-089', rule: '车牌识别自动抬杆，P2 有 8 个充电位', occupancy: 54 },
    { id: 3, name: '魏师傅的车位', addr: '高米店南 3 栋 102 · 产权私家车位', type: 'personal', badge: '个人车位', rate: 4, cap: 0, window: '08:00–18:00', dist: '190m', walk: '3分钟', count: 1, ev: false, monthly: 0, x: 43, y: 56, noSlope: false, size: 'standard', covered: false, elevator: false, code: 'WSF-01', rule: '车主白天上班出借，18:00 前须驶离', occupancy: 31 },
    { id: 4, name: '生物医药基地 P1', addr: '永大路 38 号 · 企业错峰车位', type: 'enterprise', badge: '企业认证', rate: 2.5, cap: 14, window: '19:00–次日8:30', dist: '620m', walk: '9分钟', count: 15, ev: true, monthly: 198, x: 73, y: 61, noSlope: true, size: 'bus', covered: true, elevator: false, code: 'BIO-A12', rule: '需从东门闸机进入，凭订单码抬杆', occupancy: 46 },
    { id: 5, name: '黄村西里 5号院', addr: '兴丰大街 · 老旧小区免费共享位', type: 'community', badge: '居委会认证', rate: 0, cap: 0, window: '19:00–次日8:00', dist: '350m', walk: '5分钟', count: 2, ev: false, monthly: 0, x: 22, y: 68, noSlope: true, size: 'large', covered: false, elevator: true, code: 'HC-05', rule: '老旧小区夜间免费共享，需按时驶离', occupancy: 83 },
    { id: 6, name: '政务中心地下车库', addr: '永华路 · 政务中心 B1', type: 'mall', badge: '政务认证', rate: 2, cap: 12, window: '18:30–次日8:30', dist: '970m', walk: '14分钟', count: 28, ev: true, monthly: 168, x: 64, y: 24, noSlope: true, size: 'large', covered: true, elevator: true, code: 'ZW-B117', rule: '晚间开放社会车辆，近电梯无坡道', occupancy: 38 }
  ],
  orders: [
    { id: 'CP20260711001', name: '大兴荟聚 P2 · P2-089', time: '昨天 22:10 – 今天 07:42', amount: '¥12.0', state: '已完成' },
    { id: 'CP20260709018', name: '枣园北里 12号院', time: '7月8日 19:33 – 23:05', amount: '¥10.5', state: '已完成' },
    { id: 'CP20260706007', name: '魏师傅的车位', time: '7月6日 09:00 – 11:20', amount: '¥8.0', state: '已退款' }
  ],
  enterprise: {
    company: '北京生物医药基地园区',
    lots: 126,
    activeLots: 84,
    weeklyRevenue: 18320,
    openHours: '工作日 19:00 – 次日 08:30',
    adoption: 67,
    gates: ['东门闸机 A', 'P1 地库入口', '访客车辆白名单'],
    staff: [
      { name: '王园区', role: '资产管理员', phone: '138****6021' },
      { name: '李安保', role: '闸机协同', phone: '136****1189' }
    ],
    rows: [
      { area: 'P1 东区', total: 46, shared: 32, revenue: '¥6,820', status: '已上线' },
      { area: 'P1 西区', total: 38, shared: 24, revenue: '¥4,910', status: '已上线' },
      { area: '地面访客区', total: 22, shared: 16, revenue: '¥3,250', status: '审核中' },
      { area: '员工临停车区', total: 20, shared: 12, revenue: '¥3,340', status: '待联调' }
    ]
  }
};
