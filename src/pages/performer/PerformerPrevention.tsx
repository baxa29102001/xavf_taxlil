import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { CustomUpload } from "@/components/common/CustomUpload";
import { getQuarter } from "@/utils/quater";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import { useState } from "react";
import { set } from "react-hook-form";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "№",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Tashkilot nomi",
    dataIndex: "organization_name",
    key: "organization_name",
  },
  {
    title: "Tashkilot STIR",
    dataIndex: "inn",
    key: "inn",
  },
  {
    title: "Muddati",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Kategoriyasi",
    dataIndex: "category",
    key: "category",
  },

  {
    title: "Ma'sul shaxs",
    dataIndex: "created_by",
    key: "created_by",
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
  "Low risk": {
    color: "#CEFFD2",
    title: "Xavfi past",
  },
  "High risk": {
    color: "#FFD9D9",
    title: "Xavfi yuqori",
  },
  "Moderate risk": {
    color: "#FBFFBC",
    title: "Xavfi o’rta",
  },
};

const { TextArea } = Input;

const PerformerPrevention = () => {
  const [documentsData, setDocumentsData] = useState([]);
  const [form] = Form.useForm();
  const [organizationsList, setOrganizationList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [newPreventionModal, setNewPreventionModal] = useState(false);

  const { refetch } = useQuery(
    ["prevention"],
    () => axiosT.get("/prevention/list/"),
    {
      onSuccess({ data }) {
        const arr = data.map((item: any, index: number) => ({
          ...item,
          index: index + 1,

          edit: (
            <button
              className="text-[#4E75FF] bg-white px-6 py-2 border border-[#4E75FF] rounded-md cursor-pointer"
              onClick={() => {
                navigate("/prevention/" + item.id);
              }}
            >
              Batafsil
            </button>
          ),

          file: (
            <a
              className="py-2 px-3 flex   items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer"
              href={item.file}
              target="_blank"
            >
              <FileIcon />
              Fayl
            </a>
          ),
        }));

        setDocumentsData(arr);
      },
    }
  );
  useQuery(
    ["preventionOrganization"],
    () =>
      axiosT.get("/prevention/organization-list/", {
        params: {
          year: 2024,
          quarter: getQuarter(new Date().getMonth() + 1),
        },
      }),
    {
      onSuccess({ data }) {
        setOrganizationList(data);
      },
    }
  );

  const onFinish = (dataPayload: any) => {
    const data = {
      ...dataPayload,
      date: dataPayload.date.format("YYYY-MM-DD"),
    };
    const formData = new FormData();
    Object.keys(data).forEach((item: any) => {
      if (item === "file") return;
      formData.append(item, data[item]);
    });

    data.file.forEach((item: any) => {
      delete item.originFileObj.uid;
      formData.append("file", item.originFileObj);
    });
    axiosT
      .post("/prevention/create/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });
        refetch();
        setNewPreventionModal(false);
        form.resetFields();
      })
      .catch((err) => {
        console.log("err");
      });
  };

  return (
    <div className="px-4 py-5">
      {contextHolder}
      <div className="flex items-center justify-between mb-4.5">
        <h2 className="text-[#262626] text-2xl font-semibold Monserrat ">
          Profilatika
        </h2>

        <button
          className="bg-[#4E75FF] rounded-sm py-2 px-6 text-white cursor-pointer"
          onClick={() => {
            setNewPreventionModal(true);
          }}
        >
          + Ma’lumot kiritish
        </button>
      </div>

      <div className="bg-white rounded-2xl p-3">
        <Table columns={columns} dataSource={documentsData} />
      </div>

      <Modal
        title={"Profilatika yaratish"}
        open={newPreventionModal}
        footer={null}
        onCancel={() => setNewPreventionModal(false)}
        onClose={() => setNewPreventionModal(false)}
      >
        <>
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            name="newPrevention"
          >
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Tashkilot nomi"
                className="col-span-2"
                rules={[{ required: true, message: "Majburiy maydon" }]}
                name={"organization"}
              >
                <Select
                  placeholder="Tashkilotni tanlash"
                  options={organizationsList.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                    status: item.risk_status,
                    inn: item.inn,
                  }))}
                  optionRender={(optiondata: any) => {
                    const option = optiondata.data as any;

                    return (
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs">
                          {option.label} ({option.inn})
                        </h2>

                        <span
                          style={{
                            backgroundColor:
                              statusOptions[option.status]?.color,
                          }}
                          className="px-2 py-1 rounded-lg text-black"
                        >
                          {statusOptions[option.status]?.title}
                        </span>
                      </div>
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Muddati"
                rules={[{ required: true, message: "Majburiy maydon" }]}
                name={"date"}
              >
                <DatePicker
                  placeholder="Muddatni tanlash"
                  style={{ width: "100%" }}
                />
              </Form.Item>{" "}
              <Form.Item
                label="Profilaktika turi"
                name={"type"}
                rules={[{ required: true, message: "Majburiy maydon" }]}
              >
                <Select
                  placeholder="Tanlash"
                  options={[
                    {
                      value: "seminar",
                      label: "Seminar",
                    },
                    {
                      value: "ommaviy muhokamalar",
                      label: "Ommaviy Muhokamalar",
                    },
                    {
                      value: "OAVlarda chiqishlar",
                      label: "OAVlarda Chiqishlar",
                    },
                    {
                      value: "ochiq eshiklar",
                      label: "Ochiq Eshiklar",
                    },
                    {
                      value: "tarqatma materiallarni tarqatish",
                      label: "Tarqatma Materiallarni Tarqatish",
                    },
                    {
                      value: "qo‘llanma, tavsiya va boshqa xatlar yuborish",
                      label: "Qo‘llanma, Tavsiya va Boshqa Xatlar Yuborish",
                    },
                  ]}
                />
              </Form.Item>{" "}
              <Form.Item label="Fayl" name={"file"}>
                <CustomUpload multiple />
              </Form.Item>
              <Form.Item
                label="Tavsiflar"
                className="col-span-2"
                rules={[{ required: true, message: "Majburiy maydon" }]}
                name={"description"}
              >
                <TextArea />
              </Form.Item>
            </div>
            <Form.Item label={null}>
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

export default PerformerPrevention;
