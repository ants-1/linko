import { useState } from "react";
import { useAddCommentMutation } from "../slices/commentApiSlice";
import { useSelector } from "react-redux";
import { Button, TextField, Box } from "@mui/material";

interface CommentFormProps {
  postId: string;
  refetchComments: () => void;
}

export default function CommentForm({ postId, refetchComments }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [addComment, { isLoading }] = useAddCommentMutation();

  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user?.userId || userInfo?.user?._id ;
  const token = userInfo?.token;

  if (!userId || !token) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addComment({
        postId,
        userId,
        content,
        token,
      }).unwrap();

      setContent(""); 
      refetchComments();
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        label="Write a comment..."
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading || !content.trim()}
        sx={{ mt: 1 }}
      >
        {isLoading ? "Posting..." : "Post Comment"}
      </Button>
    </Box>
  );
}
