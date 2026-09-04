export type NavLink={key:string;label:string;path:string;icon:string};
export type NavGroup={key:string;label:string;icon:string;items:NavLink[]};
export const adminNavigation:NavGroup[]=[
 {key:'system',label:'系统管理',icon:'settings',items:[{key:'system-config',label:'系统配置',path:'/config/system',icon:'settings-2'},{key:'plugin',label:'插件管理',path:'/config/plugin',icon:'puzzle'},{key:'theme',label:'主题配置',path:'/config/theme',icon:'palette'},{key:'notice',label:'公告管理',path:'/config/notice',icon:'megaphone'},{key:'payment',label:'支付配置',path:'/config/payment',icon:'credit-card'},{key:'knowledge',label:'知识库管理',path:'/config/knowledge',icon:'book-open'}]},
 {key:'node',label:'节点管理',icon:'network',items:[{key:'machine',label:'服务器管理',path:'/server/machine',icon:'server'},{key:'node-manage',label:'节点管理',path:'/server/manage',icon:'network'},{key:'group',label:'权限组管理',path:'/server/group',icon:'layers-3'},{key:'route',label:'路由管理',path:'/server/route',icon:'route'}]},
 {key:'subscription',label:'订阅管理',icon:'receipt-text',items:[{key:'plan',label:'套餐管理',path:'/finance/plan',icon:'package'},{key:'order',label:'订单管理',path:'/finance/order',icon:'shopping-cart'},{key:'coupon',label:'优惠券管理',path:'/finance/coupon',icon:'ticket'},{key:'gift-card',label:'礼品卡管理',path:'/finance/gift-card',icon:'credit-card'}]},
 {key:'user',label:'用户管理',icon:'users',items:[{key:'user-manage',label:'用户管理',path:'/user/manage',icon:'user'},{key:'ticket',label:'工单管理',path:'/user/ticket',icon:'messages-square'}]},
];
export const dashboardLink:NavLink={key:'dashboard',label:'仪表盘',path:'/',icon:'layout-dashboard'};
