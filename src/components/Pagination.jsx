// components/PaginationBar.jsx
import { Box, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export default function PaginationBar({ count, take = 5 }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  return (
    <>
      {count > 0 && count > take && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <Pagination
            count={Math.ceil(count / take)}
            page={page}
            onChange={(_, value) => {
              setSearchParams({ page: value.toString() });
            }}
            variant="outlined"
            color="primary"
          />
        </Box>
      )}
    </>
  );
}
