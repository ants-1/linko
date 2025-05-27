import {
  Typography,
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Divider,
  Box,
} from "@mui/joy";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import timeAgo from "../utils/dateFormatter";
import PostMenu from "./PostMenuButton";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";


export default function PostCard({ post }: { post: any }) {
  const { userInfo } = useSelector((state: any) =>
    state.auth);
  const userId = userInfo?.user.userId;
  const {
    title,
    content,
    imgUrl,
    country,
    visitDate,
    author,
    viewCount,
    createdAt,
  } = post;

  const isAuthor = userId === author?._id;

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: 600 }}>
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={imgUrl || "https://placehold.co/600x400/png"}
            alt={title}
            loading="lazy"
          />
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography level="title-md">{title}</Typography>
          {isAuthor && <PostMenu postId={post._id} />}
        </Box>
        <Typography level="body-sm">{country}</Typography>
        <Typography level="body-sm">
          {new Date(visitDate).toLocaleDateString()}
        </Typography>
        <Typography level="body-sm">{content}</Typography>

        <Box sx={{ display: "flex", alignItems: "end", gap: 1, my: 1 }}>
          <Avatar
            alt={author?.username}
            src={author?.avatarUrl || undefined}
            sx={{ backgroundColor: "light-grey", color: "black" }}
          >
            {author?.username?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Typography level="body-sm" sx={{ mb: 1 }}>
            {author?.username ?? "Unknown"}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" width="100%" gap={1}>
          <Box display="flex" gap={1}>
            <ThumbUp sx={{ cursor: "pointer" }} />
            <ThumbDown sx={{ cursor: "pointer" }} />
          </Box>
          <ChatBubbleOutline sx={{ cursor: "pointer" }} />
        </Box>
      </CardContent>

      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: "md" }}
          >
            {viewCount ?? 0} views
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: "md" }}
          >
            {timeAgo(createdAt)}
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
}
