-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "TaskUser" ALTER COLUMN "permission" SET DEFAULT 'USER';
