import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useTableApi from "../../../api/useTableApi";

type Props = {
  tableName: string;
  onChange: (value: string) => void;
};

const SelectTable: React.FC<Props> = ({ tableName, onChange }) => {
  const { getTableList } = useTableApi();
  const { t } = useTranslation();

  const { data } = getTableList();

  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    setOptions(data?.tables ?? []);
  }, [data]);

  return (
    <Autocomplete
      value={tableName}
      disablePortal
      options={options}
      sx={{ width: 300 }}
      loading={!data}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("reportPage.message.selectTable")}
        />
      )}
      onChange={(_, value) => {
        onChange(value ?? "");
      }}
    />
  );
};

export default SelectTable;
