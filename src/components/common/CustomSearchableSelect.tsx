import { debounce } from "@/utils/debounce";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import { FC, useState } from "react";
import { useQuery } from "react-query";

interface CustomSearchableSelectProps {
  selectProps: SelectProps;
  fetchOptions: (params: any) => Promise<any>;
  debounceTimeout?: number;
  promiseOptions?: any;
}
export const CustomSearchableSelect: FC<CustomSearchableSelectProps> = ({
  selectProps,
  fetchOptions,
  debounceTimeout = 800,
  promiseOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { isLoading, data } = useQuery(
    [
      `${selectProps.placeholder || "fetchOptions"}`,
      searchTerm,
      promiseOptions,
    ],
    () => {
      delete promiseOptions.enable;
      return fetchOptions({ ...promiseOptions, search: searchTerm });
    },
    {
      enabled: promiseOptions?.enable,
    }
  );

  const searchHandler = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Select
      notFoundContent={
        isLoading ? <Spin size="small" /> : <p>Ma'lumot topilmadi</p>
      }
      filterOption={false}
      onSearch={debounce(searchHandler, debounceTimeout)}
      options={data}
      {...selectProps}
    />
  );
};
