export type ModuleConfig = {
  key: string;
  title: string;
  path: string;
  icon: string;
  fetch?: string;
  save?: string;
  drop?: string;
  fetchMethod?: 'GET' | 'POST' | 'ANY';
  saveMethod?: 'POST' | 'GET';
  dropMethod?: 'POST' | 'GET';
};

export const modules: ModuleConfig[] = [
  { key:'notice', title:'公告管理', path:'/notice', icon:'megaphone', fetch:'/notice/fetch', save:'/notice/save', drop:'/notice/drop' },
  { key:'payment', title:'支付配置', path:'/payment', icon:'credit-card', fetch:'/payment/fetch', save:'/payment/save', drop:'/payment/drop' },
  { key:'knowledge', title:'知识库管理', path:'/knowledge', icon:'book-open', fetch:'/knowledge/fetch', save:'/knowledge/save', drop:'/knowledge/drop' },
  { key:'node', title:'节点管理', path:'/server/node', icon:'network', fetch:'/server/manage/getNodes', save:'/server/manage/save', drop:'/server/manage/drop' },
  { key:'route', title:'路由管理', path:'/server/route', icon:'route', fetch:'/server/route/fetch', save:'/server/route/save', drop:'/server/route/drop' },
  { key:'group', title:'分组管理', path:'/server/group', icon:'layers-3', fetch:'/server/group/fetch', save:'/server/group/save', drop:'/server/group/drop' },
  { key:'plan', title:'套餐管理', path:'/plan', icon:'package', fetch:'/plan/fetch', save:'/plan/save', drop:'/plan/drop' },
  { key:'order', title:'订单管理', path:'/order', icon:'shopping-cart', fetch:'/order/fetch', save:'/order/update', drop:'/order/cancel', fetchMethod:'ANY' },
  { key:'coupon', title:'优惠券管理', path:'/coupon', icon:'ticket', fetch:'/coupon/fetch', save:'/coupon/update', drop:'/coupon/drop', fetchMethod:'ANY' },
  { key:'gift-card', title:'礼品卡管理', path:'/gift-card', icon:'credit-card', fetch:'/gift-card/templates', save:'/gift-card/update-template', drop:'/gift-card/delete-template', fetchMethod:'ANY' },
  { key:'user', title:'用户管理', path:'/user', icon:'users', fetch:'/user/fetch', save:'/user/update', drop:'/user/destroy', fetchMethod:'ANY' },
  { key:'ticket', title:'工单管理', path:'/ticket', icon:'messages-square', fetch:'/ticket/fetch', save:'/ticket/reply', drop:'/ticket/close', fetchMethod:'ANY' },
  { key:'theme', title:'主题管理', path:'/theme', icon:'palette', fetch:'/theme/getThemes', save:'/theme/saveThemeConfig', drop:'/theme/delete', fetchMethod:'GET' },
  { key:'plugin', title:'插件管理', path:'/plugin', icon:'puzzle', fetch:'/plugin/getPlugins', save:'/plugin/config', drop:'/plugin/delete' },
  { key:'system', title:'系统管理', path:'/system', icon:'settings', fetch:'/system/getSystemStatus', fetchMethod:'GET' },
  { key:'traffic-reset', title:'流量重置', path:'/traffic-reset', icon:'refresh-cw', fetch:'/traffic-reset/logs', fetchMethod:'GET' },
  { key:'config', title:'系统配置', path:'/config', icon:'sliders-horizontal', fetch:'/config/fetch', save:'/config/save', fetchMethod:'GET' },
  { key:'mail-template', title:'邮件模板', path:'/mail/template', icon:'mail', fetch:'/mail/template/list', save:'/mail/template/save', fetchMethod:'GET' },
];

export const moduleByPath = (path: string) => modules.find(m => path === m.path || path.startsWith(`${m.path}/`));
