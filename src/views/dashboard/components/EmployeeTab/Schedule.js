import React from "react";
import styles from "./Style.module.css";
import ShadowBox from "../../../../components/ShadowBox/ShadowBox";
import data from "./mockData";
import { Typography } from "@mui/material";
import calender from "../../../../assets/Assets/ic_calendar.png";
import menu from "../../../../assets/Assets/ic_kebab_menu.png";
import StatusPill from "../../../../components/Status/StatusPill.component";

const Schedule = () => {
  return (
    <>
      <ShadowBox className={styles.meetingSchedule}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <Typography variant={"h5"} color={"text.primary"}>
            {data.title}
          </Typography>
          <img
            src={menu}
            className={styles.menu}
            alt="Image"
            style={{ marginLeft: "auto" }}
          />
        </span>
        {data.Data.map((item, index) => (
          <div className={styles.members}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className={styles.gap}>
                <img
                  src={item.image}
                  alt="Image"
                  style={{ marginRight: "10px" }}
                  className={styles.userImage}
                />
                <div>
                  <Typography
                    variant={"subtitle1"}
                    color={"text.primary"}
                    sx={{ mb: 0.3 }}
                  >
                    {item.subtitle}
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={calender} alt="Image" />
                    <Typography
                      variant={"body2"}
                      color={"text.secondary"}
                      sx={{ ml: 1 }}
                    >
                      {item.Date}
                    </Typography>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <StatusPill status={item.status} color={item.color} />
              </div>
            </div>
          </div>
        ))}
      </ShadowBox>
    </>
  );
};

export default Schedule;
