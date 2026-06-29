import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import { Certificate } from "@/types/index";

interface CertificateState {
  certificates: Certificate[];
  selected: Certificate | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CertificateState = {
  certificates: [],
  selected: null,
  status: "idle",
  error: null,
};

export const fetchCertificates = createAsyncThunk(
  "certificates/fetchAll",
  async () => {
    return (await djangoService.getCertifications()) as Certificate[];
  },
);

export const fetchCertificate = createAsyncThunk(
  "certificates/fetchOne",
  async (credentialId: string) => {
    return (await djangoService.getCertificate(credentialId)) as Certificate;
  },
);

const certificateSlice = createSlice({
  name: "certificates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchCertificates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.certificates = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch certificates";
      })
      // fetch one
      .addCase(fetchCertificate.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export default certificateSlice.reducer;
