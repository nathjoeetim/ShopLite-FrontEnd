import {
  Route,
  createRoutesFromChildren,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "./components/store/store"; // adjust path

import SideBar from "./components/sideBar";
import MainContent from "./components/mainContent";
import { ProductPage } from "./components/productPage";
import CartPage from "./components/cart";
import AuthPage from "./components/login";
import { motion, AnimatePresence } from "framer-motion";
import OrdersPage from "./components/orders";

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
        {/*  Root route: show SideBar if logged in, else AuthPage */}
        <Route path="/" element={isAuthenticated ? <SideBar /> : <AuthPage />}>
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

        {/* 🔑 Fallback /login route for manual access */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
        />
      </>
    )
  );

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />;
    </AnimatePresence>
  );
}

export default App;
