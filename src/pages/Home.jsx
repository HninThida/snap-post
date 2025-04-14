import { useQuery, useMutation } from "@tanstack/react-query";
import { Alert, Box, Button, Pagination, Typography } from "@mui/material";
import Form from "../components/Form";
import Item from "../components/Item";
import { api, queryClient, useApp } from "../ThemedApp";
import {
  createPost,
  fetchFollowingPosts,
  getToken,
  take,
} from "../libs/fetcher";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationBar from "../components/Pagination";

export default function Home() {
  const { showForm, setGlobalMsg } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLatest, setShowLatest] = useState(true);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * take;
  const { auth } = useApp();
  const fetchFn = async () => {
    const res = await fetch(`${api}/content/posts/${skip}/${take}`);
    return res.json();
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["posts", showLatest, page],
    queryFn: () => {
      if (showLatest) {
        return fetchFn();
      } else {
        return fetchFollowingPosts(skip);
      }
    },
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onMutate: (id) => {
      queryClient.cancelQueries("posts");
      queryClient.setQueryData(["posts", showLatest], (old) =>
        old.filter((item) => item.id != id)
      );
      setGlobalMsg("A post deleted");
    },
  });

  const add = useMutation({
    mutationFn: async (content) => createPost(content),
    onSuccess: async (post) => {
      await queryClient.cancelQueries("posts");
      await queryClient.setQueryData(["posts", showLatest], (old) => [
        post,
        ...old,
      ]);
      setGlobalMsg("A post added");
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.messsage}</Alert>
      </Box>
    );
  }
  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading ...
      </Box>
    );
  }

  return (
    <Box>
      {showForm && auth && <Form add={add} />}
      {auth && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Button
            disabled={showLatest}
            onClick={() => {
              setSearchParams({ page: 1 });

              setShowLatest(true);
            }}
          >
            {" "}
            Latest
          </Button>
          <Typography sx={{ color: "text.fade", fontSize: 15 }}>|</Typography>
          <Button
            disabled={!showLatest}
            onClick={() => {
              setSearchParams({ page: 1 });

              setShowLatest(false);
            }}
          >
            {" "}
            Following
          </Button>
        </Box>
      )}
      {data?.data?.map((item) => {
        return <Item key={item.id} item={item} remove={remove.mutate} />;
      })}
      <PaginationBar count={data?.count} take={take} />
    </Box>
  );
}
