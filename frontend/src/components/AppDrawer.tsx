import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useReportState from "../features/report/hooks/useReportState";
import DrawerState from "../recoil/DrawerState";

type DrawerListItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  before?: () => void;
};

/**
 * Side menu drawer
 * @returns
 */
const AppDrawer: React.FC = () => {
  const { clear } = useReportState();
  const { t, i18n } = useTranslation();

  const listItems: DrawerListItem[] = useMemo(
    () => [
      {
        label: t("app.sideMenu.myPage"),
        to: "/",
        icon: <AccountCircleIcon />,
      },
      {
        label: t("app.sideMenu.newReport"),
        to: "/report/conditions/new",
        icon: <EditIcon />,
        before: () => {
          clear();
        },
      },
    ],
    [i18n.language]
  );

  const [open, setOpen] = useRecoilState(DrawerState.open);
  const navigate = useNavigate();

  const onClick = useCallback((item: DrawerListItem) => {
    if (item.before) {
      item.before();
    }
    navigate(item.to);
    setOpen(false);
  }, []);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box sx={{ width: 250 }}>
        <List>
          {listItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => onClick(item)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AppDrawer;
