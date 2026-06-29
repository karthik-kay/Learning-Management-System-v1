import { useMutation, useQueryClient } from "@tanstack/react-query";

import { institutionAttendanceApi } from "@/lib/api/institution";

export function useMarkInstitutionBulkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionAttendanceApi.markBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "attendance-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", "attendance-shortages"],
      });
    },
  });
}

export function useUnlockInstitutionAttendanceSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionAttendanceApi.unlockSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "attendance-sessions"],
      });
    },
  });
}

export function useSendInstitutionBulkShortageAlert() {
  return useMutation({
    mutationFn: institutionAttendanceApi.sendBulkShortageAlert,
  });
}

export function useApplyInstitutionLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionAttendanceApi.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "leave-applications"],
      });
    },
  });
}

export function useDecideInstitutionLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionAttendanceApi.decideLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "leave-applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", "attendance-records"],
      });
    },
  });
}

export function useRejectInstitutionLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionAttendanceApi.rejectLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "leave-applications"],
      });
    },
  });
}
