import { Button } from "@mui/material";
import { useApp, queryClient } from "../ThemedApp";
import { postFollow, deleteFollow } from "../libs/fetcher";
import { useMutation } from "@tanstack/react-query";

export default function FollowButton({ user }) {
  const { auth } = useApp();

  const follow = useMutation({
    mutationFn: (id) => {
      return postFollow(id);
    },

    onSuccess: async () => {
      await queryClient.refetchQueries("users");
      await queryClient.refetchQueries("user");
      await queryClient.refetchQueries("search");
    },
  });

  const unfollow = useMutation({
    mutationFn: (id) => {
      return deleteFollow(id);
    },

    onSuccess: async () => {
      await queryClient.refetchQueries("users");

      await queryClient.refetchQueries("user");
      await queryClient.refetchQueries("search");
    },
  });

  function isFollowing() {
    return user.following.find((item) => item.followerId == auth.id);
  }

  if (!auth) return <></>;
 

  return auth.id === user.id ? (
    <></>
  ) : (
    <Button
      size="small"
      edge="end"
      variant={isFollowing() ? "outlined" : "contained"}
      sx={{ borderRadius: 5 }}
      onClick={(e) => {
        if (isFollowing()) {
          unfollow.mutate(user.id);
        } else {
          follow.mutate(user.id);
        }
        e.stopPropagation();
      }}
    >
      {isFollowing() ? "Following" : "Follow"}
    </Button>
  );
}
