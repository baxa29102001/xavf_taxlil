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
const ExaminationPage = React.lazy(
  () => import("@/pages/examination/ExaminationPage")
);

const HisobotPage = React.lazy(() => import("@/pages/Hisobot/index.tsx"));
const HisobotOrganizationsScore = React.lazy(
  () => import("@/pages/Hisobot/OrganizationsScore")
);
const HisobotOrganizationsCategoryScore = React.lazy(
  () => import("@/pages/Hisobot/OrganizationsCategoryScore")
);
const HisobotOrganizationsScoreByRegion = React.lazy(
  () => import("@/pages/Hisobot/OrganizationsScoreByRegion")
);

const StatusByCategory = React.lazy(
  () => import("@/pages/Hisobot/StatusByCategory")
);

const StatusByOrganizations = React.lazy(
  () => import("@/pages/Hisobot/StatusByOrganizations")
);

const StatusAllOrganizations = React.lazy(
  () => import("@/pages/Hisobot/StatusAllOrganizations")
);
const SubmittedCaseByCategory = React.lazy(
  () => import("@/pages/Hisobot/SubmittedCaseByCategory")
);
const SubmittedCaseByUserOrganization = React.lazy(
  () => import("@/pages/Hisobot/SubmittedCaseByUserOrganization")
);
const ActionTakenByCategoryPage = React.lazy(
  () => import("@/pages/Hisobot/ActionTakenByCategory")
);
const ActionTakenByOrganizationPage = React.lazy(
  () => import("@/pages/Hisobot/ActionTakenByOrganization")
);
const ActionTakenByExaminationByOrganization = React.lazy(
  () => import("@/pages/Hisobot/ActionTakenByExaminationByOrganization")
);
const ActionTakenByExaminationByCategory = React.lazy(
  () => import("@/pages/Hisobot/ActionTakenByExaminationByCategory")
);
const ActionTakenByProfilatikByOrganization = React.lazy(
  () => import("@/pages/Hisobot/ActionTakenByProfilatikByOrganization")
);
const ActionTakenByProfilatikByCategory = React.lazy(
  () => import("@/pages/Hisobot/ActionTakenByProfilatikByCategory")
);
const EliminationListPage = React.lazy(
  () => import("@/pages/Elimination/EliminationList")
);
const SolutionListPage = React.lazy(
  () => import("@/pages/Solutions/SolutionList")
);
const EntityCriteriaDetailPage = React.lazy(
  () => import("@/pages/performer/EntityCriteriaDetail")
);

export const useConfigRoutes = () => {
  const context: any = useContext(AuthContext);

  return useRoutes(
    context?.userDetails !== null
      ? getSuitableRoutes(context?.userDetails?.role)
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

const Routes = [
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
    path: "elimination",
    element: <EliminationListPage />,
  },
  {
    path: "solutions",
    element: <SolutionListPage />,
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
  {
    path: "examination",
    element: <ExaminationPage />,
  },

  {
    path: "hisobot",
    element: <HisobotPage />,
  },
  {
    path: "hisobot/organizations-scores",
    element: <HisobotOrganizationsScore />,
  },
  {
    path: "hisobot/organizations-category-scores",
    element: <HisobotOrganizationsCategoryScore />,
  },
  {
    path: "hisobot/organization-scores-by-region",
    element: <HisobotOrganizationsScoreByRegion />,
  },
  {
    path: "hisobot/case-status-by-category",
    element: <StatusByCategory />,
  },
  {
    path: "hisobot/case-status-by-organization",
    element: <StatusByOrganizations />,
  },
  {
    path: "hisobot/case-status-all-organizations",
    element: <StatusAllOrganizations />,
  },
  {
    path: "hisobot/submitted-cases-by-category",
    element: <SubmittedCaseByCategory />,
  },
  {
    path: "hisobot/submitted-cases-by-user-organization",
    element: <SubmittedCaseByUserOrganization />,
  },
  {
    path: "hisobot/action-taken-by-category",
    element: <ActionTakenByCategoryPage />,
  },
  {
    path: "hisobot/action-taken-by-organization",
    element: <ActionTakenByOrganizationPage />,
  },
  {
    path: "hisobot/action-taken-by-examination-by-organization",
    element: <ActionTakenByExaminationByOrganization />,
  },
  {
    path: "hisobot/action-taken-by-examination-by-category",
    element: <ActionTakenByExaminationByCategory />,
  },
  {
    path: "hisobot/action-taken-by-profilatik-by-organization",
    element: <ActionTakenByProfilatikByOrganization />,
  },
  {
    path: "hisobot/action-taken-by-profilatik-by-category",
    element: <ActionTakenByProfilatikByCategory />,
  },
  {
    path: "criteria/:id",
    element: <EntityCriteriaDetailPage />,
  },
];

function getSuitableRoutes(role: ROLES) {
  switch (role) {
    case ROLES.GIS:
      return [{}];
    case ROLES.IJROCHI:
      return [
        {
          path: "/performer",
          element: <MainLayout />,
          children: Routes,
        },
        {
          path: "*",
          element: <Navigate to="/performer" replace />,
        },
      ];
    case ROLES.MASUL:
      return [
        {
          path: "/masul",
          element: <MainLayout />,
          children: Routes,
        },
        {
          path: "*",
          element: <Navigate to="/masul" replace />,
        },
      ];
    case ROLES.RAHBAR:
      return [
        {
          path: "/rahbar",
          element: <MainLayout />,
          children: Routes,
        },

        {
          path: "*",
          element: <Navigate to="/rahbar" replace />,
        },
      ];
    default:
      return [];
  }
}
