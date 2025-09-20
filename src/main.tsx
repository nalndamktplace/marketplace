import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "./utils/wagmi.tsx";
import { Provider } from "react-redux";
import store from "./store/Store.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";

// Create a client
const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <Provider store={store}>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <NotificationProvider>
              <App />
            </NotificationProvider>
            <ReactQueryDevtools />
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiConfig>
    </Provider>
  );
} else {
  createRoot(rootElement).render(
    <Provider store={store}>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <NotificationProvider>
              <App />
            </NotificationProvider>
            <ReactQueryDevtools />
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiConfig>
    </Provider>
  );
}
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <>
// <Provider store={store}>
//   <WagmiConfig config={wagmiConfig}>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <NotificationProvider>
//           <App />
//         </NotificationProvider>
//         <ReactQueryDevtools />
//       </BrowserRouter>
//     </QueryClientProvider>
//   </WagmiConfig>
// </Provider>
//   </>
// );
