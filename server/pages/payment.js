const express = require('express');

const {
  URIS: { PAYMENT, PAYMENT_FORM },
} = require('./../routes');

const router = express.Router();

router.get(PAYMENT, (req, res, next) => {
  return res.json({
    documentTitle: 'Payment',
    pageTitle: 'PHƯƠNG THỨC THANH TOÁN',
    paymentInfo: [
      {
        text:
          'Nếu bạn đã chọn phương thức thanh toán Trực Tuyến, bạn phải chọn phương thức thanh toán qua ví điện tử và điền thông tin',
      },
      {
        title: 'Thanh toán qua ngân hàng',
        text:
          'Đến chi nhánh ngân hàng gần nhất hoặc sử dụng dịch vụ ngân hàng trực tuyến (Internet Banking)<br/>Thanh toán với thông tin sau:',
      },
      {
        title: 'Thanh Toán qua Tài Khoản Cá Nhân:',
        list: [
          'Để thanh toán qua Tài Khoản Cá Nhân:',
          'Đăng Nhập vào Tài Khoản Cá Nhân',
          'Chọn khoản tiền bạn muốn thanh toán để gia hạn hoặc thanh toán toàn bộ',
          'Click vào nút Thanh Toán',
          'Chọn Ví Điện Tử (E-wallet)',
        ],
      },
    ],
  });
});

router.get(PAYMENT_FORM, (req, res, next) => {
  return res.json({
    title: 'Nhập Số Hợp Đồng',
    buttonText: 'Đăng Nhập',
  });
});

module.exports = router;
