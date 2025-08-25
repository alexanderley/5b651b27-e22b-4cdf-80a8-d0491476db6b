export type Comment = {
  uuid: string;
  text: string;
  author: string;
  createdAt: string;
  parentId?: string | null;
};

export type AddCommentProps = {
  text: string;
  parentId?: string | null;
  author: string;
};

type CommentBaseProps = {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  level: number;
  currentUser: string;
};

export type CommentElementProps = CommentBaseProps & {
  comment: Comment;
};

export type CommentListProps = CommentBaseProps & {
  parentId?: string;
};
