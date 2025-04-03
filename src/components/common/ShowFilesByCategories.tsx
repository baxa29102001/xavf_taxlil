import { FileIcon } from "@/assets/icons";
import { Modal } from "antd";
import { FC, JSX } from "react";

type FileExactTypes = "Submission" | "Instruction" | "Ma'muriy" | "Intizomiy";

export type filesProp = {
  id: number;
  file_url: string;
  file_number: string;
  description: string;
  comment?: string;
  created_at?: string;
  rejected_at?: string;
  file_type: FileExactTypes;
};

interface ShowFilesByCategoriesProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  files: {
    file_type: filesProp[];
    files: filesProp[];
    measure_type: filesProp[];
    removed_type: filesProp[];
    rejection_history?: filesProp[];
  };
}

export const FilesBlock = ({
  files,
  title,
  hideFile,
  extraField,
}: {
  title: string;
  files: filesProp[];
  hideFile?: boolean;
  extraField?: (data: filesProp) => JSX.Element;
}) => {
  return (
    <div className="p-3 border border-black/30 rounded-xl mb-6 ">
      <h2 className="font-semibold text-lg">{title}</h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {files.map((item, index) => (
          <div className="mb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p>{index + 1}.</p>
                <div>
                  <p>
                    <span className="font-semibold">Sana: </span>
                    {item.created_at || item.rejected_at}
                  </p>
                  <p className="flex items-center gap-1 w-full" style={{}}>
                    <span className="font-semibold">Izoh:</span>
                    <span className="break-all">
                      {item.description || item.comment}
                    </span>
                  </p>

                  {extraField && extraField(item)}
                </div>
              </div>
              {!hideFile && (
                <a href={item.file_url} target="_blank">
                  <div className="py-2 px-3 flex items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer ">
                    <FileIcon />
                    Fayl
                  </div>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renameObject: any = {
  Instruction: "Ko'rsatma",
  Submission: "Taqdimnoma",
};
export const ShowFilesByCategories: FC<ShowFilesByCategoriesProps> = ({
  isModalOpen,
  setIsModalOpen,
  files,
}) => {
  return (
    <Modal
      title={"Fayllarni ko'rish"}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen();
      }}
      width={"100%"}
    >
      <div className="mt-6 grid grid-cols-2 gap-3">
        <FilesBlock title="Fayl biriktirlishi" files={files.files} />
        <FilesBlock
          title="Ko'rilgan choralar fayli"
          files={files.measure_type}
          extraField={(item) => {
            return (
              <>
                <p>
                  <span className="font-semibold">Hujjat turi:</span>
                  {item.file_type}
                </p>
              </>
            );
          }}
        />
        <FilesBlock
          title="Ko'rsatma fayllari"
          files={files.file_type}
          extraField={(item) => {
            return (
              <>
                <p>
                  <span className="font-semibold">Hujjat turi:</span>
                  {renameObject[item.file_type]}
                </p>
              </>
            );
          }}
        />
        <FilesBlock
          title="Bartaraf etilgan fayllari"
          files={files.removed_type}
        />{" "}
        <FilesBlock
          title="Rad etilish izohi"
          files={files.rejection_history || []}
          hideFile
        />
      </div>
    </Modal>
  );
};
