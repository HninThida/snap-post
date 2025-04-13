import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import {
  Alarm as TimeIcon,
  AccountCircle as UserIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { formatRelative } from "date-fns";
import LikeButton from "./LikeButton";
import CommentButton from "./CommenButton";
import { useApp } from "../ThemedApp";

export default function Item({ item, remove, primary, comment }) {
  const navigate = useNavigate();
  const { auth } = useApp();
  return (
    <Card sx={{ mb: 2 }}>
      {primary && <Box sx={{ height: 50, bgcolor: green[500] }} />}
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TimeIcon fontSize="10" color="success" />
            <Typography variant="caption" sx={{ color: green[500] }}>
              {item?.created && formatRelative(item?.created, new Date())}
            </Typography>
          </Box>
          {item?.user?.id === auth?.id && (
            <IconButton
              size="small"
              onClick={(e) => {
                remove(item?.id);
                e.stopPropagation();
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>

        <Box onClick={() => navigate(`/comments/${item?.id}`)}>
          <Typography sx={{ my: 3 }}>{item?.content}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {item?.user?.name && (
            <Box
              onClick={(e) => {
                navigate(`/profile/${item.user.id}`);
                e.stopPropagation();
              }}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <UserIcon fontSize="12" color="info" />
              <Typography variant="caption">{item?.user?.name}</Typography>
            </Box>
          )}
          <Box>
            <LikeButton item={item} comment={comment} />
            <CommentButton item={item} comment={comment} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
