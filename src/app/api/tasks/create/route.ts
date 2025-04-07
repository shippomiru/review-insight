import { NextResponse } from 'next/server';
import { taskManager } from '../taskManager';

// API路由处理函数
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appName, language = 'en', country = 'us', storeType = 'apple' } = body;
    
    if (!appName) {
      return NextResponse.json({ error: '应用名称不能为空' }, { status: 400 });
    }
    
    console.log(`创建任务: ${appName}, 语言: ${language}, 国家: ${country}`);
    
    // 创建任务并获取任务ID
    const taskId = taskManager.createTask({
      appName,
      language,
      country,
      storeType
    });
    
    // 返回任务ID
    return NextResponse.json({ taskId });
  } catch (error) {
    console.error('创建任务失败:', error);
    return NextResponse.json(
      { error: '创建任务失败，请稍后再试' },
      { status: 500 }
    );
  }
} 