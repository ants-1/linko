import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useDeleteCommentMutation } from "../slices/commentApiSlice";

interface CommentCardProps {
  username: string;
  avatarUrl?: string;
  comment: string;
  createdAt: string;
  commentId: string;
  postId: string;
  token: string;
  userId: string;
  showDelete: boolean;
  onDeleted?: () => void;
}

export default function CommentCard({
  username,
  avatarUrl,
  comment,
  createdAt,
  commentId,
  postId,
  token,
  userId,
  showDelete,
  onDeleted,
}: CommentCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteComment] = useDeleteCommentMutation();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await deleteComment({ postId, commentId, token, userId }).unwrap();
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      handleClose();
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 800, width: "100%", mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={avatarUrl}>
            {username?.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          showDelete && (
            <>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={username}
        subheader={new Date(createdAt).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {comment}
        </Typography>
      </CardContent>
    </Card>
  );
}
