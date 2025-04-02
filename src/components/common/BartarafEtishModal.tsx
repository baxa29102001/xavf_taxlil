import { Form, Modal, Input, Button, Space } from "antd";
import { CustomUpload } from "./CustomUpload";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

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

  const addFile = () => {
    setFiles([...files, { id: Date.now() }]);
  };

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };
  const onFinishHandler = (data: any) => {};
  return (
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
            {files.map((item, index) => (
              <Space direction="vertical">
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
                </Form.Item>

                <Form.Item label="Izoh" name={"comment"}>
                  <TextArea />
                </Form.Item>
              </Space>
            ))}
          </div>

          <Button type="dashed" onClick={addFile} icon={<PlusOutlined />} block>
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
  );
};
