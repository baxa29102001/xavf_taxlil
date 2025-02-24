import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { LeftOutlined } from "@ant-design/icons";
import { Collapse, Modal, Table } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const columns = [
  {
    title: "№",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Baholash ko‘rsatkichlari",
    dataIndex: "criteria",
    key: "criteria",
  },
  {
    title: "Javob yuborgan shaxs",
    dataIndex: "reviewed_by",
    key: "reviewed_by",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Fayl",
    dataIndex: "file",
    key: "file",
  },
];

const statusOptions: any = {
  Yangi: {
    bgColor: "#CCD8FF",
    color: "#003CFF",
  },
  Jarayonda: {
    bgColor: "#FFF8DD",
    color: "#CCB243",
  },
  Tasdiqlandi: {
    bgColor: "#D2FBF0",
    color: "#18BA92",
  },

  "Rad etildi": {
    bgColor: "#FDD4D4",
    color: "#F42829",
  },
};

const PerformerDocumentDetail = () => {
  const [searchParams] = useSearchParams();
  const [contentData, setContentData] = useState<any>();
  const navigate = useNavigate();

  const { id } = useParams();

  const title = searchParams.get("title");

  const [isModalOpen, setIsModalOpen] = useState<any>({
    modal: false,
    item: {},
  });

  useQuery(
    ["documentDetailId"],
    () => axiosT.get("/scores/cases/all/" + id, {}),
    {
      onSuccess({ data }) {
        setContentData({
          ...data,
          index: 1,
          reviewed_by: data?.reviewed_by || "Ma'lum emas",
          status: (
            <span
              style={{
                color: statusOptions[data.status].color,
                backgroundColor: statusOptions[data.status].bgColor,
              }}
              className="px-2 py-1 rounded-lg"
            >
              {data.status}
            </span>
          ),

          file: (
            <button
              onClick={() => setIsModalOpen({ modal: true, item: data })}
              className="bg-[#DCE4FF] border rounded-md cursor-pointer border-[#4E75FF] text-[#4E75FF] py-2 px-3 flex items-center gap-2"
            >
              <FileIcon />
              Fayllar
            </button>
          ),
        });
      },
    }
  );
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
          {title}
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
                <Table columns={columns} dataSource={[contentData]} />
              </>
            ),
          },
        ]}
      />

      <Modal
        title={isModalOpen.item.criteria}
        open={isModalOpen.modal}
        onOk={() => {}}
        onCancel={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default PerformerDocumentDetail;
