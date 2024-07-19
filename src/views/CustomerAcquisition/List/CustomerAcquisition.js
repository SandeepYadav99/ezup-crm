import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import DataTables from "../../../Datatables/Datatable.table";
import Constants from "../../../config/constants";
import FilterComponent from "../../../components/Filter/Filter.component";

import ShadowBox from "../../../components/ShadowBox/ShadowBox";
import { useTheme } from "@mui/styles";
import { CustomListHeader } from "../../../components/CustomListHeader/CustomListHeader";
import useCustomerAcquisition from "./CustomerAcquisitionHook";

const CustomerAcquisition = (props) => {
  const {
    handleSortOrderChange,
    handleRowSize,
    handlePageChange,
    handleEdit,
    handleFilterDataChange,
    handleSearchValueChange,
    handleProfile,
    configFilter,

    handleCreate,
  } = useCustomerAcquisition({});

  const {
    present,
    all: allData,
    currentPage,
    is_fetching: isFetching,
  } = useSelector((state) => state.provider_user);
  const theme = useTheme();

  const tableStructure = useMemo(
    () => [
      {
        key: "channel_name",
        label: "Channel Name",

        sortable: false,
        render: (value, all) => <div>{}</div>,
      },
      {
        key: "channel_date",
        label: "Channel Date",

        sortable: false,
        render: (value, all) => <div>{}</div>,
      },
    ],
    [handleEdit, handleProfile]
  );
  const tableData = useMemo(() => {
    const datatableFunctions = {
      onSortOrderChange: handleSortOrderChange,
      onPageChange: handlePageChange,
      onRowSizeChange: handleRowSize,
    };
    const datatable = {
      ...Constants.DATATABLE_PROPERTIES,
      columns: tableStructure,
      data: [],//present
      count: 0,// allData.length
      page: 0,//currentPage
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
      <ShadowBox width={"100%"}>
        <CustomListHeader
          title={"ADD CHANNEL"}
          handleCreate={handleCreate}
          sideTitlle={"Customer Acquisition"}
        />

        <div>
          <FilterComponent
            is_progress={isFetching}
            filters={configFilter}
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
      </ShadowBox>
    </div>
  );
};

export default CustomerAcquisition;
