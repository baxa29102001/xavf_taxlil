import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { BartarafEtishModal } from "@/components/common/BartarafEtishModal";
import { CustomUpload } from "@/components/common/CustomUpload";
import { ElliminationModal } from "@/components/common/ElliminationModal";
import { FileCreateModal } from "@/components/common/FileCreateModal";
import {
  ShowFilesByCategories,
  filesProp,
} from "@/components/common/ShowFilesByCategories";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
    title: "Tasdiqlagan shaxs",
    dataIndex: "reviewed_by",
    key: "reviewed_by",
  },
  {
    title: "Yuboruvchi shaxs",
    dataIndex: "created_by",
    key: "created_by",
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
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
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
  Bartaraf: {
    bgColor: "#EB6402",
    color: "#fff",
  },
};

const { TextArea } = Input;

type filesType = {
  file_type: filesProp[];
  files: filesProp[];
  measure_type: filesProp[];
  removed_type: filesProp[];
};

const PerformerDocumentDetail = () => {
  const [searchParams] = useSearchParams();
  const [contentData, setContentData] = useState<any>();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const [elliminationModal, setEllimationModal] = useState<any>({
    modal: false,
    item: {},
  });
  const [isClearCrieteraModal, setIsClearCrieteraModal] = useState<any>({
    modal: false,
    item: {},
  });
  const [clearCrieteraModal, setClearCrieteraModal] = useState<any>({
    modal: false,
    item: {},
  });

  const [fileAddModal, setFileAddModal] = useState<any>({
    modal: false,
    item: {},
  });

  const { config } = useDetectRoles();

  const { id } = useParams();

  const title = searchParams.get("title");

  const [cancelCommentModal, setCancelCommentModal] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<{
    modal: boolean;
    item: any;
  }>({
    modal: false,
    item: {},
  });

  const [files, setFiles] = useState<filesType>({
    file_type: [],
    files: [],
    measure_type: [],
    removed_type: [],
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
                color:
                  statusOptions[data.removed ? "Bartaraf" : data.status].color,
                backgroundColor:
                  statusOptions[data.removed ? "Bartaraf" : data.status]
                    .bgColor,
                whiteSpace: "nowrap",
              }}
              className="px-2 py-1 rounded-lg"
            >
              {data.removed ? "Bartaraf qilindi" : data.status}
            </span>
          ),

          file: (
            <button
              onClick={() => {
                setIsModalOpen({ modal: true, item: data });
              }}
              className="bg-[#DCE4FF] border rounded-md cursor-pointer border-[#4E75FF] text-[#4E75FF] py-2 px-3 flex items-center gap-2"
            >
              <FileIcon />
              Fayllar
            </button>
          ),

          edit: config?.role === ROLES.IJROCHI && (
            <>
              {data.status === "Tasdiqlandi" && (
                <div className="flex items-center gap-3">
                  <button
                    className="bg-[#DCE4FF]  rounded-md cursor-pointer   py-2 px-3 "
                    style={{
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setEllimationModal({
                        modal: true,
                        item: data,
                      });
                    }}
                  >
                    <PlusCircleOutlined /> Ko'rsatma
                  </button>
                  <button
                    className="bg-[#DCE4FF]  rounded-md cursor-pointer   py-2 px-3 "
                    style={{
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setClearCrieteraModal({
                        modal: true,
                        item: data,
                      });
                    }}
                  >
                    <PlusCircleOutlined /> Ko'rilgan chora
                  </button>

                  {!data.removed && (
                    <button
                      className="bg-[#DCE4FF] py-2 px-3 cursor-pointer"
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => {
                        setIsClearCrieteraModal({
                          modal: true,
                          item: data,
                        });
                      }}
                    >
                      Bartaraf etish
                    </button>
                  )}
                </div>
              )}
            </>
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

  const onFinishHandler = (data: any) => {
    const file = data.file[0].originFileObj;
    delete file.uid;
    const formData = new FormData();

    formData.append(
      "case",
      JSON.stringify(Number(isClearCrieteraModal.item.id))
    );
    formData.append("file", file);
    formData.append("comment", data.comment);

    axiosT
      .post("/scores/removed-scores/create/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });

        navigate(`/${config.mainUrl}/documents?status=Bartaraf qilingan`);

        setIsClearCrieteraModal({
          modal: false,
          item: {},
        });
        form.resetFields();
      })
      .catch(() => {
        setIsClearCrieteraModal({
          modal: false,
          item: {},
        });

        messageApi.open({
          type: "error",
          content: "Ma'lumot yaratishda xatolik",
        });
      });
  };

  useQuery(
    ["scoreHistoryFiles", isModalOpen.modal],
    () => axiosT.get(`/scores/cases/all/${id}/`),
    {
      enabled: isModalOpen.modal,
      onSuccess({ data }) {
        setFiles(data);
      },
    }
  );

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
          ) : contentData?.statusOption === "Jarayonda" ? (
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
          ) : null}
        </div>
      )}
      {config.role === ROLES.IJROCHI &&
        contentData?.statusOption === "Rad etildi" && (
          <div className="flex justify-end mt-5 gap-3">
            <button
              className="bg-[#4E75FF] text-white px-3 py-2 rounded-md cursor-pointer"
              onClick={() => {
                // startCaseHandler("Jarayonda");
                setFileAddModal({
                  modal: true,
                  item: contentData,
                });
              }}
            >
              Qayta yuborish
            </button>
          </div>
        )}

      <ShowFilesByCategories
        files={{
          file_type: files.file_type,
          measure_type: files.measure_type,
          removed_type: files.removed_type,
          files: files.files,
        }}
        isModalOpen={isModalOpen.modal}
        setIsModalOpen={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      />
      <Modal
        title={"Rad etish"}
        open={cancelCommentModal}
        footer={null}
        onCancel={() => {
          setCancelCommentModal(false);
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
      <FileCreateModal
        criteria={fileAddModal?.item}
        modalOpen={fileAddModal.modal}
        resendMode
        setModalOpen={() => {
          setFileAddModal({
            modal: false,
            item: {},
          });

          refetch();
        }}
      />
      <ElliminationModal
        criteria={elliminationModal?.item}
        typeChora="korsatma"
        modalOpen={elliminationModal.modal}
        setModalOpen={() => {
          setEllimationModal({
            modal: false,
            item: {},
          });
        }}
      />
      <ElliminationModal
        criteria={clearCrieteraModal?.item}
        typeChora="mamuriy"
        modalOpen={clearCrieteraModal.modal}
        setModalOpen={() => {
          setClearCrieteraModal({
            modal: false,
            item: {},
          });
        }}
      />
      {/* <Modal
        title={isClearCrieteraModal.item.criteria}
        open={isClearCrieteraModal.modal}
        onOk={() => {}}
        footer={null}
        onCancel={() => {
          setIsClearCrieteraModal({
            modal: false,
            item: {},
          });
        }}
      >
        <div className="mt-6">
          <Form form={form} onFinish={onFinishHandler}>
            <Form.Item
              label="Faylni yuklash"
              name={"file"}
              rules={[
                {
                  required: true,
                  message: "Faylni tanlang",
                },
              ]}
            >
              <CustomUpload />
            </Form.Item>{" "}
            <Form.Item label="Izoh" name={"comment"}>
              <TextArea />
            </Form.Item>
            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit">
                Yuborish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal> */}

      <BartarafEtishModal
        open={isClearCrieteraModal.modal}
        data={isClearCrieteraModal.item}
        closeHandler={() => {
          setIsClearCrieteraModal({
            modal: false,
            item: {},
          });
        }}
      />
    </div>
  );
};

export default PerformerDocumentDetail;
