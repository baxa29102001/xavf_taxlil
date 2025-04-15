import { FC } from "react";
import { FilesBlock, filesProp } from "./ShowFilesByCategories";
import { Modal } from "antd";

interface ShoWUploadedFilesWithCommentsProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  files: {
    files: filesProp[];
    result_files: filesProp[];
    measure_files: filesProp[];
  };
}

const fileType = new Map([
  [1, "Ko'rsatma"],
  [2, "Taqdimnoma"],
  [3, "Ma'muriy chora"],
  [4, "Intizomiy chora"],
]);

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
      width={"80%"}
    >
      <div className="my-6 gap-3">
        <FilesBlock title="Yuklangan fayllar" files={files.files} />
        <FilesBlock title="Tekshirish natijalari" files={files.result_files} />
        <FilesBlock
          title="Ko'rilgan choralar"
          files={files.measure_files}
          extraField={(item) => {
            return (
              <>
                <p>
                  <span className="font-semibold">Hujjat turi:</span>
                  {fileType.get(item.file_type)}
                </p>
              </>
            );
          }}
        />
      </div>
    </Modal>
  );
};
