import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentEnrollmentsApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof studentEnrollmentsApi.update>[1];
    }) => studentEnrollmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.enrollments(),
      });
    },
  });
}
