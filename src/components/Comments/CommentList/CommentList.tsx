import type { FC } from "react";
import CommentElement from "../CommentElement/CommentElement";
import type { Comment, CommentListProps } from "../../../types/comments";

const CommentList: FC<CommentListProps> = ({
  comments,
  setComments,
  parentId = null,
  level = 0,
}) => {
  const filteredComments = comments
    .filter((c: Comment) => c.parentId === parentId)
    .sort(
      (a: Comment, b: Comment) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  if (filteredComments.length === 0) return null;

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {filteredComments.map((comment: Comment) => (
        <CommentElement
          key={comment.uuid}
          comment={comment}
          comments={comments}
          setComments={setComments}
          level={level}
          currentUser={"John Doe"}
        />
      ))}
    </ul>
  );
};

export default CommentList;
