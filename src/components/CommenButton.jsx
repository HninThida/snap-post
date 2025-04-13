import { IconButton, ButtonGroup, Button } from "@mui/material";
import { ChatBubbleOutline as CommentIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
export default function Item({ item, comment }) {
  const navigate = useNavigate();
  return (
    <>
      {!comment && (
        <ButtonGroup sx={{ ml: 3 }}>
          <IconButton size="small">
            <CommentIcon fontSize="small" color="info" />
          </IconButton>
          <Button
            sx={{ color: "text.fade" }}
            variant="text"
            size="small"
            onClick={() => {
              navigate(`/comments/${item.id}`);
            }}
          >
            {item?.comments?.length}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
