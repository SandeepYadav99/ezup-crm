import React, { useCallback, useMemo } from "react";
import { Button, IconButton } from '@mui/material';
import classNames from "classnames";
import { useSelector } from "react-redux";
import SidePanelComponent from "../../../components/SidePanel/SidePanel.component";
import styles from "./Style.module.css";
import PageBox from "../../../components/PageBox/PageBox.component";
import DataTables from "../../../Datatables/Datatable.table";
import Constants from "../../../config/constants";
import FilterComponent from "../../../components/Filter/Filter.component";
import { Add, Create } from '@mui/icons-material';
import useHubMasterHook from "./HubMasterHook";
import HubMasterCreate from "../Create/HubMasterCreate";
import StatusPill from "../../../FormFields/Status/StatusPill.component";
import capitalizeFirstLetter from "../../../hooks/CommonFunction";


const HubMasterList = (props) => {
  const {
    handleSortOrderChange,
    handleRowSize,
    handlePageChange,
    handleFilterDataChange,
    handleSearchValueChange,
    handleViewDetails,
    isCalling,
    configFilter,
    handleSideToggle,
    isSidePanel,
    editId,
    handleEditHubMaster,
  } = useHubMasterHook({});

  const {
    present,
    all: allData,
    currentPage,
    is_fetching: isFetching,
  } = useSelector((state) => state.hubMaster);

  const renderFirstCell = useCallback((user) => {
    console.log(user, "User ");
    const tempEmailRender = user?.email ? (
      <span style={{ textTransform: "lowercase" }}>{user?.email}</span>
    ) : null;

    return (
      <div className={styles.firstCellFlex}>
        <div>
          <img src={user?.logo} alt="" />
        </div>
        <div className={classNames(styles.firstCellInfo, "openSans")}>
          <span>
            <strong>{`${user?.name}`}</strong>
          </span>{" "}
          <br />
          {tempEmailRender}
        </div>
      </div>
    );
  }, []);

  const renderAssociatedIndustriesName = useCallback((industryData) => (
    <div>
      {industryData?.map((industry, index) => (
        <React.Fragment key={index}>
          {industry.name}
          {index < industryData.length - 1 && ", "}
        </React.Fragment>
      ))}
    </div>
  ),[])
  
  const tableStructure = useMemo(() => {
    return [
      {
        key: "hub",
        label: "Hub Name",
        sortable: true,
        render: (value, all) => <div>{capitalizeFirstLetter(all?.name)} </div>, 
      },
      {
        key: "industries",
        label: "Associated Industries",
        sortable: true,
        render: (temp, all) => renderAssociatedIndustriesName(all?.industryData)
      },
      {
        key: "status",
        label: "Status",
        render: (temp, all) => (
          <div>
            <StatusPill status={all?.status} />
          </div>
        ),
      },
      {
        key: "featured",
        label: "Featured",
        render: (temp, all) => <div>{all?.featured}</div>,
      },
      {
        key: "user_id",
        label: "Action",
        render: (temp, all) => (
          <div>
            <IconButton
              className={"tableActionBtn"}
              color="secondary"
              disabled={isCalling}
              onClick={() => {
                // handleSideToggle(all?.id);
                handleEditHubMaster(all)
              }}
            >
              <Create fontSize={"small"} />
            </IconButton>
          </div>
        ),
      },
    ];
  }, [renderAssociatedIndustriesName, isCalling, handleEditHubMaster]);

  const tableData = useMemo(() => {
    const datatableFunctions = {
      onSortOrderChange: handleSortOrderChange,
      onPageChange: handlePageChange,
      onRowSizeChange: handleRowSize,
    };
    const datatable = {
      ...Constants.DATATABLE_PROPERTIES,
      columns: tableStructure,
      data: present,
      count: allData.length,
      page: currentPage,
    };

    return { datatableFunctions, datatable };
  }, [
    allData,
    tableStructure,
    handleSortOrderChange,
    handlePageChange,
    handleRowSize,
    present,
    currentPage,
 
  ]);

  return (
    <div>
      <PageBox>
        <div className={styles.headerContainer}>
          <span className={styles.title}>Hub List</span>
          <Button
            onClick={handleSideToggle}
            variant={"contained"}
            color={"primary"}
          >
            <Add></Add> Create
          </Button>
        </div>

        <div>
          <FilterComponent
            is_progress={isFetching}
            filters={configFilter} // configFilter
            handleSearchValueChange={handleSearchValueChange}
            handleFilterDataChange={handleFilterDataChange}
          />

          <div>
            <br />

            <div style={{ width: "100%" }}>
              <DataTables
                {...tableData.datatable}
                {...tableData.datatableFunctions}
              />
            </div>
            
          </div>
        </div>
      </PageBox>
      <SidePanelComponent
        handleToggle={handleSideToggle}
        title={editId ? "Update Hubs" : "New Hubs"}
        open={isSidePanel}
        side={"right"}
      >
        <HubMasterCreate
          handleSideToggle={handleSideToggle}
          isSidePanel={isSidePanel}
          empId={editId}
        />
      </SidePanelComponent>
    </div>
  );
};

export default HubMasterList;
