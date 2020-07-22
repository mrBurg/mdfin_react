const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const { PO_STATIC } = process.env;

module.exports = (server) => {
  server.get(`${PO_STATIC}/faq-page`, (req, res, next) => {
    return res.json({
      documentTitle: 'FAQ',
      faqList: [
        {
          title: 'Điều kiện để được vay:',
          questions: [
            {
              question:
                'Tôi có thể nhận được bao nhiêu tiền khi đăng ký vay lần đầu tiên?',
              answer: 'Bạn có thể nhận được từ 500 000 đến 2 500 000 VDN',
            },
            {
              question: 'Lãi suất cho vay là bao nhiêu?',
              answer:
                'Chúng tôi có lãi suất cố định cho khoản vay: 0,03% mỗi ngày',
            },
            {
              question: 'Giới hạn độ tuổi để được vay là gì?',
              answer: 'Tuổi người vay từ 20 đến 60 tuổi',
            },
            {
              question: 'Những giấy tờ nào cần thiết để có được một khoản vay?',
              answer: 'CMND hoặc CCCD',
            },
            {
              question:
                'Tôi có thể được vay nếu tôi không có công việc chính thức?',
              answer:
                'Để có được một khoản vay, bạn có thể làm việc không chính thức (công việc thời vụ) hoặc tự doanh',
            },
          ],
        },
        {
          title: 'Quy Trình nhận khoản vay:',
          questions: [
            {
              question: 'Làm thế nào để thanh toán một khoản vay?',
              answer:
                'Để trả nợ, bạn có thể đăng nhập vào tài khoản cá nhân của mình hoặc thanh toán qua ví điện tữ Payoo, Momo, bạn cũng có thể trả nợ trực tiếp trên trang web của chúng tôi hoặc ViettelPost (cửa hàng và POS) hoặc gửi thanh toán bằng chuyển khoản qua bất kỳ ngân hàng nào',
            },
            {
              question: 'Tôi có thể thanh toán một khoản vay qua ngân hàng?',
              answer:
                'Bạn có thể hoàn trả khoản vay tại bất kỳ chi nhánh ngân hàng nào',
            },
          ],
        },
        {
          title: 'Thủ tục trả nợ vay:',
          questions: [
            {
              question: 'Làm thế nào để thanh toán một khoản vay?',
              answer:
                'Để trả nợ, bạn có thể đăng nhập vào tài khoản cá nhân của mình hoặc thanh toán qua ví điện tữ Payoo, Momo, bạn cũng có thể trả nợ trực tiếp trên trang web của chúng tôi hoặc ViettelPost (cửa hàng và POS) hoặc gửi thanh toán bằng chuyển khoản qua bất kỳ ngân hàng nào',
            },
            {
              question: 'Tôi có thể thanh toán một khoản vay qua ngân hàng?',
              answer:
                'Bạn có thể hoàn trả khoản vay tại bất kỳ chi nhánh ngân hàng nào',
            },
          ],
        },
      ],
    });
  });
};
