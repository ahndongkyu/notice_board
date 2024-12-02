const express = require('express');
const app = express();
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler = require('./middlewares/errorHandler');

// 미들웨어
app.use(express.json());

// 라우터 연결
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

// 에러 처리 미들웨어
app.use(errorHandler);

// 서버 실행
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
