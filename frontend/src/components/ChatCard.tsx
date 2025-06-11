import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';

interface ChatCardProps {
  id: string;
  name: string;
  imgUrl?: string;
  messageCount: number;
  userCount: number;
  countries: string[];
  createdAt: string;
  authorId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isMember: boolean;
  onJoin: (chatId: string) => void;
  onLeave: (chatId: string) => void;
}

export default function ChatCard({
  id,
  name,
  imgUrl,
  messageCount,
  userCount,
  countries,
  createdAt,
  authorId,
  onEdit,
  onDelete,
  isMember,
  onJoin,
  onLeave,
}: ChatCardProps) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const currentUserId = userInfo?.user.userId || userInfo?.user?._id;
  const isAuthor = currentUserId === authorId;
  const navigate = useNavigate();

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    onEdit(id);
  };
  const handleDeleteClick = () => {
    handleMenuClose();
    onDelete(id);
  };

  const handleVisitChat = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 800, width: "100%", mb: 2 }}>
      <CardHeader
        avatar={
          imgUrl ? (
            <Avatar src={imgUrl} />
          ) : (
            <Avatar>{name?.charAt(0).toUpperCase()}</Avatar>
          )
        }
        action={
          isAuthor && (
            <>
              <IconButton
                aria-label="more"
                aria-controls={open ? "chat-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="chat-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={name}
        subheader={new Date(createdAt).toLocaleString()}
      />
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon /> {userCount}
          <ForumIcon /> {messageCount}
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {countries.map((country, index) => (
            <Chip
              key={country}
              label={country}
              variant="outlined"
              color={index === 1 ? "secondary" : "primary"}
              size="small"
            />
          ))}
        </Box>


        <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={() => handleVisitChat(id)}>
          Visit Chat
        </Button>
        {!isMember ? (
          <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => onJoin(id)}>
            Join Chat
          </Button>
        ) : (
          <Button variant="outlined" disabled={isAuthor} color="secondary" sx={{ mt: 2 }} onClick={() => onLeave(id)}>
            Leave Chat
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
