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

export default function PostCard({ post }: { post: any }) {
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

  return (
    <Card variant="outlined">
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={imgUrl || "https://via.placeholder.com/318x180?text=No+Image"}
            alt={title}
            loading="lazy"
          />
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Typography level="title-md">{title}</Typography>
        <Typography level="body-sm">{country}</Typography>
        <Typography level="body-sm">
          {new Date(visitDate).toLocaleDateString()}
        </Typography>
        <Typography level="body-sm">{content}</Typography>
        <Typography level="body-sm" sx={{ mb: 1 }}>
          Author: {author?.username ?? "Unknown"}
        </Typography>

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
