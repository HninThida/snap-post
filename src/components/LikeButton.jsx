import { IconButton, ButtonGroup, Button } from "@mui/material";
import {
  Favorite as LikedIcon,
  FavoriteBorder as LikeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useApp, queryClient } from "../ThemedApp";
import {
  postPostLike,
  deletePostLike,
  postCommentLike,
  deleteCommentLike,
} from "../libs/fetcher";
import { useMutation } from "@tanstack/react-query";

export default function LikeButton({ item, comment }) {
  const navigate = useNavigate();
  const { auth } = useApp();

  function isLiked() {
    if (!auth) return false;
    if (comment) {
      if (!item.commentLike) return false;
      return item.commentLike.find((like) => like.userId == auth.id);
    } else {
      if (!item?.postLike) return false;
      return item?.postLike.find((like) => like.userId == auth.id);
    }
  }

  const likePost = useMutation({
    mutationFn: (id) => postPostLike(id),
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });
  const likeComment = useMutation({
    mutationFn: (id) => postCommentLike(id),
    onSuccess: () => {
      queryClient.refetchQueries(["comments"]);
    },
  });

  const unlikePost = useMutation({
    mutationFn: (id) => deletePostLike(id),
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });
  const unlikeComment = useMutation({
    mutationFn: (id) => deleteCommentLike(id),
    onSuccess: () => {
      queryClient.refetchQueries("comments");
    },
  });
  return (
    <ButtonGroup>
      {isLiked() ? (
        <IconButton
          size="small"
          onClick={(e) => {
            comment
              ? unlikeComment.mutate(item.id)
              : unlikePost.mutate(item.id);

            e.stopPropagation();
          }}
        >
          <LikedIcon fontSize="small" color="error" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          onClick={(e) => {
            comment ? likeComment.mutate(item.id) : likePost.mutate(item.id);
            e.stopPropagation();
          }}
        >
          <LikeIcon fontSize="small" color="error" />
        </IconButton>
      )}
      <Button
        disabled={
          comment ? item?.commentLike.length === 0 : item.postLike.length === 0
        }
        onClick={(e) => {
          if (comment) {
            navigate(`/likes/${item.id}/comment`);
          } else {
            navigate(`/likes/${item.id}/post`);
          }
          e.stopPropagation();
        }}
        sx={{ color: "text.fade" }}
        variant="text"
        size="small"
      >
        {comment ? (
          <>{item?.commentLike ? item?.commentLike.length : "0"}</>
        ) : (
          <>{item?.postLike ? item?.postLike.length : "0"}</>
        )}
      </Button>
    </ButtonGroup>
  );
}
