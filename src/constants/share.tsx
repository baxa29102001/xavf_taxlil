import { ROLES } from "@/constants/enum";
import { getQuarter } from "@/utils/quater";

const activeYear = new Date().getFullYear();
const activeQuarter = getQuarter(new Date().getMonth() + 1);

const arr = [
  {
    value: "organizations-scores",
    label: `Xavf tahlili natijalari choraklar kesimida`,
  },
  {
    value: "organizations-category-scores",
    label: `Xavf tahlili natijalari yo‘nalishlar kesimida`,
  },
  {
    value: "organization-scores-by-region",
    label: `Xavf tahlili baholash ko‘rsatgichlarining hududlar kesimida`,
  },
  {
    value: "case-status-by-category",
    label: `Barcha tadbirkorlik subyektlari faoliyatida aniqlangan va masʼullarga yuborilgan holatlar yo‘nalishlar kesimida`,
  },
  {
    value: "case-status-by-organization",
    label: `Tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga yuborilgan holatlar yo‘nalishlar kesimida`,
  },
  {
    value: "case-status-all-organizations",
    label: `Masʼullarga yuborilgan holatlar tadbirkorlik subyektlar kesimida`,
  },
  {
    value: "submitted-cases-by-category",
    label: `Ijrochilardan kelib tushgan holatlar yo‘nalishlar kesimida`,
  },

  {
    value: "action-taken-by-category",
    label: `Aniqlangan kamchiliklar bo‘yicha ko‘rilgan choralar tadbirkorlik subyeklar kesimida`,
  },
  {
    value: "action-taken-by-organization",
    label: `Aniqlangan kamchiliklar bo‘yicha ko‘rilgan choralar yo‘nalishlar kesimida`,
  },
  {
    value: "action-taken-by-examination-by-organization",
    label: `O‘tkazilgan tekshirishlarga asosan ko‘rilgan choralar tadbirkorlik subyektlar kesimida`,
  },
  {
    value: "action-taken-by-examination-by-category",
    label: `O‘tkazilgan tekshirishlarga asosan ko‘rilgan choralar yo‘nalishlar kesimida`,
  },
  {
    value: "action-taken-by-profilatik-by-organization",
    label: `O‘tkazilgan profilaktika tadbirlari tadbirkorlik subyektlar kesimida`,
  },
  {
    value: "action-taken-by-profilatik-by-category",
    label: `O‘tkazilgan profilaktika tadbirlari yo‘nalishlar kesimida`,
  },
];

export const HISOBOT_LIST = {
  [ROLES.IJROCHI]: arr,
  [ROLES.MASUL]: arr,
  [ROLES.RAHBAR]: arr,
};

export const QuarterList = [
  {
    label: "Chorak-1",
    value: 1,
  },
  {
    label: "Chorak-2",
    value: 2,
  },
  {
    label: "Chorak-3",
    value: 3,
  },
  {
    label: "Chorak-4",
    value: 4,
  },
];
