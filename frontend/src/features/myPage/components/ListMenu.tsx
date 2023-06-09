import { List } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { MenuEnum } from "../../../@types/myPage";
import ListItemMenu from "./ListItemMenu";

type Props = {
  selected: MenuEnum;
  onClick: (selectMenu: MenuEnum) => void;
};

const ListMenu: React.FC<Props> = ({ selected, onClick }) => {
  const { t } = useTranslation();

  const menuList: {
    menu: MenuEnum;
    label: string;
  }[] = [
    {
      menu: "saved",
      label: t("myPage.menu.savedReport"),
    },
    {
      menu: "shared",
      label: t("myPage.menu.sharedReport"),
    },
    {
      menu: "history",
      label: t("myPage.menu.extractionHistory"),
    },
  ];

  return (
    <List>
      {menuList.map((menu) => (
        <ListItemMenu
          key={menu.menu}
          {...menu}
          selected={selected}
          onClick={onClick}
        />
      ))}
    </List>
  );
};

export default ListMenu;
