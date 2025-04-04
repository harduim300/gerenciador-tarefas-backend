import { TaskController } from "./TasksController";

describe("TasksController Tests", () => {
    let tasksController: TaskController;

    beforeEach(() => {
        tasksController = new TaskController();
    });

    it("should create a new task", () => {
        const task = {
            title: "Test Task",
            description: "Test Description"
        };
    });
}); 
