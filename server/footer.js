const express = require('express');

const {
  URIS: { COPYRIGHT },
} = require('./routes');

const router = express.Router();
const jsonParser = express.json();

router.get(COPYRIGHT, jsonParser, (req, res, next) => {
  const {
    query: { footerLess },
  } = req;

  const year = new Date().getFullYear();

  if (footerLess) return res.send(`© ${year} «WebVay» All rights reserved`);

  return res.send(
    `© ${year} - BẢN QUYỀN THUỘC VỀ MD Techonolgy Ltd. CÔNG TY TNHH  MD Techonolgy VÀ TẤT CẢ CÁC THƯƠNG HIỆU TRỰC THUỘC SỬ DỤNG NỀN TẢNG<br/> CÔNG NGHỆ CHO VAY ONLINE ĐỂ KẾT NỐI NGƯỜI VAY VÀ NHÀ ĐẦU TƯ, TẠO ĐIỀU KIỆN CHO CÁC QUY TRÌNH VAY MỘT CÁCH THUẬN LỢI. CHÚNG TÔI<br/> KHÔNG HOẠT ĐỘNG NHƯ NHÀ ĐẦU TƯ HAY NGƯỜI CHO VAY.GIẤY CHỨNG NHẬN ĐĂNG KÝ KINH DOANH SỐ _____________`
  );
});

module.exports = router;