import style from "./Style.module.css";
import NotificationCard from "./NotificationCard";
import { Typography } from "@mui/material";
import datavalue from "./data.json";
import { useCallback, useMemo, useState } from "react";
import ShadowBox from "../../../../components/ShadowBox/ShadowBox";

function Notifications() {
  const [viewAll, setViewall] = useState(false);
  const handleViewClick = useCallback(() => {
    setViewall((prev) => !prev);
  }, [viewAll, setViewall]);
  const dataValueStore = useMemo(() => {
    return datavalue?.Payment?.slice(0, 3).map((item, index) => (
      <NotificationCard data={item} index={index} />
    ));
  }, [viewAll]);

  return (
    <ShadowBox className={style.containerWidth}>
      <div className={style.header}>
        <Typography component="span" variant="h5" color="text.secondary">
          Notifications
        </Typography>
        <Typography
          component="span"
          variant="subtitle3"
          className={style.anchor}
          onClick={handleViewClick}
        >
          {viewAll ? "View Less" : "View All"}
        </Typography>
      </div>
      {dataValueStore}
    </ShadowBox>
  );
}
export default Notifications;
