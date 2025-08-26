import {
  Route,
  createRoutesFromChildren,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "./components/store/store";

import SideBar from "./components/sideBar";
import MainContent from "./components/mainContent";
import { ProductPage } from "./components/productPage";
import CartPage from "./components/cart";
import AuthPage from "./components/login";
import OrdersPage from "./components/orders";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Error Page
const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-[#539165]">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-gray-800">
        Oops! Page not found
      </h2>
      <p className="mt-2 text-gray-600">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-[#539165] text-white rounded-xl shadow hover:bg-[#437a50] transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
};

// Page transition wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        {/* Root route */}
        <Route
          path="/"
          element={isAuthenticated ? <SideBar /> : <AuthPage />}
          errorElement={<ErrorPage />} // ✅ attach error page
        >
          {isAuthenticated && (
            <>
              <Route
                index
                element={
                  <PageWrapper>
                    <MainContent />
                  </PageWrapper>
                }
              />
              <Route
                path="product/:id"
                element={
                  <PageWrapper>
                    <ProductPage />
                  </PageWrapper>
                }
              />
              <Route
                path="cart"
                element={
                  <PageWrapper>
                    <CartPage />
                  </PageWrapper>
                }
              />
              <Route
                path="orders"
                element={
                  <PageWrapper>
                    <OrdersPage />
                  </PageWrapper>
                }
              />
            </>
          )}
        </Route>

        {/* Fallback login route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
          errorElement={<ErrorPage />}
        />

        {/* Catch-all route (404) */}
        <Route path="*" element={<ErrorPage />} />
      </>
    )
  );

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
}

export default App;
