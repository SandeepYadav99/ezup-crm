import React, { useCallback, useMemo } from "react";
import { IconButton, ButtonBase, Avatar } from "@mui/material";
import classNames from "classnames";
import { useSelector } from "react-redux";
import PageBox from "../../../components/PageBox/PageBox.component";
import styles from "./Style.module.css";
import DataTables from "../../../Datatables/Datatable.table";
import Constants from "../../../config/constants";
import StatusPill from "../../../components/Status/StatusPill.component";
import SidePanelComponent from "../../../components/SidePanel/SidePanel.component";
import useShiftsListsHook from "./ShiftsListsHook";
import HoursCreate from "../WorkingHoursCreate/HoursCreate";
import WeekSection from "../Componet/WeekSection";
import ShiftsCreate from "../Create/ShiftsCreate";
import DeleteDialog from "./component/DeleteDialog/DeleteDialog.view";
import {
  AccessTime,
  Add,
  DeleteOutline,
  Edit,
  Info,
  InfoOutlined,
} from "@mui/icons-material";
import ShadowBox from "../../../components/ShadowBox/ShadowBox";
import { useTheme } from "@mui/styles";

const ShiftsLists = ({}) => {
  const {
    handleSortOrderChange,
    handleRowSize,
    handlePageChange,
    handleEdit,
    isSidePanel,
    isCalling,
    handleViewDelete,
    id,
    isSidePanelHours,
    handleToggleSidePannelHours,
    handleToggleSidePannel,
    handleViewShiftDetail,
    updateData,
    toggleDelete,
    isDelete,
    deleteId,
  } = useShiftsListsHook({});
  const theme = useTheme();

  const {
    data,
    all: allData,
    currentPage,
    is_fetching: isFetching,
  } = useSelector((state) => state?.Shifts);

  const renderStatus = useCallback((status) => {
    return <StatusPill status={status} />;
  }, []);

  const renderFirstCell = useCallback((obj) => {
    if (obj) {
      return (
        <div className={styles.firstCellFlex}>
          <div className={classNames(styles.firstCellInfo, "openSans")}>
            <span className={styles.productName}>{obj?.name || "N/A"}</span>{" "}
            <br />
          </div>
        </div>
      );
    }
    return null;
  }, []);

  const renderTileHours = useCallback(() => {
    return (
      <div>
        <div className={styles.titleTime}>Adjust Full Day/Half Day Hours</div>
        <div className={styles.newLine} />
      </div>
    );
  }, [id]);

  const renderTile = useCallback(() => {
    return (
      <div>
        <span className={styles.title}>
          {updateData?.id ? "Update" : "Add"} Shift
        </span>
        <div className={styles.newLine} />
      </div>
    );
  }, [updateData]);

  const workingDays = useCallback((all) => {
    return (
      <div className={styles.avatorFlex}>
        {all?.shiftDays?.map((shift) => {
          if (shift?.is_week_off && !shift?.is_occasional_working) {
            return (
              <Avatar className={styles.avator}>
                {shift?.name?.substring(0, 2)}
              </Avatar>
            );
          } else if (shift?.is_occasional_working && shift?.is_week_off) {
            return (
              <Avatar className={styles.avatorSeletedCircle}>
                {shift?.name?.substring(0, 2)}
              </Avatar>
            );
          } else {
            return (
              <Avatar className={styles.avatorSeleted}>
                {shift?.name?.substring(0, 2)}
              </Avatar>
            );
          }
        })}
      </div>
    );
  }, []);
  const tableStructure = useMemo(() => {
    return [
      {
        key: "shift_name",
        label: "Shift Name",
        sortable: false,
        render: (value, all) => <div>{all?.name}</div>,
      },
      {
        key: "assigned_employees",
        label: "Assigned Employee",
        sortable: false,
        render: (temp, all) => (
          <div>{all?.associatedEmployeesCount ?? "N/A"}</div>
        ),
      },
      {
        key: "shift_days",
        label: "Shift Days",
        sortable: false,
        render: (temp, all) => workingDays(all),
      },

      {
        key: "user_id",
        label: "Action",
        render: (temp, all) => (
          <div>
            {/* <IconButton
              className={"tableActionBtn"}
              color="secondary"
              disabled={isCalling}
              onClick={() => {
                handleViewShiftDetail(all);
              }}
            >
              <InfoOutlined fontSize={"small"} />
            </IconButton> */}
            <IconButton
              disableRipple="false"
              onClick={() => {
                // handleSideToggle(all?.id);
                handleViewShiftDetail(all);
              }}
            >
              <Info
                fontSize={"small"}
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            </IconButton>
            {!all?.is_default && (
              <IconButton
                disableRipple="false"
                onClick={() => {
                  handleToggleSidePannel(all);
                }}
              >
                <Edit
                  fontSize={"small"}
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                />
              </IconButton>
            )}

            {!all?.is_default && (
              <IconButton
                disableRipple="false"
                onClick={() => {
                  toggleDelete(all);
                }}
              >
                <DeleteOutline
                  fontSize={"small"}
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                />
              </IconButton>
            )}
          </div>
        ),
      },
    ];
  }, [
    renderStatus,
    renderFirstCell,
    handleViewDelete,
    handleEdit,
    isCalling,
    handleViewShiftDetail,
    workingDays,
    handleToggleSidePannel,
  ]);

  const tableData = useMemo(() => {
    const datatableFunctions = {
      onSortOrderChange: handleSortOrderChange,
      onPageChange: handlePageChange,
      onRowSizeChange: handleRowSize,
    };

    const datatable = {
      ...Constants.DATATABLE_PROPERTIES,
      columns: tableStructure,
      data: data,
      count: allData?.length,
      page: currentPage,
    };

    return { datatableFunctions, datatable };
  }, [
    allData,
    tableStructure,
    handleSortOrderChange,
    handlePageChange,
    handleRowSize,
    data,
    currentPage,
  ]);

  return (
    <div>
      <ShadowBox className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <div>
            <span className={styles.title}>Shifts</span>
            <div className={styles.newLine} />
          </div>
          <div className={styles.actionButton}>
            <ButtonBase
              onClick={handleToggleSidePannelHours}
              className={styles.setWorking}
            >
              SET WORKING HOURS{" "}
              <AccessTime
                fontSize={"small"}
                className={"plusIcon"}
              ></AccessTime>
            </ButtonBase>
            <ButtonBase
              onClick={() => handleToggleSidePannel()}
              className={"createBtn"}
            >
              ADD SHIFT<Add fontSize={"small"} className={"plusIcon"}></Add>
            </ButtonBase>
          </div>
        </div>

        <div className={styles.actionTime}>
          <div className={styles.weekSection}>
            <WeekSection />
          </div>
        </div>
        <DeleteDialog
          isOpen={isDelete}
          handleToggle={toggleDelete}
          deleteId={deleteId}
        />
        <div>
          {/* <FilterComponent
            is_progress={isFetching}
            filters={configFilter}
            handleSearchValueChange={handleSearchValueChange}
            handleFilterDataChange={handleFilterDataChange}
          />  */}

          <div style={{ width: "100%" }}>
            <DataTables
              {...tableData.datatable}
              {...tableData.datatableFunctions}
            />
          </div>
        </div>
      </ShadowBox>
      <SidePanelComponent
        handleToggle={() => handleToggleSidePannel()}
        title={renderTile()}
        open={isSidePanel}
        side={"right"}
        arrowBack={true}
      >
        <ShiftsCreate
          isSidePanel={isSidePanel}
          handleToggleSidePannel={handleToggleSidePannel}
          editData={updateData}
        />
      </SidePanelComponent>
      <SidePanelComponent
        handleToggle={handleToggleSidePannelHours}
        title={renderTileHours()}
        open={isSidePanelHours}
        side={"right"}
        arrowBack={true}
      >
        <HoursCreate
          isSidePanel={isSidePanelHours}
          handleToggleSidePannel={handleToggleSidePannelHours}
          qrId={id}
        />
      </SidePanelComponent>
    </div>
  );
};

export default ShiftsLists;
