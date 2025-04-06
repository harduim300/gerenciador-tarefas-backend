import { TaskService } from "./TasksService";
import { prisma } from "../../../libs/prisma";

describe("TaskService", () => {
    let taskService: TaskService;

    beforeEach(async () => {

        taskService = new TaskService();
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
        await prisma.user.create({
            data: {
                id: "1",
                name: "Lucas Ribamar",
                email: "lucas.ribamar@example.com",
                password: "password1"
            }
        });
        await prisma.user.create({
            data: {
                id: "2",
                name: "Léo Pele",
                email: "leo.pele@example.com",
                password: "password2"
            }
        });
    });

    afterEach(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
        jest.restoreAllMocks();
    });

    const task = {
        title: "Test",
        description: "Test Description",
        category: "Test Category",
        status: "NOT_STARTED" as const,
        userId: "1"
    };

    const task2 = {
        title: "Test2",
        description: "Test Description2",
        category: "Test Category2",
        status: "NOT_STARTED" as const,
        userId: "2"
    };

    const task3 = {
        title: "Test3",
        category: "Test Category3",
        userId: "3"
    };

    // CREATE TASK TESTS

    it("should create a new task", async () => {
        
        const result = await taskService.createTask(task);
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.title).toBe(task.title);
        expect(result.description).toBe(task.description);
    });

    it("should throw 'Create_Task_Error' when database connection fails", async () => {
        // Simula falha no Prisma
        jest.spyOn(prisma.task, 'create').mockRejectedValue(new Error("DB connection failed"));
      
        // Act & Assert
        await expect(taskService.createTask(task)).rejects.toMatchObject({
            message: "Create_Task_Error",
        });
    });
    

    // GET ALL TASKS TESTS

    it("should get all tasks for a user", async () => {
        
        await taskService.createTask(task);
        await taskService.createTask(task);
        await taskService.createTask(task);

        const tasks = await taskService.getAllTasks("1");
        // Verifica se a lista de tarefas é definida
        expect(tasks).toBeDefined();
        // Verifica se a lista de tarefas tem 3 tarefas
        expect(tasks.length).toBe(3);
        
        // Verifica se os ids são únicos
        const ids = tasks.map(t => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(3);
        
    });

    it("should get all tasks for a user with no tasks", async () => {
        const tasks = await taskService.getAllTasks("2");
        expect(tasks).toBeDefined();
        expect(tasks.length).toBe(0);
    });

    it("shouldn't get tasks for a user that doesn't exist", async () => {
        const tasks = await taskService.getAllTasks("3");
        expect(tasks).toBeDefined();
        expect(tasks.length).toBe(0);
    });

    it("should throw 'Get_All_Tasks_Error' when database connection fails", async () => {
        jest.spyOn(prisma.task, 'findMany').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.getAllTasks("1")).rejects.toMatchObject({
            message: "Get_All_Tasks_Error",
        });
    });

    it("should get all tasks after sharing with another user", async () => {

        const sharedTask = await taskService.createTask(task);
        const data = {
            taskId: sharedTask.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        };
        await taskService.shareTask(data);
        await taskService.createTask(task2);
        await taskService.createTask(task2);
        const tasks = await taskService.getAllTasks("2");

        expect(tasks).toBeDefined();
        expect(tasks.length).toBe(3);
        const ids = tasks.map(t => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(3);
    });

    // GET TASK BY ID TESTS

    it("should get a task by id", async () => {
        const taskAux = await taskService.createTask(task);
        
        const taskById = await taskService.getTaskById(taskAux.id, "1");
        expect(taskById).toBeDefined();
        expect(taskById.id).toBe(taskAux.id);
        expect(taskById.title).toBe(taskAux.title);
        expect(taskById.description).toBe(taskAux.description);
    });
    
    it("should throw 'Not_Found' when task is not found", async () => {
        await expect(taskService.getTaskById("1", "1")).rejects.toMatchObject({
            message: "Not_Found",
        });
    });
    
    it("should throw 'Get_Task_Error' when database connection fails", async () => {
        jest.spyOn(prisma.task, 'findFirst').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.getTaskById("1", "1")).rejects.toMatchObject({
            message: "Get_Task_Error",
        });
    });

    // UPDATE TESTS

    it("should update a task", async () => {
        const taskAux = await taskService.createTask(task);
        const updatedTask = await taskService.updateTask("1", {
            id: taskAux.id,
            title: "Updated Task",
            description: "Updated Description",
        });
        expect(updatedTask).toBeDefined();
        expect(updatedTask.title).toBe("Updated Task");
        expect(updatedTask.description).toBe("Updated Description");
        expect(updatedTask.status).toBe("NOT_STARTED");
        expect(updatedTask.category).toBe("Test Category");
    });
    
    it("should throw 'Update_Task_Error' when database connection fails", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.task, 'update').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.updateTask("1", {
            id: taskAux.id,
            title: "Updated Task",
        })).rejects.toMatchObject({ 
            message: "Update_Task_Error",
        });
    });

    it("should deny access to update a task when user doesn't have permission", async () => {
        const taskAux = await taskService.createTask(task);
        await expect(taskService.updateTask("2", {
            id: taskAux.id,
            title: "Updated Task",
        })).rejects.toMatchObject({
            message: "Access_Denied",
        });
    });

    it("should throw 'Error_Checking_Task_Access_Prisma' when user doesn't have permission", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.taskUser, 'findFirst').mockRejectedValue(new Error("DB connection failed"));  
        await expect(taskService.updateTask("2", {
            id: taskAux.id,
            title: "Updated Task",
        })).rejects.toMatchObject({
            message: "Error_Checking_Task_Access_Prisma",
        });
    }); 

    // DELETE TESTS

    it("should delete a task", async () => {
        const taskAux = await taskService.createTask(task);
        await taskService.deleteTask(taskAux.id);
        const tasks = await taskService.getAllTasks("1");
        expect(tasks.length).toBe(0);
    });

    it("should throw 'Delete_Task_Error' when database connection fails", async () => {
        jest.spyOn(prisma.task, 'delete').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.deleteTask("1")).rejects.toMatchObject({
            message: "Error_Deleting_Task_Prisma",
        });
    });

    // SHARE TASK TESTS

    it("should share a task", async () => {
        const taskAux = await taskService.createTask(task);
    
        const data = {
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        };
    
        await taskService.shareTask(data);
    
        const tasks = await taskService.getTaskById(taskAux.id, "2");
    
        expect(tasks).toBeDefined();
        expect(tasks.taskUsers.length).toBe(2);
        const userEmails = tasks.taskUsers.map((tu: any) => tu.user.email);
        expect(userEmails).toContain("lucas.ribamar@example.com");
        expect(userEmails).toContain("leo.pele@example.com");
    });
    

    it("should throw 'Error_Sharing_Task_Prisma' when database connection fails", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.taskUser, 'create').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        })).rejects.toMatchObject({
            message: "Error_Sharing_Task_Prisma",
        });
    });
    

    // RE-SHARE TASK TESTS
    it("should throw 'Unauthorized' when user doesn't have permission", async () => {

        const taskAux = await taskService.createTask(task);

        const data = {
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        };
    
        await taskService.shareTask(data);

        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "2",
            targetEmail: "lucas.ribamar@example.com"
        })).rejects.toMatchObject({
            message: "Unauthorized",
        });
    });

    it("should throw  'Error_Checking_Task_Permission_Prisma' when database connection fails during share task", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.taskUser, 'findFirst').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        })).rejects.toMatchObject({
            message: "Error_Checking_Task_Permission_Prisma",
        });
    });

    it("should throw 'Error_Finding_User_Prisma' when database connection fails during share task", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        })).rejects.toMatchObject({
            message: "Error_Finding_User_Prisma",
        });
    });

    it("should throw 'Not_Found' when user doesn't exist", async () => {
        const taskAux = await taskService.createTask(task);
        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "maicon.roque@example.com"
        })).rejects.toMatchObject({
            message: "Not_Found",
        });
    });

    it("should throw 'Conflict' when task is already shared with user", async () => {
        const taskAux = await taskService.createTask(task);
        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "lucas.ribamar@example.com"
        })).rejects.toMatchObject({
            message: "Conflict",
        });
    });

    it("should throw 'Error_Finding_Task_Prisma' when database connection fails during re-share task", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.taskUser, 'findFirst')
        .mockResolvedValueOnce({
            id: "1",
            permission: "OWNER",
            taskId: taskAux.id,
            userId: "1"
        })
        .mockRejectedValueOnce(new Error("DB connection failed"));
        await expect(taskService.shareTask({
            taskId: taskAux.id,
            userId: "1",
            targetEmail: "leo.pele@example.com"
        })).rejects.toMatchObject({
            message: "Error_Finding_Task_User_Prisma",
        });
    });
    
    

    // EXTRA TESTS

    it("should check task access", async () => {
        const taskAux = await taskService.createTask(task);
        const access = await taskService.checkTaskAccess(taskAux.id, "1");
        expect(access).toBe(true);
    });

    it("shouldn't check task access when task is not shared", async () => {
        const taskAux = await taskService.createTask(task);
        const access = await taskService.checkTaskAccess(taskAux.id, "2");
        expect(access).toBe(false);
    });

    it("should throw 'Error_Checking_Task_Access_Prisma' when database connection fails", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.taskUser, 'findFirst').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.checkTaskAccess(taskAux.id, "1")).rejects.toMatchObject({
            message: "Error_Checking_Task_Access_Prisma",
        });
    });
    
    it("should check task permission", async () => {
        const taskAux = await taskService.createTask(task);
        const permission = await taskService.checkTaskPermission(taskAux.id, "1");
        expect(permission).toBe(true);
    });

    it("shouldn't check task permission when task is not shared", async () => {
        const taskAux = await taskService.createTask(task);
        const permission = await taskService.checkTaskPermission(taskAux.id, "2");
        expect(permission).toBe(false);
    });

    it("should throw 'Error_Checking_Task_Permission_Prisma' when database connection fails", async () => {
        const taskAux = await taskService.createTask(task);
        jest.spyOn(prisma.taskUser, 'findFirst').mockRejectedValue(new Error("DB connection failed"));
        await expect(taskService.checkTaskPermission(taskAux.id, "1")).rejects.toMatchObject({
            message: "Error_Checking_Task_Permission_Prisma",
        });
    });
    
    
    
}); 
