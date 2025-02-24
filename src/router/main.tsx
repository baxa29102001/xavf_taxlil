import React, { useContext } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout.tsx";
import { ROLES } from "@/constants/enum";
import AuthContext from "@/context/authContext";
import LoginForm from "@/pages/login/LoginForm";

const PerformerDashboardPage = React.lazy(
  () => import("@/pages/performer/Dashboard.tsx")
);
const PerformerEntityPage = React.lazy(
  () => import("@/pages/performer/PerformerEntity")
);
const PerformerEntityOrganizationPage = React.lazy(
  () => import("@/pages/performer/PerformerEntityOrganization")
);
const PerformerEntityOrganizationDetailPage = React.lazy(
  () => import("@/pages/performer/PerformerEntityOrganizationDetail")
);
const PerformerDocumentsPage = React.lazy(
  () => import("@/pages/performer/PerformerDocuments")
);
const PerformerDocumentDetailPage = React.lazy(
  () => import("@/pages/performer/PerformerDocumentDetail")
);
const PerformerDocumentCategoriesPage = React.lazy(
  () => import("@/pages/performer/PerformerDocumentCategories")
);
const PerformerDocumentOrganizationsPage = React.lazy(
  () => import("@/pages/performer/PerformerDocumentsOrganizations")
);
const PerformerDocumentsOrganizationDetailPage = React.lazy(
  () => import("@/pages/performer/PerformerDocumentsOrganizationDetail")
);
const PerformerPreventionPage = React.lazy(
  () => import("@/pages/performer/PerformerPrevention")
);

export const useConfigRoutes = () => {
  const isUserAuthenticated = useContext(AuthContext)?.userDetails !== null;
  return useRoutes(
    isUserAuthenticated
      ? getSuitableRoutes(ROLES.IJROCHI)
      : [
          {
            path: "/login",
            element: (
              <React.Suspense fallback={<>...Yuklanmoqda</>}>
                <LoginForm />
              </React.Suspense>
            ),
          },
          {
            path: "*",
            element: <Navigate to="/login" replace />,
          },
        ]
  );
};

function getSuitableRoutes(role: ROLES) {
  switch (role) {
    case ROLES.GIS:
      return [{}];
    case ROLES.IJROCHI:
      return [
        {
          path: "/performer",
          element: <MainLayout />,
          children: [
            {
              path: "",
              element: <PerformerDashboardPage />,
            },
            {
              path: "entity",
              element: <PerformerEntityPage />,
            },
            {
              path: "documents",
              element: <PerformerDocumentsPage />,
            },
            {
              path: "documents/:id",
              element: <PerformerDocumentDetailPage />,
            },
            {
              path: "documents/category",
              element: <PerformerDocumentCategoriesPage />,
            },
            {
              path: "documents/categories/:id",
              element: <PerformerDocumentOrganizationsPage />,
            },
            {
              path: "documents/organizations/:organizationId/:id",
              element: <PerformerDocumentsOrganizationDetailPage />,
            },

            {
              path: "entity/:id",
              element: <PerformerEntityOrganizationPage />,
            },
            {
              path: "entity/:organizationId/:id",
              element: <PerformerEntityOrganizationDetailPage />,
            },
            {
              path: "prevention",
              element: <PerformerPreventionPage />,
            },
          ],
        },
        {
          path: "*",
          element: <Navigate to="/performer" replace />,
        },
      ];
    case ROLES.MASUL:
      return [
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ];
    case ROLES.RAHBAR:
      return [
        {
          path: "/",
          element: <MainLayout />,
          children: [],
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ];
    default:
      return [];
  }
}
