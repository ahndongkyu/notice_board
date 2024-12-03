// 에러 처리 미들웨어
const errorHandler = (err, req, res, next) => {
  // 에러 스택 트레이스를 콘솔에 출력
  console.error(err.stack);

  // 클라이언트에 500 상태 코드와 에러 메시지 응답
  res.status(500).json({ error: 'Something went wrong!' });
};

// 모듈로 내보내기
module.exports = errorHandler;
