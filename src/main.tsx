import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { AuthContextProvider } from "./context/authContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </QueryClientProvider>
);

const input = {
  a: {
    b: {
      c: {
        f: 4,
        v: 5,
      },
      d: 2,
    },
    e: 3,
  },
  f: 4,
};

function flattenObject(input: any) {
  let output: any = {};

  if (Object.keys(input).every((key) => typeof input[key] !== "object"))
    return input;

  Object.keys(input).forEach((key) => {
    if (typeof input[key] === "object") {
      Object.keys(input[key]).forEach((childKey) => {
        output[`${key}.${childKey}`] = input[key][childKey];
      });

      return;
    }
    output[key] = input[key];
  });

  flattenObject(output);
}

flattenObject(input);
