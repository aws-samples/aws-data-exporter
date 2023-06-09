import InfoIcon from "@mui/icons-material/Info";
import { Box, Typography } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import useLocale from "../../../hooks/useLocale";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type Props<TData extends Record<string, any> = {}> = {
  data: TData[];
  columns: MRT_ColumnDef<TData>[];
  loading?: boolean;
};

const TableReport: React.FC<Props> = ({ data, columns, loading }) => {
  const { t } = useTranslation();
  const { mrtLocale } = useLocale();
  return (
    <MaterialReactTable
      state={{ isLoading: loading }}
      columns={columns}
      data={data}
      localization={mrtLocale}
      enableColumnOrdering
      enableDensityToggle={false}
      initialState={{ density: "compact" }}
      enableMultiSort
      renderBottomToolbarCustomActions={() => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <InfoIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="caption">
            {t("reportPage.message.selectMultipleColumnsNotice")}
          </Typography>
        </Box>
      )}
    />
  );
};

export default TableReport;
