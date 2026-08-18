import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complaint_source: "",
  customer_name: "",
  product_name: "",
  strength: "",
  batch_number: "",
  manufacturing_date: "",
  expiry_date: "",
  affected_quantity: "",
  complaint_type: "",
  complaint_date: "",
  complaint_description: "",
  risk_assessment: {
    severity: "",
    priority: "",
    initial_risk: "",
    suggested_next_action: "",
  },
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    setComplaint: (state, action) => {
      if (!action.payload) return initialState;
      return {
        ...initialState,
        ...action.payload,
        risk_assessment: {
          ...initialState.risk_assessment,
          ...(action.payload.risk_assessment || {}),
        },
      };
    },
    clearComplaint: () => {
      return initialState;
    },
  },
});

export const { setComplaint, clearComplaint } = complaintSlice.actions;

export default complaintSlice.reducer;
