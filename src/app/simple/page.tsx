'use client';

import React from 'react';

export default function SimplePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">简单测试页面</h1>
      <p className="mb-4">这是一个极简测试页面，不依赖任何其他组件</p>
      <a href="/" className="text-blue-500 hover:underline">回到首页</a>
    </div>
  );
}
