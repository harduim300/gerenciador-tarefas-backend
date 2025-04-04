import { TaskService } from "./TasksService";

describe("TaskService", () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    it("should create a new task", () => {
        const task = {
            title: "Test Task",
            description: "Test Description"
        };
    });
}); 
