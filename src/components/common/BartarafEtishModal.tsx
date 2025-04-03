import { Form, Modal, Input, Button, Space, message, Card } from "antd";
import { CustomUpload } from "./CustomUpload";
import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axiosT from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useDetectRoles } from "@/hooks/useDetectRoles";

const { TextArea } = Input;

interface BartarafEtishModalProps {
  open: boolean;
  closeHandler: () => void;
  data: any;
}
export const BartarafEtishModal = ({
  open,
  data,
  closeHandler,
}: BartarafEtishModalProps) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([{ id: 1 }]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { config } = useDetectRoles();

  const addFile = () => {
    setFiles([...files, { id: Date.now() }]);
  };

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };
  const onFinishHandler = (payload: any) => {
    const formData = new FormData();

    const filesList = payload.files;

    filesList.forEach((item: any) => {
      const file = item.file[0].originFileObj;
      delete file.uid;
      formData.append("files", file);
      formData.append("comments", item.comment);
    });

    formData.append("case", JSON.stringify(Number(data.id)));

    axiosT
      .post("/scores/removed-scores/create/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });

        navigate(`/${config.mainUrl}/documents?status=Bartaraf qilingan`);
        closeHandler();
        form.resetFields();
      })
      .catch(() => {
        closeHandler();

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
        title={data.criteria}
        open={open}
        onOk={() => {}}
        footer={null}
        onCancel={() => {
          closeHandler();
        }}
        width={"50%"}
      >
        <div className="mt-6">
          <Form form={form} onFinish={onFinishHandler}>
            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <Card key={file.id} style={{ marginBottom: 10 }}>
                  <Space direction="vertical">
                    <Form.Item
                      label="Faylni yuklash"
                      name={["files", index, "file"]}
                      rules={[
                        {
                          required: true,
                          message: "Faylni tanlang",
                        },
                      ]}
                    >
                      <CustomUpload />
                    </Form.Item>

                    <Form.Item label="Izoh" name={["files", index, "comment"]}>
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
            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit">
                Yuborish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
