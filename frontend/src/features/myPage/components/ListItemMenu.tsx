import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { MenuEnum } from "../../../@types/myPage";

type Props = {
  menu: MenuEnum;
  label: string;
  selected: MenuEnum;
  onClick: (selectMenu: MenuEnum) => void;
};

const ListItemMenu: React.FC<Props> = ({ selected, label, menu, onClick }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected === menu}
        onClick={() => {
          onClick(menu);
        }}
      >
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemMenu;
