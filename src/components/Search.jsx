import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import FollowButton from "../components/FollowButton";
import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SearchUser, take } from "../libs/fetcher";
import PaginationBar from "./Pagination";

export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * take;

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["search", debouncedQuery, page],
    queryFn: () => {
      return SearchUser(debouncedQuery, skip);
    },
  });
  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }
  return (
    <Box>
      <TextField
        fullWidth={true}
        variant="outlined"
        placeholder="Search user"
        onKeyUp={(e) => {
          setQuery(e.target.value);
          setSearchParams({ page: 1 });
        }}
      />
      {isLoading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>Loading...</Box>
      ) : (
        <List>
          {data?.data?.map((user) => {
            return (
              <ListItem key={user.id}>
                <ListItemButton onClick={() => navigate(`/profile/${user.id}`)}>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.bio} />
                  <ListItemSecondaryAction>
                    <FollowButton user={user} />
                  </ListItemSecondaryAction>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}

      <PaginationBar count={data?.count} take={take} />
    </Box>
  );
}
