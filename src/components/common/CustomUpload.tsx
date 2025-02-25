import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Upload } from "antd";

interface CustomUploadProps {
  value?: UploadFile[];
  multiple?: boolean;
  onChange?: (files: UploadFile[]) => void;
}

export const CustomUpload: React.FC<CustomUploadProps> = ({
  value = [],
  onChange,
  multiple,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(value);

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];
    setFileList(newFileList);

    if (onChange) onChange(newFileList);
  };

  const props = {
    customRequest: ({ onSuccess }: any) => {
      onSuccess("ok");
    },
    onChange: handleChange,
    multiple: multiple,
    fileList,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Fayl biriktirish</Button>
    </Upload>
  );
};
