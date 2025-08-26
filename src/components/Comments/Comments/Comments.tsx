import { useEffect, useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";
import { addComment, getComments, clearComments } from "../../../db/db";
import CommentList from "../CommentList/CommentList";

import styles from "./Comments.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Comment, AddCommentProps } from "../../../types/comments";

const Comments: FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState<string>("");
  const currentUser = "John Doe";

  useEffect(() => {
    const fetchComments = async () => {
      const topComments: Comment[] = await getComments();
      topComments.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setComments(topComments);
    };
    fetchComments();
  }, []);

  const clearCommentsHandler = () => {
    clearComments();
    setComments([]);
  };

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.trim()) return;

    const newComment: Comment = await addComment({
      text: form,
      parentId: null,
      author: currentUser,
    } as AddCommentProps);

    setComments((prev: Comment[]) => [...prev, newComment]);
    setForm("");
  };

  const formChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
  };

  return (
    <div className={styles.commentContainer}>
      <button className={styles.deleteAll} onClick={clearCommentsHandler}>
        <FontAwesomeIcon icon={faTrash} /> Delete all comments
      </button>
      <form onSubmit={formSubmitHandler} className={styles.commentForm}>
        <input
          type="text"
          id="comment-input"
          placeholder="Type a comment..."
          value={form}
          onChange={formChangeHandler}
        />
        <button type="submit">Submit</button>
      </form>

      <CommentList
        comments={comments}
        setComments={setComments}
        currentUser={currentUser}
        level={0}
      />
    </div>
  );
};

export default Comments;
