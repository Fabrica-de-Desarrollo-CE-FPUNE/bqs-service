import dayjs from "dayjs";
import { TaskBase } from "./TaksBase";

export class TaskManager {
  private tasks: Map<string, TaskBase> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  public addTask(taskId: string, task: TaskBase): void {
    this.tasks.set(taskId, task);
  }

  public async startAllTasks(): Promise<void> {
    for (const [taskId, task] of this.tasks) {
      if (task.ejecutarInmediatamente) {
        try {
          await task.ejecutar();
        } catch (error) {
          console.error(`Error en la tarea ${taskId}:`, error);
        }
      }

      // Configurar el intervalo para la tarea
      this.scheduleTask(taskId, task);
    }
  }

  private scheduleTask(taskId: string, task: TaskBase): void {
    const intervaloMs = task.intervalo.diff(dayjs(), 'millisecond'); // Calculamos el intervalo en milisegundos

    if (intervaloMs > 0) {
      const intervalId = setInterval(async () => {
        try {
          await task.ejecutar();
          if (task.ejecutarUnaVez) {
            this.removeTask(taskId);
          }
        } catch (error) {
          console.error(`Error en la tarea ${taskId}:`, error);
        }
      }, intervaloMs);

      this.intervals.set(taskId, intervalId);
    }
  }

  public stopAllTasks(): void {
    this.intervals.forEach((intervalId, taskId) => {
      clearInterval(intervalId);
      this.intervals.delete(taskId);
    });
  }

  public removeTask(taskId: string): void {
    const intervalId = this.intervals.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(taskId);
    }
    this.tasks.delete(taskId);
  }

  public getTask(taskId: string): TaskBase | undefined {
    return this.tasks.get(taskId);
  }
}
