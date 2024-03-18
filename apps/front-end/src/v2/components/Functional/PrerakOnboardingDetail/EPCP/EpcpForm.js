import React, { useState, useRef, useEffect } from "react";
import Form from "@rjsf/core";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "../../../Static/FormBaseInput/FormBaseInput.js";

import { useTranslation } from "react-i18next";
import { FrontEndTypo, filterObject } from "@shiksha/common-lib";
import PageHeader from "v2/components/Static/PageHeader/PageHeader.js";
import PageLayout from "v2/components/Static/PageLayout/PageLayout.js";
import { Box } from "native-base";

const EpcpForm = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const schema = {
    type: "object",
    properties: {
      RSOS_APP: {
        label: "HAS_THE_LEARNER_LOGGED_INTO_THE_RSOS_APP",
        type: "string",
        direction: "row",
        format: "RadioBtn",
        enumNames: ["YES", "NO"],
        enum: ["yes", "no"],
        default: null,
      },
    },
    allOf: [
      {
        // if  RSOS_APP is "Yes" view all the options
        if: {
          properties: {
            RSOS_APP: {
              const: "yes",
            },
          },
        },
        then: {
          properties: {
            RSOS_VIDEO: {
              label: "DO_THE_LEARNERS_STUDY_THROUGH_VIDEOS/EBOOKS_ON_RSOS_APP",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enumNames: ["YES", "NO"],
              enum: ["yes", "no"],
              default: null,
            },
            Video_reason: {},
            RSOS_TEST: {
              label: "ARE_YOU_TAKING_PRACTICE_TESTS_ON_THE_RSOS_APP",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: ["yes", "no"],
              default: null,
            },
            test_reason: {},
            PCP_EXAM: {
              label: "DID_YOU_TAKE_THE_EPCP_EXAM_ON_THE_RSOS_APP",
              type: ["string", "null"],
              direction: "row",
              format: "RadioBtn",
              enum: ["yes", "no"],
              default: null,
            },
            exam_reason: {},
          },
        },
      },
      // if  RSOS_APP is "no" hide all the options and view reason
      {
        if: {
          properties: {
            RSOS_APP: {
              const: "no",
            },
          },
        },
        then: {
          properties: {
            reason: {
              label: "CHOOSE_THE_REASON",
              type: "string",
              direction: "row",
              format: "RadioBtn",
              enum: ["Not well", "Other"],
            },
          },
          required: ["reason"],
        },
      },
      // if  RSOS_APP is "Yes" and RSOS_VIDEO is "no" view video reasons below it.
      // if  RSOS_APP is "Yes" and RSOS_VIDEO is "yes" hide video reasons below it.
      {
        if: {
          properties: {
            RSOS_APP: {
              const: "yes",
            },
            RSOS_VIDEO: {
              const: "no",
            },
          },
        },
        then: {
          properties: {
            Video_reason: {
              direction: "row",
              format: "RadioBtn",
              label: "CHOOSE_THE_REASON",
              type: "string",
              enum: ["Not well", "Other"],
            },
          },
          required: ["reason"],
        },
        else: {
          properties: {
            Video_reason: {
              format: "hidden",
              label: "CHOOSE_THE_REASON",
              type: "string",
              enum: ["Not well", "Other"],
            },
          },
        },
      },
      // if  RSOS_APP is "Yes" and RSOS_TEST is "no" view test reasons below it.
      // if  RSOS_APP is "Yes" and RSOS_TEST is "yes" hide test reasons below it.
      {
        if: {
          properties: {
            RSOS_APP: {
              const: "yes",
            },
            RSOS_TEST: {
              const: "no",
            },
          },
        },
        then: {
          properties: {
            test_reason: {
              direction: "row",
              format: "RadioBtn",
              label: "CHOOSE_THE_REASON",
              type: "string",
              enum: ["Not well", "Other"],
            },
          },
        },
        else: {
          properties: {
            test_reason: {
              format: "hidden",
              label: "CHOOSE_THE_REASON",
              type: "string",
              enum: ["Not well", "Other"],
            },
          },
        },
      },
      // if  RSOS_APP is "Yes" and PCP_EXAM is "no" view test reasons below it.
      // if  RSOS_APP is "Yes" and PCP_EXAM is "yes" hide test reasons below it.
      {
        if: {
          properties: {
            RSOS_APP: {
              const: "yes",
            },
            PCP_EXAM: {
              const: "no",
            },
          },
        },
        then: {
          properties: {
            exam_reason: {
              direction: "row",
              format: "RadioBtn",
              label: "CHOOSE_THE_REASON",
              type: "string",
              enum: ["Not well", "Other"],
            },
          },
        },
        else: {
          properties: {
            exam_reason: {
              format: "hidden",
              label: "CHOOSE_THE_REASON",
              type: "string",
              enum: ["Not well", "Other"],
            },
          },
        },
      },
      {
        if: {
          properties: {
            RSOS_APP: {
              const: "yes",
            },
            PCP_EXAM: {
              const: "yes",
            },
          },
        },
        then: {
          properties: {
            document: {
              label: "UPLOAD_A_CLEAR_PHOTO_OF_YOU_DOCUMENT",
              document_type: "epcp",
              type: ["string", "number"],
              format: "OfflineFileUpload",
            },
          },
          required: ["document"],
        },
      },

      {
        required: ["RSOS_APP", "PCP_EXAM", "RSOS_VIDEO", "RSOS_TEST"],
      },
    ],
  };

  console.log({ formData });

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const filterNullValues = (obj) => {
    const filteredObj = {};
    for (const key in obj) {
      if (obj[key] !== null) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;

    if (_.isEmpty(errors)) {
      const newdata = filterNullValues(newFormData);
      console.log({ newdata });
    }
  };

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    } else {
      if (formRef.current.validateForm()) {
        formRef?.current?.submit();
      }
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  return (
    <>
      <PageLayout />
      <Box p={4}>
        <Form
          key={schema}
          ref={formRef}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          {...{
            widgets,
            templates,
            validator,
            schema: schema || {},
            //uiSchema,
            formData,
            onChange,
            onSubmit,
            onError,
            transformErrors: (errors) => transformErrors(errors, schema, t),
          }}
        >
          <FrontEndTypo.Primarybutton
            isLoading={loading}
            type="submit"
            onPress={() => onClickSubmit(true)}
          >
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </Box>
    </>
  );
};

export default EpcpForm;
