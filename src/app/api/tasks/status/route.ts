import { NextResponse } from 'next/server';
import { taskManager } from '../taskManager';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json({ error: '缺少taskId参数' }, { status: 400 });
    }
    
    const task = taskManager.getTask(taskId);
    
    if (!task) {
      return NextResponse.json({ error: '未找到指定任务' }, { status: 404 });
    }
    
    // 返回任务状态
    return NextResponse.json({
      taskId,
      status: task.status,
      progress: task.progress,
      message: task.message,
      updatedAt: task.updatedAt,
      // 仅当任务完成时才返回结果
      ...(task.status === 'completed' ? { result: task.result } : {}),
      // 仅当任务失败时才返回错误
      ...(task.status === 'failed' ? { error: task.error } : {})
    });
  } catch (error) {
    console.error('获取任务状态失败:', error);
    return NextResponse.json(
      { error: '获取任务状态失败，请稍后再试' },
      { status: 500 }
    );
  }
} 