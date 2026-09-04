import React from 'react';

export function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return <section className="placeholder-page">
    <div>
      <h1>{title}</h1>
      <p>{description ?? '此页面正在从 XBoard Admin 构建产物与后端接口继续还原。'}</p>
    </div>
    <div className="placeholder-card">
      <div className="placeholder-icon">⌁</div>
      <div><strong>重构中</strong><span>已建立真实后端路由对应关系，页面组件将在后续提交中逐步替换此占位视图。</span></div>
    </div>
  </section>;
}
