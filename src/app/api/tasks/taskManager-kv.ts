import { v4 as uuidv4 } from 'uuid';
import { Language } from '@/contexts/LanguageContext';
import { kv } from '@vercel/kv';

// 任务数据接口定义
export interface TaskData {
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

// KV版本的任务管理器
export class TaskManagerKV {
  private static instance: TaskManagerKV;
  
  // 单例模式
  public static getInstance(): TaskManagerKV {
    if (!TaskManagerKV.instance) {
      TaskManagerKV.instance = new TaskManagerKV();
    }
    return TaskManagerKV.instance;
  }
  
  // 创建新任务
  public async createTask(params: {
    appName: string;
    language: Language;
    country: string;
    storeType: 'apple' | 'google' | 'both';
  }): Promise<string> {
    const taskId = uuidv4();
    const now = Date.now();
    
    const task: TaskData = {
      status: 'pending',
      progress: 0,
      message: '任务已创建，正在准备数据...',
      createdAt: now,
      updatedAt: now,
      params
    };
    
    // 存储任务到KV
    try {
      await kv.set(`task:${taskId}`, task);
      console.log(`[KV存储] 成功创建任务: ${taskId}, 应用: ${params.appName}`);
      
      // 将任务ID添加到任务列表中
      await kv.sadd('task_ids', taskId);
      console.log(`[KV存储] 任务ID已添加到任务列表`);
    } catch (error) {
      console.error(`[KV存储] 创建任务失败:`, error);
      throw error;
    }
    
    // 启动后台处理（不等待完成）
    this.processTaskInBackground(taskId);
    
    // 任务清理 - 移除24小时前的任务
    this.cleanupOldTasks();
    
    return taskId;
  }
  
  // 获取任务状态
  public async getTask(taskId: string): Promise<TaskData | null> {
    try {
      console.log(`[KV存储] 尝试获取任务: ${taskId}`);
      const task = await kv.get<TaskData>(`task:${taskId}`);
      if (!task) {
        console.log(`[KV存储] 任务未找到: ${taskId}`);
        return null;
      }
      console.log(`[KV存储] 成功获取任务: ${taskId}, 状态: ${task.status}, 进度: ${task.progress}%`);
      return task;
    } catch (error) {
      console.error(`[KV存储] 获取任务失败:`, error);
      return null;
    }
  }
  
  // 列出所有任务ID
  public async getAllTaskIds(): Promise<string[]> {
    try {
      const ids = await kv.smembers('task_ids');
      return Array.isArray(ids) ? ids : [];
    } catch (error) {
      console.error(`获取任务ID列表失败: ${error}`);
      return [];
    }
  }
  
  // 更新任务状态
  public async updateTask(taskId: string, update: Partial<TaskData>): Promise<void> {
    try {
      console.log(`[KV存储] 尝试更新任务: ${taskId}`);
      const task = await kv.get<TaskData>(`task:${taskId}`);
      
      if (task) {
        const updatedTask: TaskData = { 
          ...task, 
          ...update,
          updatedAt: Date.now()
        };
        
        await kv.set(`task:${taskId}`, updatedTask);
        console.log(`[KV存储] 更新任务: ${taskId}, 进度: ${update.progress || task.progress}%, 消息: ${update.message || task.message}`);
      } else {
        console.error(`[KV存储] 更新任务失败: 任务 ${taskId} 不存在`);
      }
    } catch (error) {
      console.error(`[KV存储] 更新任务失败:`, error);
    }
  }
  
  // 清理旧任务
  private async cleanupOldTasks(): Promise<void> {
    try {
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const allIds = await this.getAllTaskIds();
      
      let cleanedCount = 0;
      
      for (const id of allIds) {
        const task = await this.getTask(id);
        if (task && task.createdAt < oneDayAgo) {
          await kv.del(`task:${id}`);
          await kv.srem('task_ids', id);
          cleanedCount++;
        }
      }
      
      if (cleanedCount > 0) {
        console.log(`已清理 ${cleanedCount} 个过期任务`);
      }
    } catch (error) {
      console.error(`清理过期任务失败: ${error}`);
    }
  }
  
  // 后台处理任务
  private async processTaskInBackground(taskId: string): Promise<void> {
    const task = await this.getTask(taskId);
    if (!task) return;
    
    try {
      await this.updateTask(taskId, {
        status: 'processing',
        progress: 5,
        message: '开始处理任务...'
      });
      
      // 动态导入，避免模块循环依赖
      const appStoreApi = await import('../analyze-apple/route');
      
      // 确保getAppStoreData函数存在
      if (!appStoreApi.getAppStoreData) {
        throw new Error('getAppStoreData函数未找到，请确保它已被导出');
      }
      
      // 更新任务状态：获取应用信息
      await this.updateTask(taskId, {
        progress: 10,
        message: '正在获取应用信息...'
      });
      
      // 调用API处理，传递进度回调
      const result = await appStoreApi.getAppStoreData(
        task.params.appName,
        task.params.language,
        task.params.country,
        async (progress: number, message: string) => {
          // 进度范围从10%到95%
          const scaledProgress = 10 + (progress * 0.85);
          await this.updateTask(taskId, {
            progress: Math.round(scaledProgress),
            message
          });
        }
      );
      
      // 更新最终结果
      await this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        message: '分析完成',
        result
      });
      
      console.log(`任务 ${taskId} 处理完成`);
    } catch (error) {
      console.error(`任务 ${taskId} 处理失败:`, error);
      await this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        message: '处理失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
}

// 导出任务管理器单例
export const taskManagerKV = TaskManagerKV.getInstance(); 