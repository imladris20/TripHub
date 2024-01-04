import * as yup from "yup";

export const signUpValidation = yup.object({
  fullName: yup
    .string()
    .max(5, "姓名最多僅可輸入5個字")
    .required("欄位不得為空"),
  email: yup.string().email("email 格式有誤").required("欄位不得為空"),
  password: yup
    .string()
    .min(8, "密碼不得少於8個字")
    .test("no-spaces", "密碼不得包含空格", (value) => !/\s/.test(value))
    .required("欄位不得為空"),
});

export const addToScheduleValidation = yup.object({
  expense: yup
    .number()
    .integer("僅能輸入整數")
    .typeError("請輸入有效數字")
    .min(0, "金額不可小於零")
    .max(9999, "金額不可超過9999元"),
  note: yup.string().max(150, "備註最多150字唷"),
  selectedTrip: yup.string().notOneOf(["disabled", "請選擇行程"]),
});
