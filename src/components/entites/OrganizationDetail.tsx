import axiosT from "@/api/axios";
import { FileAddIcon, FileIcon } from "@/assets/icons";
import { LeftOutlined } from "@ant-design/icons";
import { Collapse, DatePicker, Input, Modal, Select, Table } from "antd";
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
  const [content, setContent] = useState<any>({
    overall_score: 0,
    organization_name: "",
    criteria_details: [],
  });

  const [isModalOpen, setIsModalOpen] = useState<any>({
    modal: false,
    item: {},
  });
  const [fileAddModal, setFileAddModal] = useState<any>({
    modal: false,
    item: {},
  });

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
      </Modal>{" "}
      <Modal
        title={"Fayl biriktirish"}
        open={fileAddModal.modal}
        onOk={() => {}}
        okText="Yuborish"
        cancelText="Bekor qilish"
        onCancel={() => {
          setFileAddModal({
            modal: false,
            item: {},
          });
        }}
      >
        <div className="mb-4">
          <CustomUpload />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="">Bandlar soni</label>
            <Input placeholder="Bandlar soni" />
          </div>{" "}
          <div>
            <label htmlFor="">Fayl turi</label>
            <Select
              placeholder="Xavf darajasi"
              style={{
                width: "100%",
              }}
              allowClear
              options={[
                {
                  value: "yaxshi",
                  label: "Yaxshi",
                },
                {
                  value: "yomon",
                  label: "Yomon",
                },
              ]}
            />
          </div>{" "}
          <div>
            <label htmlFor="" className="block">
              Muddati
            </label>
            <DatePicker placeholder="Muddati" />
          </div>
        </div>
        <div>
          <label htmlFor="">Izoh</label>

          <TextArea rows={6} />
        </div>
      </Modal>
    </div>
  );
};
