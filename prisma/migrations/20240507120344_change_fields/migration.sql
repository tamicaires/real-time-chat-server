/*
  Warnings:

  - You are about to drop the column `from-me` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `UserChatGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat-group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserChatGroup" DROP CONSTRAINT "UserChatGroup_chatGroupId_fkey";

-- DropForeignKey
ALTER TABLE "UserChatGroup" DROP CONSTRAINT "UserChatGroup_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatGroupId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "from-me",
ALTER COLUMN "created-at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT;

-- DropTable
DROP TABLE "UserChatGroup";

-- DropTable
DROP TABLE "chat-group";

-- CreateTable
CREATE TABLE "chat-groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat-groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user-chat-groups" (
    "id" TEXT NOT NULL,
    "user-id" TEXT NOT NULL,
    "chat-group-id" TEXT NOT NULL,

    CONSTRAINT "user-chat-groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user-chat-groups" ADD CONSTRAINT "user-chat-groups_user-id_fkey" FOREIGN KEY ("user-id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-chat-groups" ADD CONSTRAINT "user-chat-groups_chat-group-id_fkey" FOREIGN KEY ("chat-group-id") REFERENCES "chat-groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "chat-groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
