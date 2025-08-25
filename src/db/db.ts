import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";
import type { AddCommentProps } from "../types/comments.js";

const dbPromise = openDB("my-db", 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("comments")) {
      const commentsStore = db.createObjectStore("comments", {
        keyPath: "uuid",
      });
      commentsStore.createIndex("parentId", "parentId", { unique: false });
    }
  },
});

export async function addComment({
  text,
  parentId = null,
  author,
}: AddCommentProps) {
  const db = await dbPromise;
  const newComment = {
    uuid: uuidv4(),
    text,
    parentId,
    author,
    createdAt: new Date().toISOString(),
  };
  await db.add("comments", newComment);
  return newComment;
}

export async function getComments() {
  const db = await dbPromise;
  return db.getAll("comments");
}

export async function getReplies(parentId: number) {
  const db = await dbPromise;
  return db.getAllFromIndex("comments", "parentId", parentId);
}

export async function deleteComment(uuid: string) {
  const db = await dbPromise;
  await db.delete("comments", uuid);
}

export async function clearComments() {
  const db = await dbPromise;
  const allComments = await db.getAll("comments");
  const deletePromises = allComments.map((comment) =>
    db.delete("comments", comment.uuid)
  );
  await Promise.all(deletePromises);
}
