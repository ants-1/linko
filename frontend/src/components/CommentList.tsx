import CommentCard from "./CommentCard";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  userId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  postId: string;
  postAuthor: string;
}

interface CommentListProps {
  comments: Comment[];
  userId: string;
  token: string;
  refetch: () => void;
}

export default function CommentList({ comments, userId, token, refetch }: CommentListProps) {
  return (
    <>
      {comments?.map((comment) => (
        <CommentCard
          key={comment._id}
          username={comment.userId.username}
          avatarUrl={comment.userId.avatarUrl}
          comment={comment.content}
          createdAt={comment.createdAt}
          commentId={comment._id}
          postId={comment.postId}
          userId={comment.userId._id}
          token={token}
          showDelete={comment.userId._id === userId || comment.postAuthor === userId}
          onDeleted={refetch}
        />
      ))}
    </>
  );
}
