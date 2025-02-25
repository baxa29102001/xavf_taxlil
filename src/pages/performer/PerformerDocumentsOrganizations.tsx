import { OrganizationsList } from "@/components/entites/OrganizationsList";
import { useDetectRoles } from "@/hooks/useDetectRoles";

const PerformerDocumentOrganizations = () => {
  const { config } = useDetectRoles();
  return (
    <OrganizationsList
      navigateUrl={`/${config.mainUrl}/documents/organizations/`}
    />
  );
};

export default PerformerDocumentOrganizations;
