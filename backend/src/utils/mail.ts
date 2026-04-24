console.log("MAIL_HOST:", process.env.MAIL_HOST);
console.log("MAIL_PORT:", process.env.MAIL_PORT);
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS);
import nodemailer from "nodemailer";
import dotenv from "dotenv";



// 🔥 Tạo transport từ Mailtrap
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a569dc95b46281",
    pass: "4b3b56e511c299"
  }
});

// ================== 📦 GỬI MAIL ĐƠN HÀNG ==================
export const sendMail = async (to: string) => {
  try {
    const info = await transport.sendMail({
      from: '"PhoneShop" <no-reply@phoneshop.com>',
      to,
      subject: "Xác nhận đơn hàng",
      text: "Cảm ơn bạn đã mua hàng!",
      html: `
        <div style="font-family:sans-serif">
          <h2>🎉 Đặt hàng thành công</h2>
          <p>Cảm ơn bạn đã mua hàng tại <b>PhoneShop</b></p>
        </div>
      `
    });

    console.log("✅ Gửi mail thành công:", info.response);
    return true;
  } catch (error) {
    console.log("❌ Lỗi gửi mail:", error);
    return false;
  }
};

// ================== 🔐 GỬI OTP ==================
export const sendOTP = async (to: string, otp: string) => {
  try {
    const info = await transport.sendMail({
      from: '"PhoneShop" <no-reply@phoneshop.com>',
      to,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `
        <div style="font-family:sans-serif; text-align:center">
          <h2>🔐 Xác thực OTP</h2>
          <p>Đây là mã OTP của bạn:</p>
          <h1 style="color:#007bff; letter-spacing:5px">${otp}</h1>
          <p>⏰ Có hiệu lực trong <b>5 phút</b></p>
        </div>
      `
    });
    
    console.log("✅ Gửi OTP thành công:", info.response);
    return true;
  } catch (error) {
    console.log("❌ Lỗi gửi OTP:", error);
    return false;
  }
};