import { Modal } from "antd";
import { FC } from "react";

type FileExactTypes = "Submission" | "Instruction" | "Ma'muriy" | "Intizomiy";

type filesProp = {
  id: number;
  file_url: string;
  file_number: string;
  desciption: string;
  file_type: FileExactTypes;
};

interface ShowFilesByCategoriesProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  files: {
    file_type: filesProp[];
    measure_type: {};
  };
}

export const ShowFilesByCategories: FC<ShowFilesByCategoriesProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <Modal
      title={"Fayllarni ko'rish"}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen();
      }}
    >
      <div className="mt-6"></div>
    </Modal>
  );
};
