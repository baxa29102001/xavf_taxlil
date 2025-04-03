import { FC } from "react";
import { FilesBlock, filesProp } from "./ShowFilesByCategories";
import { Modal } from "antd";

interface ShoWUploadedFilesWithCommentsProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  files: filesProp[];
}

export const ShoWUploadedFilesWithComments: FC<
  ShoWUploadedFilesWithCommentsProps
> = ({ isModalOpen, setIsModalOpen, files }) => {
  return (
    <Modal
      title={"Fayllarni ko'rish"}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen();
      }}
      width={"50%"}
    >
      <div className="mt-6   gap-3">
        <FilesBlock title="Yuklangan fayllar" files={files} />
      </div>
    </Modal>
  );
};
