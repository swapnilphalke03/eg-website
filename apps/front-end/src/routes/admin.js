import Dashboard from "pages/front-end/Dashboard";
import Profile from "pages/admin/facilitator/Profile";
import FacilitatorView from "pages/admin/facilitator/View";
import AdminHome from "pages/admin/AdminHome";
import LearnerAdminHome from "pages/admin/learner/AdminHome";
import FacilitatorForm from "../pages/admin/FacilitatorForm";
import NotFound from "pages/NotFound";
import Orientation from "pages/front-end/orientation/Orientation";
import Attendence from "pages/front-end/Attendence/Attendence";

import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import AadhaarStartKyc from "pages/front-end/AadhaarKyc/AadhaarStartKyc";
import ManualUpload from "pages/front-end/AadhaarKyc/ManualUpload/ManualUpload";
import QrScannerKyc from "pages/front-end/AadhaarKyc/QrScannerKyc/QrScannerKyc";
import ReciptView from "pages/admin/learner/ReciptView";
// import { CheatSheet } from "@shiksha/common-lib";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: AdminHome },
  { path: "/admin/learner", component: LearnerAdminHome },
  { path: "/admin", component: Orientation },
  { path: "/attendence/:id", component: Attendence },
  { path: "/admin/view/enrollmentRecipt/:id", component: ReciptView },
  {
    path: "/aadhaar-kyc/:id",
    component: AdharKyc,
  },
  {
    path: "/aadhaar-kyc/:id/:type",
    component: AdharKyc,
  },

  { path: "/", component: Orientation },

  { path: "*", component: NotFound },

  // { path: "/cheatsheet", component: CheatSheet },
];
