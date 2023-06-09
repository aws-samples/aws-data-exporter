import { Skeleton } from "@mui/material";
import React from "react";

type Props = {
  count?: number;
};
const LoadingList: React.FC<Props> = ({ count }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          sx={{ m: 1, height: "3rem" }}
        />
      ))}
    </>
  );
};

export default LoadingList;
