const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const jsonParser = express.json();

const { PO_STATIC } = process.env;

module.exports = (server) => {
  const year = new Date().getFullYear();

  server.get(`${PO_STATIC}/copyright`, jsonParser, (req, res, next) => {
    const {
      query: { less },
    } = req;

    if (less) {
      return res.send(`© ${year} «WebVay» All rights reserved`);
    }

    return res.send(
      `© ${year} - BẢN QUYỀN THUỘC VỀ MD Techonolgy Ltd. CÔNG TY TNHH  MD Techonolgy VÀ TẤT CẢ CÁC THƯƠNG HIỆU TRỰC THUỘC SỬ DỤNG NỀN TẢNG<br/> CÔNG NGHỆ CHO VAY ONLINE ĐỂ KẾT NỐI NGƯỜI VAY VÀ NHÀ ĐẦU TƯ, TẠO ĐIỀU KIỆN CHO CÁC QUY TRÌNH VAY MỘT CÁCH THUẬN LỢI. CHÚNG TÔI<br/> KHÔNG HOẠT ĐỘNG NHƯ NHÀ ĐẦU TƯ HAY NGƯỜI CHO VAY.GIẤY CHỨNG NHẬN ĐĂNG KÝ KINH DOANH SỐ _____________`
    );
  });
};
