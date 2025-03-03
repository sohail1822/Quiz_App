import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../redux/snackbarSlice";

const Snackbar = () => {
  const { message, show, severity } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setTimeout(() => dispatch(hideSnackbar()), 3000);
    }
  }, [show, dispatch]);

  return (
    show && (
      <div className="position-fixed bottom-0 end-0 p-3">
        <div className={`toast show bg-${severity=='error'?"danger":"success"} text-white`}>
          <div className="toast-body">{message}</div>
        </div>
      </div>
    )
  );
};

export default Snackbar;
