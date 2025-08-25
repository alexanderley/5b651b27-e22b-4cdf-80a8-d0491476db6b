import React, { useState } from "react";
import type { FC } from "react";
import { addComment, deleteComment } from "../../db/db";
import CommentList from "./CommentList";
import styles from "./CommentElement.module.scss";

import type { CommentElementProps } from "../../types/comments";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CommentElement: FC<CommentElementProps> = ({
  comment,
  comments,
  setComments,
  level,
  currentUser,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (replyText.trim()) {
      const newReply = await addComment({
        text: replyText,
        parentId: comment.uuid,
        author: currentUser,
      });

      setComments((prev) => [...prev, newReply]);
      setReplyText("");
      setReplyingTo(null);
    } else {
      setReplyingTo(comment.uuid);
    }
  };

  const handleDelete = async () => {
    await deleteComment(comment.uuid);
    setComments((prev) => prev.filter((c) => c.uuid !== comment.uuid));
  };

  const handleClose = () => {
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <li
      key={comment.uuid}
      className={`${styles.commentItem} ${
        level > 0 ? styles.nested : styles.rootComment
      }`}
      style={{ marginLeft: `${level * 40}px` }}
    >
      <div className={styles.commentTopWrapper}>
        <div className={styles.profilePic}></div>
        <div className={styles.commentTextWrapper}>
          <div className={styles.authorAndTextWrapper}>
            <div className={styles.author}>{comment.author}</div>
            <div className={styles.date}>
              {new Date(comment.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className={styles.commentText}>{comment.text}</div>
        </div>
      </div>

      {replyingTo === comment.uuid ? (
        <div className={styles.replyInputContainer}>
          <form onSubmit={handleReplySubmit}>
            <input
              type="text"
              placeholder="Reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={handleClose}>
              Close
            </button>
          </form>
        </div>
      ) : (
        <div
          className={`${styles.actionsWrapper} ${
            level > 0 ? styles.childActions : ""
          }`}
        >
          <button
            className={styles.replyButton}
            onClick={() => setReplyingTo(comment.uuid)}
          >
            Reply
          </button>
          <button className="deleteButtonSolid" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}

      <CommentList
        comments={comments}
        setComments={setComments}
        parentId={comment.uuid}
        level={level + 1}
        currentUser={currentUser}
      />
    </li>
  );
};

export default CommentElement;
