import {
  facilitatorRegistryService,
  t,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
  SelectStyle,
  ImageView,
  Loading,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";

const LearnerMessage = ({ program_beneficiaries }) => {
  const [reason, setReason] = React.useState({});
  React.useEffect(() => {
    if (
      program_beneficiaries?.enrollment_verification_status ===
      "change_required"
    ) {
      setReason(
        JSON.parse(program_beneficiaries?.enrollment_verification_reason)
      );
    }
  }, []);

  const getTitle = () => {
    if (
      reason?.learner_enrollment_details === "no" &&
      reason?.enrollment_details === "no"
    ) {
      return t("ENROLLMENT_RECEIPT_AND_DETAILS_MISMATCH");
    } else if (reason?.learner_enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_DETAILS");
    } else if (reason?.enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_LEARNER_DETAILS");
    } else {
      return t("FOLLOW_UP_WITH_IP");
    }
  };

  return (
    <HStack color="blueText.450" alignItems="center">
      <FrontEndTypo.H4 color="blueText.450" underline>
        {getTitle()}
      </FrontEndTypo.H4>
    </HStack>
  );
};

const List = ({ data }) => {
  const navigate = useNavigate();

  return (
    <VStack space="4" p="4" alignContent="center">
      {(data && data?.length > 0) || data?.constructor?.name === "Array" ? (
        data &&
        data?.constructor?.name === "Array" &&
        data?.map((item) => (
          <VStack
            key={item?.id}
            bg="white"
            p="2"
            shadow="FooterShadow"
            rounded="sm"
            space="1"
          >
            <Pressable
              onPress={async () => {
                navigate(`/beneficiary/${item?.id}`);
              }}
            >
              <HStack justifyContent="space-between">
                <HStack alignItems="Center" flex="5">
                  {item?.profile_photo_1?.id ? (
                    <ImageView
                      source={{
                        document_id: item?.profile_photo_1?.id,
                      }}
                      alt="Alternate Text"
                      width={"45px"}
                      height={"45px"}
                    />
                  ) : (
                    <IconByName
                      isDisabled
                      name="AccountCircleLineIcon"
                      color="gray.300"
                      _icon={{ size: "45px" }}
                    />
                  )}
                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {item?.program_beneficiaries?.status ===
                    "enrolled_ip_verified" ? (
                      <FrontEndTypo.H3 bold color="textGreyColor.800">
                        {item?.program_beneficiaries?.enrollment_first_name}
                        {item?.program_beneficiaries?.enrollment_middle_name &&
                          item?.program_beneficiaries
                            ?.enrollment_middle_name !== "null" &&
                          ` ${item?.program_beneficiaries?.enrollment_middle_name}`}
                        {item?.program_beneficiaries?.enrollment_last_name &&
                          item?.program_beneficiaries?.enrollment_last_name !==
                            "null" &&
                          ` ${item?.program_beneficiaries?.enrollment_last_name}`}
                      </FrontEndTypo.H3>
                    ) : (
                      <FrontEndTypo.H3 bold color="textGreyColor.800">
                        {item?.first_name}
                        {item?.middle_name &&
                          item?.middle_name !== "null" &&
                          ` ${item.middle_name}`}
                        {item?.last_name &&
                          item?.last_name !== "null" &&
                          ` ${item.last_name}`}
                      </FrontEndTypo.H3>
                    )}
                    <FrontEndTypo.H5 color="textGreyColor.800">
                      {item?.mobile}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <Box maxW="121px">
                  <ChipStatus
                    status={item?.program_beneficiaries?.status}
                    is_duplicate={item?.is_duplicate}
                    is_deactivated={item?.is_deactivated}
                    rounded={"sm"}
                  />
                </Box>
              </HStack>
            </Pressable>
            <VStack bg="white" pl="2">
              {item?.program_beneficiaries?.status === "identified" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("COMPLETE_THE_DOCUMENTATION")}
                  </FrontEndTypo.H4>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    py="0"
                    onPress={() => {
                      navigate(`/beneficiary/${item?.id}/docschecklist`);
                    }}
                  />
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "enrollment_pending" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("CONTINUE_ENROLLMENT")}
                  </FrontEndTypo.H4>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(`/beneficiary/${item?.id}/docschecklist`);
                    }}
                  />
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "ready_to_enroll" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("ENTER_THE_ENROLLMENT_DETAILS")}
                  </FrontEndTypo.H4>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(`/beneficiary/${item?.id}/enrollmentdetails`);
                    }}
                  />
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "enrolled" && (
                <LearnerMessage
                  program_beneficiaries={item?.program_beneficiaries}
                />
              )}

              {item?.program_beneficiaries?.status === "dropout" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4
                    color="blueText.450"
                    underline
                  ></FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "duplicated" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("FOLLOW_UP_WITH_IP_ASSIGNMENT")}
                  </FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status ===
                "enrolled_ip_verified" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("BENEFICIARY_STATUS_REGISTERED_IN_CAMP")}
                  </FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "rejected" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4
                    color="blueText.450"
                    underline
                  ></FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status ===
                "ineligible_for_pragati_camp" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4
                    color="blueText.450"
                    underline
                  ></FrontEndTypo.H4>
                </HStack>
              )}
            </VStack>
          </VStack>
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </VStack>
  );
};
const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

const styles = {
  inforBox: {
    style: {
      background:
        "linear-gradient(75.39deg, rgba(255, 255, 255, 0) -7.58%, rgba(255, 255, 255, 0) -7.57%, rgba(255, 255, 255, 0.352337) -7.4%, #CAE9FF 13.31%, #CAE9FF 35.47%, #CAE9FF 79.94%, rgba(255, 255, 255, 0.580654) 103.6%, rgba(255, 255, 255, 0) 108.42%)",
    },
  },
};

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState({ limit: 6 });
  const [data, setData] = React.useState([]);
  const [selectStatus, setSelectStatus] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [bodyHeight, setBodyHeight] = React.useState(0);
  const [loadingHeight, setLoadingHeight] = React.useState(0);
  const ref = React.useRef(null);
  const fa_id = localStorage.getItem("id");

  React.useEffect(async () => {
    const data = await benificiaryRegistoryService.getStatusList();
    if (data.length > 0) {
      setSelectStatus(data);
    }
  }, []);

  React.useEffect(() => {
    if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(bodyHeight - ref?.current?.clientHeight);
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  React.useEffect(() => {
    const aglist = async () => {
      const { currentPage, totalPages, error, ...result } =
        await benificiaryRegistoryService.getBeneficiariesList(filter);
      if (!error) {
        setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
        if (filter?.page > 1) {
          setData([...data, ...(result.data ? result.data : [])]);
        } else {
          setData(result.data ? result.data : []);
        }
      } else {
        setData([]);
      }
      setLoadingList(false);
    };
    aglist();
  }, [filter]);

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({ ...filter, search: value, page: 1 });
        },
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <VStack ref={ref}>
        <Pressable
          onPress={(e) => {
            [
              "pragati_mobilizer",
              "selected_prerak",
              "selected_for_training",
              "selected_for_onboarding",
            ].includes(facilitator.status) && navigate(`/beneficiary`);
          }}
        >
          <HStack
            p="5"
            space="5"
            // borderBottomWidth="1"
            {...styles.inforBox}
            alignItems="Center"
          >
            <IconByName
              isDisabled
              name="UserFollowLineIcon"
              _icon={{ size: "30px" }}
              onPress={(e) => {
                navigate("/beneficiary");
              }}
            />
            <VStack flex="0.8">
              <FrontEndTypo.H3
                bold
                color="textGreyColor.800"
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {t("ADD_MORE_AG")}
              </FrontEndTypo.H3>
            </VStack>
          </HStack>
        </Pressable>
        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="Center"
          p="4"
        >
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              selectedValue={filter?.status}
              placeholder={t("STATUS_ALL")}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, status: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <IconByName name="ArrowDownSLineIcon" />,
              }}
              accessibilityLabel="Select a position for Menu"
            >
              <Select.Item key={0} label={t("BENEFICIARY_ALL")} value={""} />
              {Array.isArray(selectStatus) &&
                selectStatus.map((option, index) => (
                  <Select.Item
                    key={index || ""}
                    label={t(option.title)}
                    value={option.value}
                  />
                ))}
            </SelectStyle>
          </Box>
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              selectedValue={filter?.sortType ? filter?.sortType : ""}
              placeholder={t("SORT_BY")}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, sortType: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "secondary.700",
              }}
              accessibilityLabel="Select a position for Menu"
            >
              {select2.map((option, index) => (
                <Select.Item
                  key={index || ""}
                  label={t(option.label)}
                  value={option.value}
                />
              ))}
            </SelectStyle>
          </Box>
        </HStack>
      </VStack>
      {!loadingList ? (
        <InfiniteScroll
          dataLength={data?.length}
          next={(e) =>
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            })
          }
          hasMore={hasMore}
          height={loadingHeight}
          loader={<Loading height="100" />}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          // below props only if you need pull down functionality
          pullDownToRefreshThreshold={50}
        >
          <List data={data} />
        </InfiniteScroll>
      ) : (
        <Loading height={loadingHeight} />
      )}
    </Layout>
  );
}
