import { useMutation, useQueryClient } from "@tanstack/react-query";

import { institutionExportsApi } from "@/lib/api/institution";

export function useCreateInstitutionExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionExportsApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "exports"] });
      queryClient.invalidateQueries({ queryKey: ["institution", "audit-logs"] });
    },
  });
}
