// import { openDB } from "idb";
// import { v4 as uuidv4 } from "uuid";
// import type { AddCommentProps } from "../types/comments.js";

// const dbPromise = openDB("my-db", 3, {
//   upgrade(db) {
//     if (!db.objectStoreNames.contains("comments")) {
//       const commentsStore = db.createObjectStore("comments", {
//         keyPath: "uuid",
//       });
//       commentsStore.createIndex("parentId", "parentId", { unique: false });
//     }
//   },
// });

// export async function addComment({
//   text,
//   parentId = null,
//   author,
// }: AddCommentProps) {
//   const db = await dbPromise;
//   const newComment = {
//     uuid: uuidv4(),
//     text,
//     parentId,
//     author,
//     createdAt: new Date().toISOString(),
//   };
//   await db.add("comments", newComment);
//   return newComment;
// }

// export async function getComments() {
//   const db = await dbPromise;
//   return db.getAll("comments");
// }

// export async function getReplies(parentId: number) {
//   const db = await dbPromise;
//   return db.getAllFromIndex("comments", "parentId", parentId);
// }

// export async function deleteComment(uuid: string) {
//   const db = await dbPromise;
//   await db.delete("comments", uuid);
// }

// export async function clearComments() {
//   const db = await dbPromise;
//   const allComments = await db.getAll("comments");
//   const deletePromises = allComments.map((comment) =>
//     db.delete("comments", comment.uuid)
//   );
//   await Promise.all(deletePromises);
// }
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
  try {
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
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function getComments() {
  try {
    const db = await dbPromise;
    return await db.getAll("comments");
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
}

export async function getReplies(parentId: string) {
  try {
    const db = await dbPromise;
    return await db.getAllFromIndex("comments", "parentId", parentId);
  } catch (error) {
    console.error(`Error getting replies for parentId ${parentId}:`, error);
    return [];
  }
}

export async function deleteComment(uuid: string) {
  try {
    const db = await dbPromise;
    await db.delete("comments", uuid);
  } catch (error) {
    console.error(`Error deleting comment ${uuid}:`, error);
    throw error;
  }
}

export async function clearComments() {
  try {
    const db = await dbPromise;
    const allComments = await db.getAll("comments");
    const deletePromises = allComments.map((comment) =>
      db.delete("comments", comment.uuid)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing comments:", error);
    throw error;
  }
}
