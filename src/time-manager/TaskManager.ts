import dayjs from "dayjs";
import { TaskBase } from "./TaksBase";
import logger from "../log/logger";

export class TaskManager {

  private static instance: TaskManager;
  private tasks: Map<string, NodeJS.Timeout> = new Map();

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  public addTask(taskId: string, task: TaskBase): void {
    if (this.tasks.has(taskId)) {
      logger.warn(`La tarea ${taskId} ya existe. No se agregará nuevamente.`);
      return;
    }

    logger.info(`La tarea ${taskId} fue agregada exitosamente.`)

    if (task.ejecutarInmediatamente) {
      this.executeTask(taskId, task);
    }

    this.scheduleTask(taskId, task);
  }

  public removeTask(taskId: string): void {
    const interval = this.tasks.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.tasks.delete(taskId);
      logger.info(`La tarea ${taskId} fue eliminada.`);
    }
  }

  public stopAllTasks(): void {
    this.tasks.forEach((interval, taskId) => {
      clearInterval(interval);
      logger.info(`La tarea ${taskId} fue detenida.`);
    });
    this.tasks.clear();
  }

  private scheduleTask(taskId: string, task: TaskBase): void {

    const intervaloMs = task.intervalo.diff(dayjs(), "millisecond");

    if (intervaloMs > 0) {
      const interval = setInterval(async () => {
        this.executeTask(taskId, task).then(()=>{
          if (task.ejecutarUnaVez) {
            this.removeTask(taskId);
          }
        });

        
      }, intervaloMs);

      this.tasks.set(taskId, interval);
    }
  }

  private async executeTask(taskId: string, task: TaskBase): Promise<void> {
    try {
      logger.debug(`La tarea ${taskId} se está ejecutando.`);
      task.ejecutar().then(()=>{
        logger.info(`La tarea ${taskId} se ejecutó correctamente.`)
      });
      
    } catch (error) {
      logger.error(`Error al ejecutar la tarea ${taskId}: ${error}`);
    }
  }
}
