/*
  Warnings:

  - You are about to drop the column `chat-group-id` on the `user-chat-groups` table. All the data in the column will be lost.
  - You are about to drop the column `user-id` on the `user-chat-groups` table. All the data in the column will be lost.
  - Added the required column `chatGroupId` to the `user-chat-groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user-chat-groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user-chat-groups" DROP CONSTRAINT "user-chat-groups_chat-group-id_fkey";

-- DropForeignKey
ALTER TABLE "user-chat-groups" DROP CONSTRAINT "user-chat-groups_user-id_fkey";

-- AlterTable
ALTER TABLE "user-chat-groups" DROP COLUMN "chat-group-id",
DROP COLUMN "user-id",
ADD COLUMN     "chatGroupId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "user-chat-groups" ADD CONSTRAINT "user-chat-groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-chat-groups" ADD CONSTRAINT "user-chat-groups_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "chat-groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
