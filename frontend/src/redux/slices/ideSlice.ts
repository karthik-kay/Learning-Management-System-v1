import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Backend-aligned node */
export type IDEFileNode = {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: IDEFileNode[];
  content?: string | null;
};

interface IDEState {
  workspaceId: number | null;
  tree: IDEFileNode[];
  openTabs: number[];
  activeFile: number | null;
  // fileId -> current buffer (what user sees)
  files: Record<number, string>;
  // fileId -> baseline (what is on the server)
  originalContents: Record<number, string>;
}

const initialState: IDEState = {
  workspaceId: null,
  tree: [],
  openTabs: [],
  activeFile: null,
  files: {},
  originalContents: {},
};

const ideSlice = createSlice({
  name: "ide",
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<number>) {
      state.workspaceId = action.payload;
    },
    setTree(state, action: PayloadAction<IDEFileNode[]>) {
      state.tree = action.payload;
    },
    openFile(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (!state.openTabs.includes(id)) {
        state.openTabs.push(id);
      }
      state.activeFile = id;
    },
    closeFile(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.openTabs = state.openTabs.filter((t) => t !== id);
      if (state.activeFile === id) {
        state.activeFile = state.openTabs[0] ?? null;
      }
    },
    setActiveFile(state, action: PayloadAction<number>) {
      state.activeFile = action.payload;
    },
    clearActiveFile(state) {
      state.activeFile = null;
    },
    // Called when loading file content from API for the first time
    setFileContent(
      state,
      action: PayloadAction<{ id: number; content: string }>,
    ) {
      const { id, content } = action.payload;
      state.files[id] = content;
      state.originalContents[id] = content;
    },
    // Called on every keystroke
    updateFileContent(
      state,
      action: PayloadAction<{ id: number; content: string }>,
    ) {
      state.files[action.payload.id] = action.payload.content;
    },
    // Called after a successful SAVE API call
    markFileSaved(state, action: PayloadAction<number>) {
      const id = action.payload;
      // Sync the baseline to the current buffer
      state.originalContents[id] = state.files[id];
    },
  },
});

export const {
  setWorkspace,
  setTree,
  openFile,
  closeFile,
  clearActiveFile,
  setActiveFile,
  setFileContent,
  updateFileContent,
  markFileSaved,
} = ideSlice.actions;

export default ideSlice.reducer;
