import axiosT from "@/api/axios";
import { FileAddIcon, FileIcon } from "@/assets/icons";
import { DeleteOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { CustomUpload } from "../common/CustomUpload";
import { FileCreateModal } from "../common/FileCreateModal";

const { TextArea } = Input;
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
  // {
  //   title: "Fayl",
  //   dataIndex: "file",
  //   key: "file",
  // },
  {
    title: "Fayl biriktirish",
    dataIndex: "file_add",
    key: "file_add",
  },
];

export const OrganizationDetail = () => {
  const { id, organizationId } = useParams();
  const [content, setContent] = useState<any>({
    overall_score: 0,
    organization_name: "",
    criteria_details: [],
  });
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState<any>({
    modal: false,
    item: {},
  });
  const [fileAddModal, setFileAddModal] = useState<any>({
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

              file_add: (
                <button
                  className="py-2 px-3 flex items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer"
                  onClick={() => {
                    handleAddFile(item);
                  }}
                >
                  <FileAddIcon />
                  Fayl biriktirish
                </button>
              ),
            })),
          ],
        });
      },
    }
  );

  const handleAddFile = (item: any) => {
    setFileAddModal({
      modal: true,
      item,
    });
  };

  return (
    <div className="px-4 py-5">
      {contextHolder}
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
              </>
            ),
          },
        ]}
      />
      <Modal
        title={isModalOpen.item.name}
        open={isModalOpen.modal}
        onOk={() => {}}
        onCancel={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      ></Modal>

      <FileCreateModal
        criteria={fileAddModal?.item}
        modalOpen={fileAddModal.modal}
        setModalOpen={() => {
          setFileAddModal({
            modal: false,
            item: {},
          });
        }}
      />
    </div>
  );
};
