import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { CustomUpload } from "@/components/common/CustomUpload";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";
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
  const [fileData, setFileData] = useState([]);
  const [form] = Form.useForm();
  const [fileAddModal, setFileAddModal] = useState<any>({
    modal: false,
    item: {},
  });

  const { config } = useDetectRoles();

  const { id } = useParams();

  const title = searchParams.get("title");

  const [cancelCommentModal, setCancelCommentModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<any>({
    modal: false,
    item: {},
  });

  const [files, setFiles] = useState([{ id: 1 }]);

  const addFile = () => {
    setFiles([...files, { id: Date.now() }]);
  };

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const onFinishFileAdd = (values: any) => {
    const formData = new FormData();

    const arr = values.files.map((value: any) => {
      delete value.uploaded_files[0].originFileObj.uid;
      const data = value.uploaded_files[0].originFileObj;
      return {
        ...value,
        deadlines: value.deadlines.format("YYYY-MM-DD"),
        uploaded_files: data,
      };
    });

    arr.forEach((item: any) => {
      Object.keys(item).forEach((key: any) => {
        formData.append(key, item[key]);
      });
    });

    formData.append("organization", JSON.stringify(Number(id)));
    formData.append("criteria", JSON.stringify(contentData?.id));

    axiosT
      .patch(`/scores/cases/${contentData?.id}/resend/`, formData)
      .then((res) => {
        console.log("res", res);

        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });
        setFileAddModal({
          modal: false,
          item: {},
        });
        form.resetFields();
      });
  };

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
              onClick={() => {
                setIsModalOpen({ modal: true, item: data });
              }}
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
      <Modal
        title={isModalOpen.item.criteria}
        open={isModalOpen.modal}
        footer={null}
        onCancel={() => {
          setIsModalOpen({
            modal: false,
            item: {},
          });
        }}
      >
        <div className="mt-6">
          {isModalOpen?.item?.files?.map((file: any, index: number) => {
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
      <Modal
        title={"Fayl biriktirish"}
        open={fileAddModal.modal}
        footer={null}
        okText="Yuborish"
        cancelText="Bekor qilish"
        width={"90%"}
        onCancel={() => {
          setFileAddModal({
            modal: false,
            item: {},
          });
        }}
      >
        <>
          <Form form={form} layout="vertical" onFinish={onFinishFileAdd}>
            <div className="grid grid-cols-4 gap-4">
              {files.map((file, index) => (
                <Card key={file.id} style={{ marginBottom: 10 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Form.Item
                      label="Fayl"
                      name={["files", index, "uploaded_files"]}
                      rules={[
                        { required: true, message: "Bandlar sonini kiriting!" },
                      ]}
                    >
                      <CustomUpload multiple={false} />
                    </Form.Item>
                    <Form.Item
                      label="Bandlar soni"
                      name={["files", index, "clauses_numbers"]}
                      rules={[
                        { required: true, message: "Bandlar sonini kiriting!" },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        placeholder="Bandlar soni"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Tugash sanasi"
                      name={["files", index, "deadlines"]}
                      rules={[
                        { required: true, message: "Tugash sanasini tanlang!" },
                      ]}
                    >
                      <DatePicker
                        format="YYYY-MM-DD"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Ko'rsatma turi"
                      name={["files", index, "file_types"]}
                      rules={[
                        {
                          required: true,
                          message: "Ko'rsatma turini tanlang!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Ko'rsatma turini tanlang"
                        options={[
                          {
                            label: "Taqdimnoma",
                            value: 1,
                          },
                          {
                            label: "Ko'rsatma",
                            value: 2,
                          },
                        ]}
                      />
                    </Form.Item>

                    {/* Faylni o‘chirish tugmasi */}
                    {files.length > 1 && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFile(file.id)}
                      >
                        O'chirish
                      </Button>
                    )}
                  </Space>
                </Card>
              ))}
            </div>

            <Button
              type="dashed"
              onClick={addFile}
              icon={<PlusOutlined />}
              block
            >
              Yangi fayl qo‘shish
            </Button>

            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit">
                Yuborish
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  );
};

export default PerformerDocumentDetail;
