import { CategoriesStatics } from "@/components/statics/CategoriesStatics";
import { DocumentStatics } from "@/components/statics/DocumentStatics";
import { OrganizationStatics } from "@/components/statics/OrganizationStatics";
import { QuarterStatics } from "@/components/statics/QuarterStatics";
import { TopEntitesStatics } from "@/components/statics/TopEntitesStatics";

const Dashboard = () => {
  return (
    <>
      <OrganizationStatics />
      <div className="grid grid-cols-2 gap-4">
        <QuarterStatics />
        <CategoriesStatics />
        <TopEntitesStatics />
        <DocumentStatics />
      </div>
    </>
  );
};

export default Dashboard;
