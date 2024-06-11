import prisma from "@/prisma/client";

export const sms = async (phone: string) => {
  const code = Math.floor(Math.random() * 99999);
  const date = new Date();
  const expTime = date.getTime() + 200000;

  try {
    const axios = require("axios");
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: "",
      pass: "Faraz@",
      fromNum: "3000505",
      toNum: phone,
      patternCode: "",
      inputData: [{ "verification-code": code }],
    });

    if (response.status === 200) {
      //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE

      const user = await prisma.user.findUnique({
        where: { phone: phone },
      });
      if (!user) return false;
      await prisma.user.update({
        where: { phone: phone },
        data: { code: String(code), expTime: String(expTime) },
      });

      return { code: String(code) };
    } else {
      console.log("whatever you want");
      return false;
    }
  } catch (error) {
    console.log("error in sms");
    return false;
  }
};
