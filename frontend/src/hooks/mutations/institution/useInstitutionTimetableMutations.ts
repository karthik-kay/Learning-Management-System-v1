import { useMutation, useQueryClient } from "@tanstack/react-query";

import { institutionTimetableApi } from "@/lib/api/institution";

export function useCreateInstitutionTimetableEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: institutionTimetableApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "timetable-entries"],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", "timetable-conflicts"],
      });
    },
  });
}

export function usePublishInstitutionTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionTimetableApi.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "timetable-entries"],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", "timetable-conflicts"],
      });
    },
  });
}

export function useAddInstitutionSubstitute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionTimetableApi.addSubstitute,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "timetable-entries"],
      });
    },
  });
}
