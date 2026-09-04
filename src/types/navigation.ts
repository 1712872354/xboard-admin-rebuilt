export type NavItem = {
  key: string;
  label: string;
  path: string;
  icon: string;
};

export const adminNavigation: NavItem[] = [
  { key: 'dashboard', label: '仪表盘', path: '/', icon: 'layout-dashboard' },
  { key: 'notice', label: '公告管理', path: '/notice', icon: 'megaphone' },
  { key: 'payment', label: '支付配置', path: '/payment', icon: 'credit-card' },
  { key: 'knowledge', label: '知识库管理', path: '/knowledge', icon: 'book-open' },
  { key: 'machine', label: '服务器管理', path: '/server/machine', icon: 'server' },
  { key: 'node', label: '节点管理', path: '/server/node', icon: 'network' },
  { key: 'permission', label: '权限组管理', path: '/permission', icon: 'shield-check' },
  { key: 'route', label: '路由管理', path: '/server/route', icon: 'route' },
  { key: 'subscription', label: '订阅管理', path: '/subscription', icon: 'receipt-text' },
  { key: 'plan', label: '套餐管理', path: '/plan', icon: 'package' },
  { key: 'order', label: '订单管理', path: '/order', icon: 'shopping-cart' },
  { key: 'coupon', label: '优惠券管理', path: '/coupon', icon: 'ticket' },
  { key: 'user', label: '用户管理', path: '/user', icon: 'users' },
  { key: 'ticket', label: '工单管理', path: '/ticket', icon: 'messages-square' },
  { key: 'system', label: '系统管理', path: '/system', icon: 'settings' },
];
