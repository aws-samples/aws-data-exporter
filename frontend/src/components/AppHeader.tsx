import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useMuiTheme from "../hooks/useMuiTheme";
import DrawerState from "../recoil/DrawerState";
import DialogSelectLanguage from "./DialogSelectLanguage";
type Props = {
  signOut: () => void;
};

/**
 * Application Header
 * @param param0
 * @returns
 */
const AppHeader: React.FC<Props> = ({ signOut }) => {
  const [open, setOpen] = useRecoilState(DrawerState.open);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const gotoTop = useCallback(() => {
    navigate("/");
  }, []);

  const { switchMode, isDark } = useMuiTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openPerference = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openLanguageDialog, setOpenLanguageDialog] = useState<boolean>(false);

  const handleLanguageDialogOpen = useCallback(() => {
    setOpenLanguageDialog(true);
  }, []);
  const handleLanguageDialogClose = useCallback(() => {
    setOpenLanguageDialog(false);
  }, []);

  return (
    <Box component="nav">
      <AppBar position="fixed">
        <Toolbar variant="dense">
          {/* Open drawer when menu button pushed */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Go to IndexPage when title clicked */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: "pointer",
              ":hover": {
                textShadow: "#FFFFFF 1px 0 20px",
              },
            }}
            onClick={gotoTop}
          >
            {t("app.name")}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>{/* filler */}</Box>

          <IconButton color="inherit" size="small" onClick={handleClick}>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openPerference}
            onClose={handleClose}
            variant="menu"
          >
            <MenuItem
              onClick={() => {
                handleLanguageDialogOpen();
              }}
            >
              {t("app.settings.language")}
              <LanguageIcon sx={{ ml: 1 }} />
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                switchMode();
              }}
            >
              {t("app.settings.switchTheme")}
              {isDark ? (
                <Brightness4Icon sx={{ ml: 1 }} />
              ) : (
                <Brightness7Icon sx={{ ml: 1 }} />
              )}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                signOut();
              }}
            >
              {t("app.settings.signOut")}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <DialogSelectLanguage
        open={openLanguageDialog}
        onClose={handleLanguageDialogClose}
      />
    </Box>
  );
};

export default AppHeader;
