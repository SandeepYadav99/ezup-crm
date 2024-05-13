import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RouteName from "./../../routes/Route.name";
import {
  actionFetchUnit,
  actionSetPageUnit,
    actionDragUnit
} from "./../../actions/Unit.action";
import history from "./../../libs/history.utils";
import LogUtils from "../../libs/LogUtils";

const useUserListHook = ({}) => {
  const [editData, setEditData] = useState(null);
  const [isSidePanel, setSidePanel] = useState(false);
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const isMountRef = useRef(false);
  const {
    sorting_data: sortingData,
    is_fetching: isFetching,
    query,
    query_data: queryData,
    all,
  } = useSelector((state) => state?.unit);

  useEffect(() => {
    dispatch(
      actionFetchUnit(
        1,
        {},
        {
          query: isMountRef.current ? query : null,
          query_data: isMountRef.current ? queryData : null,
        }
      )
    );
    isMountRef.current = true;
  }, []);
  const handleSideToggle = useCallback(
    (data) => {
      setSidePanel((e) => !e);
      if (data) {
        setEditData(data?.id);
      }else{
        setEditData(null)
      }
    },
    [setEditData, setSidePanel]
  );
  const handlePageChange = useCallback((type) => {
    dispatch(actionSetPageUnit(type));
  }, []);

  const queryFilter = useCallback(
    (key, value) => {
      dispatch(
        actionFetchUnit(1, sortingData, {
          query: key == "SEARCH_TEXT" ? value : query,
          query_data: key == "FILTER_DATA" ? value : queryData,
        })
      );
    },
    [sortingData, query, queryData]
  );

  const handleFilterDataChange = useCallback(
    (value) => {
      queryFilter("FILTER_DATA", value);
    },
    [queryFilter]
  );

  const handleSearchValueChange = useCallback(
    (value) => {
      queryFilter("SEARCH_TEXT", value);
    },
    [queryFilter]
  );

  const handleSortOrderChange = useCallback(
    (row, order) => {
      dispatch(actionSetPageUnit(1));
      dispatch(
        actionFetchUnit(
          1,
          { row, order },
          {
            query: query,
            query_data: queryData,
          }
        )
      );
    },
    [query, queryData]
  );
  const handleEdit = useCallback(
    (data) => {
      setEditData(data);
      setSidePanel((e) => !e);
    },
    [setEditData, setSidePanel]
  );
  const handleEditSidePannel = useCallback(
    (data) => {
      setSidePanel((e) => !e);
      if (data) {
        setEditData(data);
      } else {
        setEditData(null);
      }
      // setSidePanel((e) => !e);
      // setEditData(data?.id);
    },
    [setSidePanel, setEditData]
  );
  // const handleEdit = useCallback((type) => {
  //   history.push(`${RouteName.PRODUCT_DETAILS}${type?.id}`);
  // }, []);

  const handleCreate = useCallback(() => {
    history.push(RouteName.PRODUCT_CREATE);
  }, []);

  const configFilter = useMemo(() => {
    return [
      {
        label: "Created On",
        name: "createdAt",
        type: "date",
        options: { maxDate: new Date() },
      },
      {
        label: "Status",
        name: "status",
        type: "select",
        fields: ["PENDING", "ACTIVE"],
      },
    ];
  }, []);

  const handleDrag = useCallback((dragId, dragOverId) => {
      dispatch(actionDragUnit(dragId, dragOverId))
  }, []);

  return {
    handlePageChange,
    handleFilterDataChange,
    handleSearchValueChange,
    handleSortOrderChange,
    handleEdit,
    isSidePanel,
    handleSideToggle,
    editData,
    configFilter,
    handleEditSidePannel,
      handleDrag,
    // handleCreate,
  };
};

export default useUserListHook;
