import axiosT from "@/api/axios";
import { FileIcon } from "@/assets/icons";
import { CustomUpload } from "@/components/common/CustomUpload";
import { ShoWUploadedFilesWithComments } from "@/components/common/ShowUploadedFileWithComments";
import { CreateResultForExamination } from "@/components/pages/examination/CreateResultForExamination";
import { ROLES } from "@/constants/enum";
import { useDetectRoles } from "@/hooks/useDetectRoles";
import { getQuarter } from "@/utils/quater";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";
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
    dataIndex: "organization_inn",
    key: "organization_inn",
  },
  // {
  //   title: "Oxirgi marta profilatika sanasi",
  //   dataIndex: "last_profilaktika_date",
  //   key: "last_profilaktika_date",
  // },
  {
    title: "Boshlangan sanasi",
    dataIndex: "start_date",
    key: "start_date",
  },
  {
    title: "Tugash sanasi",
    dataIndex: "end_date",
    key: "end_date",
  },

  {
    title: "Inspektor",
    dataIndex: "inspector",
    key: "inspector",
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
const { Option } = Select;

const ExaminationPage = () => {
  const [documentsData, setDocumentsData] = useState([]);
  const [form] = Form.useForm();
  const [organizationsList, setOrganizationList] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [organization_id, setOrganization_id] = useState<number>();
  const [inspectorsForRandomList, setInspectorsForRandomList] = useState([]);

  const [organizationParams, setOrganizationParams] = useState({
    category_id: undefined,
    type: undefined,
  });

  const [loading, setLoading] = useState(false);
  const { config } = useDetectRoles();

  const [newPreventionModal, setNewPreventionModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [resultModal, setResultModal] = useState({
    modal: false,
    item: {},
  });
  const [activeFiles, setActiveFile] = useState([]);

  const [files, setFiles] = useState([{ id: 1 }]);

  const addFile = () => {
    setFiles([...files, { id: Date.now() }]);
  };

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  useQuery(
    ["categoriesEntites"],
    () => axiosT.get("/organizations/categories/"),
    {
      onSuccess({ data }) {
        setCategories(data);
      },
    }
  );
  const { refetch } = useQuery(
    ["examination"],
    () => axiosT.get("/examination/list/"),
    {
      onSuccess({ data }) {
        const arr = data.map((item: any, index: number) => ({
          ...item,
          index: index + 1,
          inspector: (
            <>
              {item?.inspector.map((item: any) => (
                <p>{item.full_name}</p>
              ))}
            </>
          ),

          file: (
            <button
              className="py-2 px-3 flex   items-center gap-2 bg-[#DCE4FF] rounded-[8px] cursor-pointer"
              onClick={() => {
                setShowFileModal(true);
                setActiveFile(item.files);
              }}
            >
              <FileIcon />
              Fayl
            </button>
          ),

          edit: (
            <button
              className="text-[#4E75FF] bg-white px-6 py-2 border border-[#4E75FF] rounded-md cursor-pointer"
              onClick={() => {
                setResultModal({
                  modal: true,
                  item: item,
                });
              }}
            >
              Natijani kiritish
            </button>
          ),
        }));

        setDocumentsData(arr);
      },
    }
  );
  useQuery(
    ["examinationOrganization", organizationParams],
    () =>
      axiosT.get("/examination/organization-list/", {
        params: organizationParams,
      }),
    {
      onSuccess({ data }) {
        setOrganizationList(data);
      },
    }
  );
  useQuery(
    ["examinationInspectors", organizationParams],
    () => axiosT.get("/examination/inspectors/", {}),
    {
      onSuccess({ data }) {
        setInspectors(data);
      },
    }
  );
  useQuery(
    ["examinationInspectorsForRandom", organizationParams, organization_id],
    () =>
      axiosT.get("/examination/select/", {
        params: {
          category_id: organizationParams.category_id,
          organization_id: organization_id,
        },
      }),
    {
      onSuccess({ data }) {
        setInspectorsForRandomList(data);
      },
    }
  );

  const onFinish = (dataPayload: any) => {
    setLoading(true);
    const data = {
      ...dataPayload,
      start_date: dataPayload?.start_date?.format("YYYY-MM-DD"),
      end_date: dataPayload?.end_date?.format("YYYY-MM-DD"),
    };
    const formData = new FormData();
    Object.keys(data).forEach((item: any) => {
      if (item === "files") return;
      if (item === "inspector") return;
      formData.append(item, data[item]);
    });

    const filesList = dataPayload.files;

    filesList.forEach((item: any) => {
      const file = item.files[0].originFileObj;
      delete file.uid;
      formData.append("files", file);
      formData.append("comments", item.comments);
    });
    data.inspector.forEach((item: any) => {
      formData.append("inspector", item);
    });
    axiosT
      .post("/examination/create/", formData)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Muaffaqiyatli yaratildi",
        });
        refetch();
        setNewPreventionModal(false);
        form.resetFields();
      })
      .catch(() => {
        console.log("err");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!organizationParams.category_id) {
      form.setFieldValue("organization", null);
    }
  }, [organizationParams.category_id]);

  return (
    <div className="px-4 py-5">
      {contextHolder}
      <div className="flex items-center justify-between mb-4.5">
        <h2 className="text-[#262626] text-2xl font-semibold Monserrat ">
          Tekshirish
        </h2>
        {config.role === ROLES.IJROCHI && (
          <button
            className="bg-[#4E75FF] rounded-sm py-2 px-6 text-white cursor-pointer"
            onClick={() => {
              setNewPreventionModal(true);
            }}
          >
            + Ma’lumot kiritish
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-3">
        <Table columns={columns} dataSource={documentsData} />
      </div>

      <Modal
        title={"Tekshiruv yaratish"}
        open={newPreventionModal}
        footer={null}
        onCancel={() => setNewPreventionModal(false)}
        onClose={() => setNewPreventionModal(false)}
        width={"70%"}
      >
        <>
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            name="newPrevention"
            initialValues={{
              inspector: [],
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Tekshiruv uchun asos"
                name={"type"}
                rules={[{ required: true, message: "Majburiy maydon" }]}
              >
                <Select
                  placeholder="Tanlash"
                  options={[
                    {
                      label: "Jismoniy va yuridik shaxs murojaati",
                      value: 1,
                    },
                    {
                      label: "Xavfni tahlil qilish natijasi",
                      value: 2,
                    },
                  ]}
                  onChange={(value: number) => {
                    setOrganizationParams((res: any) => {
                      return {
                        ...res,
                        type: value,
                      };
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Tadbirkorlik subyektlari" name={"category"}>
                <Select
                  placeholder="Kategoriya tanlash"
                  options={categories.map((category: any) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  onChange={(value: number) => {
                    setOrganizationParams((res: any) => {
                      return {
                        ...res,
                        category_id: value,
                      };
                    });
                  }}
                  allowClear
                />
              </Form.Item>
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
                  disabled={!organizationParams.category_id}
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
                  onChange={(value: number) => {
                    setOrganization_id(value);
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Inspektor"
                name={"inspector"}
                className="col-span-2"
                rules={[{ required: true, message: "Majburiy maydon" }]}
              >
                <Select
                  disabled={!organization_id}
                  placeholder="Tanlash"
                  mode="multiple"
                  dropdownRender={(menu) => {
                    return (
                      <>
                        <div className="mb-4">{menu}</div>
                        <button
                          className="bg-[#4E75FF] rounded-sm py-2 px-6 text-white cursor-pointer"
                          onClick={() => {
                            const random: any = Math.floor(
                              Math.random() * inspectorsForRandomList.length
                            );

                            const inspector: any =
                              inspectorsForRandomList[random];
                            form.setFieldValue(
                              "inspector",
                              Array.from(
                                new Set([
                                  ...form.getFieldValue("inspector"),
                                  inspector.id,
                                ])
                              )
                            );
                            setInspectorsForRandomList(
                              inspectorsForRandomList.filter(
                                (_: any, index: number) => random !== index
                              )
                            );
                          }}
                        >
                          Random tanlash
                        </button>
                      </>
                    );
                  }}
                >
                  {inspectors.map((item: any) => (
                    <Option disabled value={item.id} key={item.id}>
                      {item.full_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Tekshirish boshlanish sanasi"
                rules={[{ required: true, message: "Majburiy maydon" }]}
                name={"start_date"}
              >
                <DatePicker
                  placeholder="Muddatni tanlash"
                  style={{ width: "100%" }}
                />
              </Form.Item>{" "}
              <Form.Item
                label="Tekshirish tugashi sanasi"
                rules={[{ required: true, message: "Majburiy maydon" }]}
                name={"end_date"}
              >
                <DatePicker
                  placeholder="Muddatni tanlash"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              {files.map((file: any, index: number) => (
                <Card key={file.id} style={{ marginBottom: 10 }}>
                  <Space direction="vertical">
                    <Form.Item label="Fayl" name={["files", index, "files"]}>
                      <CustomUpload multiple />
                    </Form.Item>
                    <Form.Item
                      label="Tavsiflar"
                      className="col-span-2"
                      rules={[{ required: true, message: "Majburiy maydon" }]}
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
            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                className="mt-5"
                loading={loading}
              >
                Yuborish
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      <ShoWUploadedFilesWithComments
        isModalOpen={showFileModal}
        setIsModalOpen={() => {
          setShowFileModal(false);
        }}
        files={activeFiles}
      />

      <CreateResultForExamination
        criteria={resultModal.item}
        modalOpen={resultModal.modal}
        setModalOpen={() => {
          setResultModal({ item: {}, modal: false });
        }}
      />
    </div>
  );
};

export default ExaminationPage;
