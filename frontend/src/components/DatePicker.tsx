import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DatePicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <DesktopDatePicker
      value={value === "" ? undefined : dayjs(value)}
      sx={{
        width: "12.5rem",
        "& .MuiInputBase-root": {
          "& .MuiInputBase-input": {
            padding: 1.1,
            paddingLeft: 2,
          },
        },
      }}
      onChange={(newValue) => {
        onChange(newValue?.format() ?? "");
      }}
    />
  );
};

export default DatePicker;
