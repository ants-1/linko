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
import {
  useFetchLikeCountQuery,
  useToggleLikeMutation,
} from "../slices/likeApiSlice";
import {
  useFetchDislikeCountQuery,
  useToggleDislikeMutation,
} from "../slices/dislikeApiSlice";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }: { post: any }) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId;
  const postId = post._id;
  const navigate = useNavigate();

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

  const {
    data: likeData,
    isLoading: likeLoading,
    refetch: refetchLikes,
  } = useFetchLikeCountQuery(postId);
  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();

  const {
    data: dislikeData,
    isLoading: dislikeLoading,
    refetch: refetchDislikes,
  } = useFetchDislikeCountQuery(postId);
  const [toggleDislike, { isLoading: disliking }] = useToggleDislikeMutation();

  const handleLike = async () => {
    try {
      await toggleLike({ userId, postId }).unwrap();
      refetchLikes();
      refetchDislikes();
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  const handleDislike = async () => {
    try {
      await toggleDislike({ userId, postId }).unwrap();
      refetchDislikes();
      refetchLikes();
    } catch (err) {
      console.error("Error toggling dislike", err);
    }
  };

  return (
    <Card variant="outlined" sx={{ width: "100%", maxWidth: 600 }}>
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={imgUrl || "https://placehold.co/600x400/png"}
            alt={title}
            loading="lazy"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/posts/${postId}`)}
          />
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography level="title-md">{title}</Typography>
          {isAuthor && <PostMenu postId={postId} />}
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

        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <ThumbUp
                sx={{ cursor: "pointer", color: liking ? "grey" : "primary.main" }}
                onClick={handleLike}
              />
              <Typography level="body-xs">
                {likeLoading ? "..." : likeData?.likeCount ?? 0}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={0.5}>
              <ThumbDown
                sx={{ cursor: "pointer", color: disliking ? "grey" : "error.main" }}
                onClick={handleDislike}
              />
              <Typography level="body-xs">
                {dislikeLoading ? "..." : dislikeData?.dislikeCount ?? 0}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={0.5}>
            <ChatBubbleOutline sx={{ cursor: "pointer", color: "text.secondary" }} />

            <Typography level="body-sm">
              {post.comments.length ?? 0}
            </Typography>
          </Box>
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
