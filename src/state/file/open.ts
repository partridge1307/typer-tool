import { TypeData, parseText } from "@/utils/type-tool";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/tauri";

interface ITypeState {
  data: TypeData[] | null;
}

const initialState: ITypeState = {
  data: null,
};

const typeFileSlice = createSlice({
  name: "type_file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addFileAsync.fulfilled, (state, action) => {
      if (!action.payload) return;

      state.data = action.payload;
    });
  },
});

const addFileAsync = createAsyncThunk(
  "type_file/add_file",
  async (path: string) => {
    try {
      const result: string = await invoke("read_file", { path });
      const parsed_text = parseText(result);

      return parsed_text;
    } catch (error) {
      console.log(error);
    }
  }
);

export default typeFileSlice.reducer;
