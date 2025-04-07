import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Language } from '@/contexts/LanguageContext';

// 内存中存储任务状态（生产环境应使用Redis或其他持久化存储）
interface TaskData {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: any;
  createdAt: number;
  updatedAt: number;
  params: {
    appName: string;
    language: Language;
    country: string;
    storeType: 'apple' | 'google' | 'both';
  };
  error?: string;
}

// 使用全局变量确保在所有请求、重新加载间共享实例
// @ts-ignore - 使用global来存储单例
globalThis.__taskManager = globalThis.__taskManager || {
  tasks: new Map<string, TaskData>()
};

// 简单的任务管理器
export class TaskManager {
  private static instance: TaskManager;
  
  // 获取全局任务存储
  private get tasks(): Map<string, TaskData> {
    // @ts-ignore - 使用全局存储
    return globalThis.__taskManager.tasks;
  }
  
  // 单例模式
  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }
  
  // 创建新任务
  public createTask(params: {
    appName: string;
    language: Language;
    country: string;
    storeType: 'apple' | 'google' | 'both';
  }): string {
    const taskId = uuidv4();
    const now = Date.now();
    
    this.tasks.set(taskId, {
      status: 'pending',
      progress: 0,
      message: '任务已创建，正在准备数据...',
      createdAt: now,
      updatedAt: now,
      params
    });
    
    console.log(`创建任务: ${taskId}, 当前任务总数: ${this.tasks.size}`);
    
    // 启动后台处理（不等待完成）
    this.processTaskInBackground(taskId);
    
    // 任务清理 - 移除24小时前的任务
    this.cleanupOldTasks();
    
    return taskId;
  }
  
  // 获取任务状态
  public getTask(taskId: string): TaskData | null {
    const task = this.tasks.get(taskId);
    if (!task) {
      console.log(`任务未找到: ${taskId}, 当前任务列表: ${Array.from(this.tasks.keys()).join(', ')}`);
      return null;
    }
    return task;
  }
  
  // 列出所有任务ID
  public getAllTaskIds(): string[] {
    return Array.from(this.tasks.keys());
  }
  
  // 更新任务状态
  public updateTask(taskId: string, update: Partial<TaskData>): void {
    const task = this.tasks.get(taskId);
    if (task) {
      this.tasks.set(taskId, { 
        ...task, 
        ...update,
        updatedAt: Date.now()
      });
      console.log(`更新任务: ${taskId}, 进度: ${update.progress || task.progress}%, 消息: ${update.message || task.message}`);
    } else {
      console.error(`更新任务失败: 任务 ${taskId} 不存在`);
    }
  }
  
  // 清理旧任务
  private cleanupOldTasks(): void {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    this.tasks.forEach((task, id) => {
      if (task.createdAt < oneDayAgo) {
        this.tasks.delete(id);
      }
    });
  }
  
  // 后台处理任务
  private async processTaskInBackground(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    try {
      this.updateTask(taskId, {
        status: 'processing',
        progress: 5,
        message: '开始处理任务...'
      });
      
      // 动态导入，避免模块循环依赖
      const appStoreApi = await import('../../analyze-apple/route');
      
      // 确保getAppStoreData函数存在
      if (!appStoreApi.getAppStoreData) {
        throw new Error('getAppStoreData函数未找到，请确保它已被导出');
      }
      
      // 更新任务状态：获取应用信息
      this.updateTask(taskId, {
        progress: 10,
        message: '正在获取应用信息...'
      });
      
      // 调用API处理，传递进度回调
      const result = await appStoreApi.getAppStoreData(
        task.params.appName,
        task.params.language,
        task.params.country,
        (progress: number, message: string) => {
          // 进度范围从10%到95%
          const scaledProgress = 10 + (progress * 0.85);
          this.updateTask(taskId, {
            progress: Math.round(scaledProgress),
            message
          });
        }
      );
      
      // 更新最终结果
      this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        message: '分析完成',
        result
      });
      
      console.log(`任务 ${taskId} 处理完成`);
    } catch (error) {
      console.error(`任务 ${taskId} 处理失败:`, error);
      this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        message: '处理失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
}

// 导出任务管理器单例
export const taskManager = TaskManager.getInstance();

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