import { TaskManager } from "./TaskManager";
import { ClaveTokenTask } from "./tasks/ClaveTokenTask";

const init = ()=>{
    const taskManager = TaskManager.getInstance();
    //Tarea obligatoria
    taskManager.addTask('genTokenPass', new ClaveTokenTask());
}

init();