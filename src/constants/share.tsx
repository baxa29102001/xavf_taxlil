import { ROLES } from "@/constants/enum";
import { getQuarter } from "@/utils/quater";

const activeYear = new Date().getFullYear();
const activeQuarter = getQuarter(new Date().getMonth() + 1);

export const HISOBOT_LIST = {
  [ROLES.IJROCHI]: [
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
      label: `Tanlangan tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga yuborilgan holatlar yo‘nalishlar kesimida `,
    },
    {
      value: "case-status-all-organizations",
      label: `Masʼullarga yuborilgan holatlar tadbirkorlik subyektlar kesimida`,
    },
    {
      value: "submitted-cases-by-category",
      label: `Ijrochilardan kelib tushgan holatlar yo‘nalishlar kesimida`,
    },
    // {
    //   value: "submitted-cases-by-user-organization",
    //   label: `Tadbirkorlik subyekti faoliyatida aniqlangan va ijrochilardan ${activeYear} yilning ${activeQuarter}-choragida barcha tadbirkorlik subyektlar bo‘yicha kelib tushgan holatlarning yo‘nalishlar kesimidagi tahlili`,
    // },
    {
      value: "action-taken-by-category",
      label: `Xavf tahlili natijalariga asosan ko‘rilgan choralar tadbirkorlik subyeklar kesimida`,
    },
    {
      value: "action-taken-by-organization",
      label: `Xavf tahlili natijalariga asosan ko‘rilgan choralar yo‘nalishlar kesimida`,
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
  ],
  [ROLES.MASUL]: [
    {
      value: "organizations-scores",
      label: `Tadbirkorlik subyeklar faoliyatida ${activeYear}-yil davomida o‘tkazilgan xavf tahlili natijalari`,
    },
    {
      value: "organizations-category-scores",
      label: `Tadbirkorlik subyeklar faoliyatida ${activeYear}-yil ${activeQuarter}-chorak  davomida o‘tkazilgan xavf tahlili natijalari yo‘nalishlar kesimida`,
    },
    {
      value: "organization-scores-by-region",
      label: `Axborotlashtirish, raqamli texnologiyalar, elektron xizmatlar va raqamli servislar, axborot xavfsizligi  faoliyatida ${activeYear}-yil ${activeQuarter}-chorak davomida o‘tkazilgan xavf tahlilining kriterilar bo‘yicha natijalari`,
    },
    {
      value: "case-status-by-category",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga ${activeYear} yilning ${activeQuarter}-choragida yuborilgan umumiy holatlarning yo‘nalishlar kesimidagi tahlili`,
    },
    {
      value: "case-status-by-organization",
      label: `Faoliyatida aniqlangan va masʼullarga ${activeYear} yilning ${activeQuarter}-choragida yuborilgan umumiy holatlarning yo‘nalishlar kesimidagi tahlili`,
    },
    {
      value: "case-status-all-organizations",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga ${activeYear} yilning ${activeQuarter}-choragida yuborilgan holatlarning tadbirkorlik subyektlar kesimidagi tahlili`,
    },
    {
      value: "submitted-cases-by-category",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va ijrochilardan ${activeYear} yilning ${activeQuarter}-choragida barcha tadbirkorlik subyektlar bo‘yicha kelib tushgan holatlarning yo‘nalishlar kesimidagi tahlili"`,
    },
    {
      value: "submitted-cases-by-user-organization",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va ijrochilardan ${activeYear} yilning ${activeQuarter}-choragida barcha tadbirkorlik subyektlar bo‘yicha kelib tushgan holatlarning yo‘nalishlar kesimidagi tahlili`,
    },
  ],
  [ROLES.RAHBAR]: [
    {
      value: "organizations-scores",
      label: `Tadbirkorlik subyeklar faoliyatida ${activeYear}-yil davomida o‘tkazilgan xavf tahlili natijalari`,
    },
    {
      value: "organizations-category-scores",
      label: `Tadbirkorlik subyeklar faoliyatida ${activeYear}-yil ${activeQuarter}-chorak  davomida o‘tkazilgan xavf tahlili natijalari yo‘nalishlar kesimida`,
    },
    {
      value: "organization-scores-by-region",
      label: `Axborotlashtirish, raqamli texnologiyalar, elektron xizmatlar va raqamli servislar, axborot xavfsizligi  faoliyatida ${activeYear}-yil ${activeQuarter}-chorak davomida o‘tkazilgan xavf tahlilining kriterilar bo‘yicha natijalari`,
    },
    {
      value: "case-status-by-category",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga ${activeYear} yilning ${activeQuarter}-choragida yuborilgan umumiy holatlarning yo‘nalishlar kesimidagi tahlili`,
    },
    {
      value: "case-status-by-organization",
      label: `Faoliyatida aniqlangan va masʼullarga ${activeYear} yilning ${activeQuarter}-choragida yuborilgan umumiy holatlarning yo‘nalishlar kesimidagi tahlili`,
    },
    {
      value: "case-status-all-organizations",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va masʼullarga ${activeYear} yilning ${activeQuarter}-choragida yuborilgan holatlarning tadbirkorlik subyektlar kesimidagi tahlili`,
    },
    {
      value: "submitted-cases-by-category",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va ijrochilardan ${activeYear} yilning ${activeQuarter}-choragida barcha tadbirkorlik subyektlar bo‘yicha kelib tushgan holatlarning yo‘nalishlar kesimidagi tahlili"`,
    },
    {
      value: "submitted-cases-by-user-organization",
      label: `Tadbirkorlik subyekti faoliyatida aniqlangan va ijrochilardan ${activeYear} yilning ${activeQuarter}-choragida barcha tadbirkorlik subyektlar bo‘yicha kelib tushgan holatlarning yo‘nalishlar kesimidagi tahlili`,
    },
  ],
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
