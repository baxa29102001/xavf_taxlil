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
  {
    title: "Fayl",
    dataIndex: "file",
    key: "file",
  },
  {
    title: "Fayl biriktirish",
    dataIndex: "file_add",
    key: "file_add",
  },
];

export const OrganizationDetail = () => {
  const { id, organizationId } = useParams();
  const [form] = Form.useForm();
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

  const [files, setFiles] = useState([{ id: 1 }]);

  const addFile = () => {
    setFiles([...files, { id: Date.now() }]);
  };

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const onFinish = (values: any) => {
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
    formData.append("criteria", JSON.stringify(fileAddModal?.item?.id));

    axiosT.post("/scores/score-create/", formData).then((res) => {
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

  const handleOpenModal = (item: any) => {
    axiosT
      .get("/scores/" + organizationId + "/" + id + "/cases/")
      .then((res: any) => {
        setIsModalOpen({
          modal: true,
          item,
        });
      });
  };

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
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
