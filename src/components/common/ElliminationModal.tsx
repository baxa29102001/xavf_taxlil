import axiosT from "@/api/axios";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { FC, useState } from "react";
import { CustomUpload } from "./CustomUpload";

const { TextArea } = Input;

interface ElliminationModalProps {
  modalOpen: boolean;
  setModalOpen: () => void;
  criteria: any;
  typeChora: "korsatma" | "mamuriy";
}
export const ElliminationModal: FC<ElliminationModalProps> = ({
  modalOpen,
  setModalOpen,
  typeChora,
  criteria,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    const formData = new FormData();
    delete values.uploaded_files[0].originFileObj.uid;
    formData.append("file", values.uploaded_files[0].originFileObj);
    formData.append("case_id", criteria?.id);
    formData.append("description", values?.description);
    if (typeChora === "korsatma") {
      formData.append("file_type", values.file_type);
    } else {
      formData.append("measure_type", values.measure_type);
    }
    axiosT
      .post("/scores/cases/approved/upload-file/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });
        setModalOpen();
        form.resetFields();
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Ma'lumot yaratishda xatolik",
        });
      })
      .finally(() => setLoading(false));
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
        onCancel={() => {
          setModalOpen();
        }}
      >
        <>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Fayl"
                name={"uploaded_files"}
                rules={[{ required: true, message: "Fayl kiritish majburiy" }]}
              >
                <CustomUpload multiple={false} />
              </Form.Item>
              {typeChora === "mamuriy" ? (
                <Form.Item label="Ko'rilgan chora" name={"measure_type"}>
                  <Select
                    allowClear
                    placeholder="Ko'rilgan chorani tanlang"
                    options={[
                      {
                        label: "Mamuriy",
                        value: 1,
                      },
                      {
                        label: "Intizomiy",
                        value: 2,
                      },
                    ]}
                  />
                </Form.Item>
              ) : (
                <Form.Item label="Ko'rsatma turi" name={"file_type"}>
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
              )}
              <Form.Item label="Tavsiflar" name={"description"}>
                <TextArea />
              </Form.Item>
            </div>

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
