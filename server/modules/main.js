const express = require('express');

const {
  URIS: { MAIN_PAGE },
} = require('./../routes');

const router = express.Router();

router.get(MAIN_PAGE, (req, res, next) => {
  return res.json({
    documentTitle: 'Site Title',
    welcome: {
      title: 'Vay tiền thật dễ dàng!',
      description:
        'Những khó khăn về tài chính không còn là rào cản trên<br />con đường đạt đến mục tiêu của bạn',
    },
    howItWorks: {
      title: 'Để nhận khoản vay, bạn cần:',
      items: [
        {
          data: '<b>Về tuổi:</b>bạn phải ít nhất 20 tuổi',
        },
        {
          data: 'Giấy tờ cần thiết: bạn chỉ cần CMND hay CCCD',
        },
        {
          data:
            '<b>Lịch sử tín dụng:</b> chúng tôi không quan tâm đến những vấn đề của bạn với ngân hàng hoặc công ty tài chính khác',
        },
        {
          data:
            '<b>Tài khoản ngân hàng:</b> Bạn có tài khoản mở tại một ngân hàng nào chưa?',
        },
      ],
    },
    howDoIt: {
      title: 'Làm sao để nhận tiền?',
      items: [
        { data: 'Đăng ký vay' },
        { data: 'Chờ kết quả xác nhận' },
        { data: 'Nhận tiền vào tài khoản' },
      ],
    },
    notDifficult: {
      title:
        'Với sự hổ trợ từ Webvay, Những khó khăn về tài chính không còn là rào cản trên con đường đạt đến mục tiêu của bạn',
      description:
        'Với sự hổ trợ từ Webvay, Những khó khăn về tài chính không còn là rào cản trên con đường đạt đến mục tiêu của bạn',
    },
  });
});

module.exports = router;
