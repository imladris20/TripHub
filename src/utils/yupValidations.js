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
