import axiosT from "@/api/axios";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

interface EntitesListProps {
  navigateUrl?: string;
}
export const EntitesList: FC<EntitesListProps> = ({ navigateUrl }) => {
  const [categories, setCategories] = useState([]);

  useQuery(["categories"], () => axiosT.get("/organizations/categories/"), {
    onSuccess({ data }) {
      setCategories(data);
    },
  });

  return (
    <div className="px-4 py-5">
      <h2 className="text-[#262626] text-2xl font-semibold Monserrat mb-4.5">
        Tadbirkorlik subyektlari
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {categories.map((category: any) => (
          <Link
            to={
              (navigateUrl ? navigateUrl : "/performer/entity/") + category.id
            }
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <h3 className="text-[#10384F]">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};
