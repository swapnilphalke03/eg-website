import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
  facilitatorRegistryService,
  Loading,
  t,
  authRegistryService,
  ImageView,
  AdminTypo,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Modal,
  FormControl,
  Input,
  Image,
  useToast,
} from "native-base";
import moment from "moment";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../../component/BaseInput";

export default function DuplicateView({ footerLinks }) {
  const toast = useToast();

  const { adhaarNo } = useParams();
  const [data, setData] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [viewData, setViewData] = React.useState();
  const navigate = useNavigate();

  const columns = (e) => [
    {
      name: t("LEARNERS") + " " + t("Name"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          <AdminTypo.H5>
            {row?.first_name + " "}
            {row?.last_name && row?.last_name}
          </AdminTypo.H5>
        </HStack>
      ),
      sortable: true,
      attr: "name",
    },
    {
      name: t("DATE_OF_ENTRY_IN_PMS"),
      selector: (row) => moment(row?.created_at).format("DD/MM/YYYY"),
      sortable: true,
      attr: "name",
    },
    {
      name: t("MOBILE_NUMBER"),
      selector: (row) => row?.mobile,
      sortable: true,
      attr: "email",
    },

    {
      name: t("ADDRESS"),

      selector: (row) => (row?.district ? row?.district : "-"),
    },
    {
      name: t("PRERAK_NAME"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          <AdminTypo.H5 bold>
            {row?.program_beneficiaries?.facilitator_user?.first_name + " "}
            {row?.program_beneficiaries?.facilitator_user?.last_name &&
              row?.program_beneficiaries?.facilitator_user?.last_name}
          </AdminTypo.H5>
        </HStack>
      ),
      sortable: true,
      attr: "name",
    },
    {
      name: t("PRERAK_NUMBER"),
      selector: (row) => row?.program_beneficiaries?.facilitator_user?.mobile,
      sortable: true,
      attr: "email",
    },
    {
      name: t("REASON_OF_DUPLICATION"),
      selector: (row) => row?.duplicate_reason,
      sortable: true,
      attr: "email",
    },
  ];

  React.useEffect(async () => {
    const aadhar_no = { aadhar_no: adhaarNo };
    const result = await facilitatorRegistryService?.getDetailsByadhaar(
      aadhar_no
    );
    setData(result?.data);
    setLoading(false);
  }, []);

  const assignToPrerak = async (id) => {
    const activeId = { activeId: id };
    const result = await facilitatorRegistryService?.assignToPrerak(activeId);
    setModalVisible(false);
  };

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <Image
              source={{
                uri: "/profile.svg",
              }}
              alt="Prerak Orientation"
              size="30px"
              resizeMode="contain"
            />

            <AdminTypo.H1 color="Activatedcolor.400">
              {" "}
              {t("DUPLICATE")}
            </AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <AdminTypo.H1
              color="textGreyColor.800"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {adhaarNo}
            </AdminTypo.H1>
          </HStack>
          <DataTable
            customStyles={tableCustomStyles}
            columns={[
              ...columns(),
              {
                name: t("ACTION"),
                selector: (row) => (
                  <AdminTypo.Secondarybutton
                    my="3"
                    onPress={() => {
                      setModalVisible(true);
                      setViewData(row);
                    }}
                  >
                    {t("ASSIGN")}
                  </AdminTypo.Secondarybutton>
                ),
              },
            ]}
            data={data}
            persistTableHead
            progressPending={loading}
            pagination
            paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
            paginationServer
            paginationTotalRows={paginationTotalRows}
          />
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header textAlign={"left"}>
                <HStack alignItems={"center"}>
                  <IconByName
                    isDisabled
                    name="Chat4LineIcon"
                    color="textGreyColor.100"
                    size="xs"
                  />
                  <AdminTypo.H1
                    marginLeft="10px"
                    color="textGreyColor.500"
                  >{`${t("ASSIGN")} ${t("TO")} ${t("PRERAK")}`}</AdminTypo.H1>
                </HStack>
              </Modal.Header>
              <Modal.Body>
                <HStack justifyContent="space-between">
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("LEARNERS")} ${t("NAME")}:`}{" "}
                      {viewData?.first_name + " "} {viewData?.last_name}
                    </AdminTypo.H6>
                  </HStack>
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("MOBILE_NUMBER")}:`} {viewData?.mobile}
                    </AdminTypo.H6>
                  </HStack>
                </HStack>
                <HStack mt={3} justifyContent="space-between">
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("PRERAK_NAME")}:`}{" "}
                      {viewData?.program_beneficiaries?.facilitator_user
                        ?.first_name + " "}
                      {viewData?.program_beneficiaries?.facilitator_user
                        ?.last_name &&
                        viewData?.program_beneficiaries?.facilitator_user
                          ?.last_name}
                    </AdminTypo.H6>
                  </HStack>
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("MOBILE_NUMBER")}:`}{" "}
                      {
                        viewData?.program_beneficiaries[0]?.facilitator_user
                          ?.mobile
                      }
                    </AdminTypo.H6>
                  </HStack>
                </HStack>
              </Modal.Body>
              <Modal.Footer>
                <HStack justifyContent="space-between" width="100%">
                  <AdminTypo.Secondarybutton
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    {t("CANCEL")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.PrimaryButton
                    onPress={() => {
                      assignToPrerak(viewData?.id);
                    }}
                  >
                    {t("ASSIGN")}
                  </AdminTypo.PrimaryButton>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </HStack>
    </Layout>
  );
}
