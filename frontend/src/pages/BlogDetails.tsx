import {
  Typography,
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Divider,
  Box,
} from "@mui/joy";
import { Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";

import timeAgo from "../utils/dateFormatter";
import { useSelector } from "react-redux";
import { useFetchPostQuery } from "../slices/postApiSlice";
import {
  useFetchLikeCountQuery,
  useToggleLikeMutation,
} from "../slices/likeApiSlice";
import {
  useFetchDislikeCountQuery,
  useToggleDislikeMutation,
} from "../slices/dislikeApiSlice";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

export default function BlogDetail() {
  const { id = "" } = useParams();
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user?.userId;

  const { data: post, isLoading, error, refetch: refetchPost, } = useFetchPostQuery({ id });

  const {
    data: likeData,
    isLoading: likeLoading,
    refetch: refetchLikes,
  } = useFetchLikeCountQuery(id);
  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();

  const {
    data: dislikeData,
    isLoading: dislikeLoading,
    refetch: refetchDislikes,
  } = useFetchDislikeCountQuery(id);
  const [toggleDislike, { isLoading: disliking }] = useToggleDislikeMutation();

  const handleLike = async () => {
    try {
      await toggleLike({ userId, postId: id }).unwrap();
      refetchLikes();
      refetchDislikes();
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  const handleDislike = async () => {
    try {
      await toggleDislike({ userId, postId: id }).unwrap();
      refetchDislikes();
      refetchLikes();
    } catch (err) {
      console.error("Error toggling dislike", err);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !post) return <Typography>Error loading post.</Typography>;

  const {
    title,
    content,
    imgUrl,
    country,
    visitDate,
    author,
    createdAt,
    viewCount,
    comments,
  } = post;

  return (
    <Box sx={{ p: 3 }}>
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 800, margin: "auto", mt: 4 }}>
        <CardOverflow>
          <AspectRatio ratio="2">
            <img
              src={imgUrl || "https://placehold.co/800x400"}
              alt={title}
              loading="lazy"
            />
          </AspectRatio>
        </CardOverflow>

        <CardContent>
          <Typography level="h3" fontWeight="xl" mb={1}>{title}</Typography>

          <Typography level="body-sm" textColor="text.tertiary">
            Visited: {new Date(visitDate).toLocaleDateString()} | {country}
          </Typography>

          <Typography level="body-md" mt={2} mb={2}>{content}</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
            <Avatar
              alt={author?.username}
              src={author?.avatarUrl || undefined}
              sx={{ backgroundColor: "light-grey", color: "black" }}
            >
              {author?.username?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Typography level="body-sm">{author?.username ?? "Unknown"}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" width="100%" gap={2}>
            <Box display="flex" gap={3}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <ThumbUp
                  sx={{ cursor: "pointer", color: liking ? "grey" : "primary.main" }}
                  onClick={handleLike}
                />
                <Typography level="body-sm">
                  {likeLoading ? "..." : likeData?.likeCount ?? 0}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <ThumbDown
                  sx={{ cursor: "pointer", color: disliking ? "grey" : "error.main" }}
                  onClick={handleDislike}
                />
                <Typography level="body-sm">
                  {dislikeLoading ? "..." : dislikeData?.dislikeCount ?? 0}
                </Typography>
              </Box>
            </Box>


            <Box display="flex" gap={0.5}>
              <ChatBubbleOutline sx={{ cursor: "pointer", color: "text.secondary" }} />

              <Typography level="body-sm">
                {comments.length ?? 0}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
          <Divider inset="context" />
          <CardContent orientation="horizontal">
            <Typography level="body-xs" textColor="text.secondary" sx={{ fontWeight: "md" }}>
              {viewCount ?? 0} views
            </Typography>
            <Divider orientation="vertical" />
            <Typography level="body-xs" textColor="text.secondary" sx={{ fontWeight: "md" }}>
              {timeAgo(createdAt)}
            </Typography>
          </CardContent>
        </CardOverflow>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <CommentForm postId={post._id} refetchComments={refetchPost} />
      </Box>

      {/* Comment Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <Typography level="h3" mb={2}>Comments</Typography>
        {comments?.length > 0 ? (
          <CommentList
            comments={comments}
            userId={userId}
            token={userInfo?.token}
            refetch={refetchPost}
          />

        ) : (
          <Typography>No comments yet.</Typography>
        )}
      </Box>
    </Box>
  );
}
