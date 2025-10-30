import { EntitesList } from "@/components/entites/EntitiesList";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";

const PerformerDocumentCategories = () => {
  const { config } = useDetectRoles();
  console.log(config?.role);
  return (
    <EntitesList
      navigateUrl={
        config.role === ROLES.IJROCHI
          ? `/performer/documents/categories/`
          : config.role === ROLES.MARKAZIY_APPARAT
          ? `/markaziy_apparat/documents/categories/`
          : ""
      }
    />
  );
};

export default PerformerDocumentCategories;
