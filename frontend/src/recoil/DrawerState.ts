import { atom } from "recoil";
/**
 * DrawerState
 */

/**
 * DrawerOpen
 */
const open = atom({
  key: "drawerOpen",
  default: false,
});

const DrawerState = {
  open,
};

export default DrawerState;
