import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { LeftOutlined } from "@ant-design/icons";
import { Collapse, Modal, Table } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
  {
    title: "№",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Baholash ko‘rsatkichlari",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ball",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "Miqdori",
    dataIndex: "case_count",
    key: "case_count",
  },
  {
    title: "Fayl",
    dataIndex: "file",
    key: "file",
  },
];

const PerformerEntityOrganizationDetail = () => {
  const { id, organizationId } = useParams();
  const [content, setContent] = useState<any>({
    overall_score: 0,
    organization_name: "",
    criteria_details: [],
  });

  const [fileData, setFileData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState<any>({
    modal: false,
    item: {},
  });

  const navigate = useNavigate();
  useQuery(
    ["detailId"],
    () => axiosT.get("/criterias/" + organizationId + "/" + id + "/list", {}),
    {
      onSuccess({ data }) {
        setContent({
          overall_score: data.overall_score,
          organization_name: data.organization_name,
          criteria_details: [
            ...data.criteria_details.map((item: any, index: any) => ({
              ...item,
              index: index + 1,
              file: (
                <button
                  className="py-2 px-3 flex items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer"
                  onClick={() => {
                    handleOpenModal(item);
                  }}
                >
                  <FileIcon />
                  Fayl
                </button>
              ),
            })),
          ],
        });
      },
    }
  );

  const handleOpenModal = (item: any) => {
    axiosT.get("/scores/" + id + "/" + item.id + "/cases/").then(({ data }) => {
      setFileData(data);
      setIsModalOpen({
        modal: true,
        item,
      });
    });
  };

  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-2 mb-4.5">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="cursor-pointer"
        >
          <LeftOutlined
            style={{
              fontSize: "20px",
            }}
          />
        </button>
        <h2 className="text-[#262626] text-2xl font-semibold Monserrat ">
          {content.organization_name}
        </h2>
      </div>

      <Collapse
        accordion
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Olingan ballar tasnifi",
            children: (
              <>
                <Table
                  columns={columns}
                  dataSource={content.criteria_details}
                />

                <div className="bg-[#DAE5FF] rounded-[8px] py-3 px-4 flex items-center justify-between">
                  <h3 className="font-bold">Jami</h3>
                  <p className="font-bold text-2xl">{content.overall_score}</p>
                </div>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={isModalOpen.item.name}
        open={isModalOpen.modal}
        onOk={() => {}}
        footer={null}
        onCancel={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      >
        <div className="mt-6">
          {fileData.map((item: any, index: number) => {
            const file = item.files[0];
            return (
              <div className="flex items-center justify-between">
                <p>
                  {index + 1}. {file?.description}, {file?.deadline}
                  {","}
                  {file?.clauses_number}
                </p>

                <a href={file?.file_url} target="_blank">
                  <div className="py-2 px-3 flex items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer ">
                    <FileIcon />
                    Fayl
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default PerformerEntityOrganizationDetail;
