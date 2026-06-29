import { useQuery } from "@tanstack/react-query";

import { institutionTimetableApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionTimeSlots() {
  return useQuery({
    queryKey: queryKeys.institution.timeSlots(),
    queryFn: () => institutionTimetableApi.getTimeSlots(),
  });
}

export function useInstitutionTeachingAssignments() {
  return useQuery({
    queryKey: queryKeys.institution.teachingAssignments(),
    queryFn: () => institutionTimetableApi.getTeachingAssignments(),
  });
}

export function useInstitutionTimetableEntries() {
  return useQuery({
    queryKey: queryKeys.institution.timetableEntries(),
    queryFn: () => institutionTimetableApi.getEntries(),
  });
}

export function useInstitutionTimetableConflicts() {
  return useQuery({
    queryKey: queryKeys.institution.timetableConflicts(),
    queryFn: () => institutionTimetableApi.getConflicts(),
  });
}
