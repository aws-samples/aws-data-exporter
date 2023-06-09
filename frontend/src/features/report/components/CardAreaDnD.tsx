import React, { ReactNode } from "react";
import CardArea from "./CardArea";

type Props = {
  height: string;
  children: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardAreaDnD = React.forwardRef<any, Props>(function CardAreaDnD(
  props,
  ref
) {
  return <CardArea {...props} ref={ref} />;
});

export default CardAreaDnD;
