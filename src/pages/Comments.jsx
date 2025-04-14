import { Alert, Box, Button, TextField } from "@mui/material";
import Item from "../components/Item";
import { useNavigate, useParams } from "react-router-dom";
import { api, queryClient, useApp } from "../ThemedApp";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { createComment, getToken } from "../libs/fetcher";

export default function Comments() {
  const { id } = useParams();
  const { setGlobalMsg, auth } = useApp();
  const contentRef = useRef();
  const navigate = useNavigate();

  const fetchFn = async () => {
    const res = await fetch(`${api}/content/posts/${id}`);
    return res.json();
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: "comments",
    queryFn: fetchFn,
  });

  const removePost = useMutation({
    mutationFn: async (id) => {
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
      });
      navigate("/");
      setGlobalMsg("A post deleted");
    },
  });

  const removeComment = useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      await fetch(`${api}/content/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onMutate: (id) => {
      queryClient.cancelQueries("comments");
      queryClient.setQueryData("comments", (old) => {
        old.comments = old.comments.filter((comment) => comment.id !== id);
        return { ...old };
      });
      setGlobalMsg("A comment deleted");
    },
  });

  const add = useMutation({
    mutationFn: async (content) => createComment(content, id),
    onSuccess: async (comment) => {
      await queryClient.cancelQueries("comments");
      await queryClient.setQueryData("comments", (old) => {
        old.comments = [...old.comments, comment];
        return { ...old };
      });
      setGlobalMsg("A comment added");
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <>
      {[data].length > 0 ? (
        <Box>
          {/* {[data]?.map((item, idx) => {
            return <Item key={idx} item={item} remove={removeComment.mutate} />;
          })} */}
          <Item primary item={data} remove={removePost.mutate} />
          <h5>Comments </h5>
          {data?.comments?.map((comment) => {
            return (
              <Item
                comment
                key={comment.id}
                item={comment}
                remove={removeComment.mutate}
              />
            );
          })}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const content = contentRef.current.value;
              add.mutate(content);
              e.currentTarget.reset();
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 3,
              }}
            >
              <TextField
                multiline
                placeholder="Your Comment"
                inputRef={contentRef}
                disabled={auth ? false : true}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={auth ? false : true}
              >
                Reply
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

{
  /* <form
  onSubmit={(e) => {
    e.preventDefault();
    const content = contentRef.current.value;
    add.mutate(content);
    e.currentTarget.reset();
  }}
>
  <Box sx={{ mb: 4, textAlign: "right" }}>
    <TextField
      inputRef={contentRef}
      type="text"
      placeholder="Content"
      fullWidth
      multiline
      sx={{ mb: 1 }}
    />
    <Button variant="contained" type="submit">
      Post
    </Button>
  </Box>
</form>; */
}
