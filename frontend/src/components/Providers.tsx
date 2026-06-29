"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { QueryProvider } from "@/lib/query/QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
}
