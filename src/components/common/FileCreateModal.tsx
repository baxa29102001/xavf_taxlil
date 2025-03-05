import axiosT from "@/api/axios";
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
import { useParams } from "react-router-dom";
import { CustomUpload } from "./CustomUpload";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface FileCreateModalProps {
  modalOpen: boolean;
  setModalOpen: () => void;
  criteria: any;
}
export const FileCreateModal: FC<FileCreateModalProps> = ({
  modalOpen,
  setModalOpen,
  criteria,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { id, organizationId } = useParams();

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
        deadlines: value?.deadlines?.format("YYYY-MM-DD"),
        uploaded_files: data,
      };
    });

    arr.forEach((item: any) => {
      Object.keys(item).forEach((key: any) => {
        if (item[key]) formData.append(key, item[key] ? item[key] : "");
      });
    });

    formData.append("organization", JSON.stringify(Number(id)));
    formData.append("criteria", JSON.stringify(criteria?.id));

    axiosT
      .post("/scores/score-create/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });
        setModalOpen();
        form.resetFields();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Ma'lumot yaratishda xatolik",
        });
      });
  };
  return (
    <>
      {contextHolder}

      <Modal
        title={"Fayl biriktirish"}
        open={modalOpen}
        footer={null}
        okText="Yuborish"
        cancelText="Bekor qilish"
        width={"90%"}
        onCancel={() => {
          setModalOpen();
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
                        { required: true, message: "Fayl kiritish majburiy" },
                      ]}
                    >
                      <CustomUpload multiple={false} />
                    </Form.Item>

                    <Form.Item
                      label="Ko'rsatma turi"
                      name={["files", index, "file_types"]}
                    >
                      <Select
                        allowClear
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
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue, getFieldsValue }) => {
                        const fileTypes = getFieldValue([
                          "files",
                          index,
                          "file_types",
                        ]);

                        return fileTypes ? (
                          <>
                            <Form.Item
                              label="Bandlar soni"
                              name={["files", index, "clauses_numbers"]}
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
                            >
                              <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                              />
                            </Form.Item>

                            <Form.Item
                              label="Tavsiflar"
                              className="col-span-2"
                              name={["files", index, "description"]}
                            >
                              <TextArea />
                            </Form.Item>
                          </>
                        ) : null;
                      }}
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
    </>
  );
};
