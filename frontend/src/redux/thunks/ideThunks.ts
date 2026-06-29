import { AppDispatch, RootState } from "../store";
import { djangoService } from "@/services/djangoService";
import {
  setWorkspace,
  setTree,
  openFile,
  setFileContent,
  closeFile,
  markFileSaved,
} from "../slices/ideSlice";

/** * Helper: Collects all file IDs within a folder tree
 * Used for closing tabs when a folder is deleted
 */
function collectFileIds(node: any): number[] {
  if (node.type === "file") return [node.id];
  const ids: number[] = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectFileIds(child));
    }
  }
  return ids;
}

/**
 * 1. Initialize Workspace
 * Fetches or creates the default workspace and loads the file tree.
 */
/**
 * 1. Initialize Workspace
 * Now accepts workspaceId directly from the URL params via IDEPage
 */
export const initIDE =
  (workspaceId: number) => async (dispatch: AppDispatch) => {
    try {
      // Set the ID in Redux so other components know which workspace is active
      dispatch(setWorkspace(workspaceId));

      // Fetch the specific file tree for this workspace from Django
      const tree = await djangoService.getWorkspaceTree(workspaceId);

      // Push the tree into Redux
      dispatch(setTree(tree));

      console.log(`Workspace ${workspaceId} initialized successfully.`);
    } catch (error) {
      console.error(
        "Failed to initialize IDE for workspace:",
        workspaceId,
        error,
      );
    }
  };
/**
 * 2. Open File
 * Sets active file and loads content if not already in Redux state.
 */
export const openFileThunk =
  (fileId: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { files, tree } = getState().ide;
    dispatch(openFile(fileId));

    // If content already cached, don't fetch again
    if (files[fileId] !== undefined) return;

    const findFile = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.id === fileId) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const fileNode = findFile(tree);
    if (fileNode?.content !== undefined) {
      dispatch(setFileContent({ id: fileId, content: fileNode.content ?? "" }));
    }
  };

/**
 * 3. Save File (The Manual Save)
 * Triggered by Ctrl+S. Sends current buffer to Django and resets "Dirty" state.
 */
export const saveFileThunk =
  (fileId: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { files } = getState().ide;
    const content = files[fileId];

    try {
      await djangoService.updateItem(fileId, { content });
      // This resets originalContents[fileId] to match current files[fileId]
      dispatch(markFileSaved(fileId));
    } catch (error) {
      console.error("Failed to save file", error);
    }
  };

/**
 * 4. Create Item (File/Folder)
 */
export const createItemThunk =
  (data: {
    workspace: number;
    name: string;
    type: "file" | "folder";
    parent: number | null;
    content?: string;
  }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await djangoService.createItem(data);
      const workspaceId = getState().ide.workspaceId!;
      const tree = await djangoService.getWorkspaceTree(workspaceId);
      dispatch(setTree(tree));
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

/**
 * 5. Delete Item
 * Deletes item and automatically closes any open tabs related to that item/folder.
 */
export const deleteItemThunk =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { workspaceId, tree: currentTree, openTabs } = getState().ide;
    if (!workspaceId) return;

    const findNode = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const deletedNode = findNode(currentTree);
    const idsToClose =
      deletedNode?.type === "file"
        ? [deletedNode.id]
        : deletedNode
          ? collectFileIds(deletedNode)
          : [];

    try {
      await djangoService.deleteItem(id);
      const newTree = await djangoService.getWorkspaceTree(workspaceId);
      dispatch(setTree(newTree));

      // Cleanup: Close tabs for deleted files
      idsToClose.forEach((fileId) => {
        if (openTabs.includes(fileId)) {
          dispatch(closeFile(fileId));
        }
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

/**
 * 6. Rename Item
 */
export const renameItemThunk =
  (id: number, name: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await djangoService.updateItem(id, { name });
      const workspaceId = getState().ide.workspaceId!;
      const tree = await djangoService.getWorkspaceTree(workspaceId);
      dispatch(setTree(tree));
    } catch (error) {
      console.error("Failed to rename item:", error);
    }
  };
