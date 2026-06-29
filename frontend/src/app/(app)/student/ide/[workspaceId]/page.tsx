"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { IDEWorkbenchLayout } from "@/components/layout/auth-layout/student-app-layout/ide/IDEWorkbenchLayout";
import { ExplorerPanel } from "@/components/compositions/student/ide/ExplorerPanel";
import { EditorPanel } from "@/components/compositions/student/ide/EditorPanel/EditorPanel";
import { BottomPanel } from "@/components/compositions/student/ide/BottomPanel/BottomPanel";
import { AuxiliaryPanel } from "@/components/compositions/student/ide/auxiliaryPanel/AuxiliaryPanel";

import { AppDispatch } from "@/redux/store";
import { initIDE } from "@/redux/thunks/ideThunks";

export default function IDEPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const workspaceId = Number(params.workspaceId);

  useEffect(() => {
    if (!workspaceId) return;
    dispatch(initIDE(workspaceId));
  }, [dispatch, workspaceId]);

  return (
    <IDEWorkbenchLayout
      explorer={<ExplorerPanel />}
      editor={<EditorPanel />}
      auxiliary={<AuxiliaryPanel />}
      bottom={<BottomPanel />}
    />
  );
}
