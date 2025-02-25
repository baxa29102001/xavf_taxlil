import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Collapse, Form, Input, Modal, Table, message } from "antd";
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

const { TextArea } = Input;

const PerformerDocumentDetail = () => {
  const [searchParams] = useSearchParams();
  const [contentData, setContentData] = useState<any>();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const { config } = useDetectRoles();

  const { id } = useParams();

  const title = searchParams.get("title");

  const [cancelCommentModal, setCancelCommentModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<any>({
    modal: false,
    item: {},
  });

  const { refetch } = useQuery(
    ["documentDetailId"],
    () => axiosT.get("/scores/cases/all/" + id, {}),
    {
      onSuccess({ data }) {
        setContentData({
          ...data,
          index: 1,
          reviewed_by: data?.reviewed_by || "Ma'lum emas",
          statusOption: data.status,
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

  const startCaseHandler = (status: any) => {
    axiosT
      .patch(`/scores/masul/cases/` + contentData.id + "/", {
        status,
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli o'zgartirildi",
        });

        refetch();
      });
  };

  const onFinish = (data: any) => {
    axiosT
      .patch(`/scores/masul/cases/` + contentData.id + "/", {
        status: "Rad etildi",
        comment: data.comment,
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli o'zgartirildi",
        });

        setCancelCommentModal(false);

        refetch();
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
                <Table
                  columns={columns}
                  dataSource={[contentData]}
                  pagination={false}
                />
              </>
            ),
          },
        ]}
      />
      {config.role === ROLES.MASUL && (
        <div className="flex justify-end mt-5 gap-3">
          {contentData?.statusOption === "Yangi" ? (
            <button
              className="bg-[#4E75FF] text-white px-3 py-2 rounded-md cursor-pointer"
              onClick={() => {
                startCaseHandler("Jarayonda");
              }}
            >
              Boshlash
            </button>
          ) : (
            <>
              <button
                className="bg-[#4E75FF] text-white px-3 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  startCaseHandler("Tasdiqlandi");
                }}
              >
                Tasdiqlash
              </button>
              <button
                className="bg-[#EF4444] text-white px-3 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  setCancelCommentModal(true);
                }}
              >
                Rad etish
              </button>
            </>
          )}
        </div>
      )}
      {config.role === ROLES.IJROCHI && (
        <button
          className="bg-[#4E75FF] text-white px-3 py-2 rounded-md cursor-pointer"
          onClick={() => {
            startCaseHandler("Jarayonda");
          }}
        >
          Boshlash
        </button>
      )}
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
      </Modal>{" "}
      <Modal
        title={"Rad etish"}
        open={cancelCommentModal}
        footer={null}
        onCancel={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="comment"
            label="Izoh kiriting"
            rules={[{ required: true, message: "Izoh kiriting" }]}
          >
            <TextArea rows={6} placeholder="Izoh kiriting" />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Yuborish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PerformerDocumentDetail;
