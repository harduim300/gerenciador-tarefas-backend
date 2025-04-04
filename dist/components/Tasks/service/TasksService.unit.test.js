"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TasksService_1 = require("./TasksService");
describe("TaskService", () => {
    let taskService;
    beforeEach(() => {
        taskService = new TasksService_1.TaskService();
    });
    it("should create a new task", () => {
        const task = {
            title: "Test Task",
            description: "Test Description"
        };
    });
});
