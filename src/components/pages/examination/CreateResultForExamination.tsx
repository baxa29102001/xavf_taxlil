import axiosT from "@/api/axios";
import { CustomUpload } from "@/components/common/CustomUpload";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import { FC, useState } from "react";

const { TextArea } = Input;

interface CreateResultForExaminationProps {
  modalOpen: boolean;
  setModalOpen: () => void;
  criteria: any;
}
export const CreateResultForExamination: FC<
  CreateResultForExaminationProps
> = ({ modalOpen, criteria, setModalOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([{ id: 1 }]);

  const addFile = () => {
    setFiles([...files, { id: Date.now() }]);
  };

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const onFinish = (dataPayload: any) => {
    setLoading(true);
    const formData = new FormData();

    const filesList = dataPayload.files;

    filesList.forEach((item: any) => {
      const file = item.files[0].originFileObj;
      delete file.uid;

      if (dataPayload.type == 2) {
        formData.append("file_types", item.file_types);
      }

      formData.append("files", file);
      formData.append("comments", item.comments);
    });

    formData.append("type", dataPayload.type);
    formData.append("tekshiruv", criteria.id);
    formData.append("description", dataPayload.description);

    axiosT
      .post("/examination/result/create/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });
        form.resetFields();
      })
      .catch(() => {
        console.log("err");
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
        setModalOpen();
      });
  };
  return (
    <>
      {contextHolder}

      <Modal
        title={"Natijani kiritish"}
        open={modalOpen}
        footer={null}
        okText="Yuborish"
        cancelText="Bekor qilish"
        width={"60%"}
        onCancel={() => {
          setModalOpen();
          form.resetFields();
        }}
      >
        <>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Ko'rsatma turi" name={["type"]}>
              <Select
                allowClear
                placeholder="Ko'rsatma turini tanlang"
                options={[
                  {
                    label: "Tekshirish natijasi",
                    value: 1,
                  },
                  {
                    label: "Tekshirish natijasi bo'yicha choralar",
                    value: 2,
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Tavsiflar"
              className="col-span-2"
              name={"description"}
            >
              <TextArea />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <Card key={file.id} style={{ marginBottom: 10 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) => {
                        const fileTypes = getFieldValue(["type"]);

                        return fileTypes === 2 ? (
                          <>
                            <Form.Item
                              label="Ko'rsatma turi"
                              name={["files", index, "file_types"]}
                            >
                              <Select
                                allowClear
                                placeholder="Ko'rsatma turini tanlang"
                                options={[
                                  {
                                    label: "Ko'rsatma",
                                    value: 1,
                                  },
                                  {
                                    label: "Taqdimnoma",
                                    value: 2,
                                  },
                                  {
                                    label: "Ma'muriy chora",
                                    value: 3,
                                  },
                                  {
                                    label: "Intizomiy chora",
                                    value: 4,
                                  },
                                ]}
                              />
                            </Form.Item>
                          </>
                        ) : null;
                      }}
                    </Form.Item>
                    <Form.Item
                      label="Fayl"
                      name={["files", index, "files"]}
                      rules={[
                        { required: true, message: "Fayl kiritish majburiy" },
                      ]}
                    >
                      <CustomUpload multiple={false} />
                    </Form.Item>
                    <Form.Item
                      label="Izoh"
                      className="col-span-2"
                      name={["files", index, "comments"]}
                    >
                      <TextArea />
                    </Form.Item>

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
            <div className="mb-4"></div>

            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Yuborish
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};
