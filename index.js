require('dotenv').config(); // 환경 변수 로드
const express = require('express'); // Express.js
const { Pool } = require('pg'); // PostgreSQL 연결 라이브러리
const bodyParser = require('body-parser'); // 요청 본문 파싱

const app = express(); // Express 애플리케이션 생성
const port = 8000; // 서버 포트 번호

// PostgreSQL 연결 설정
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// JSON 본문 데이터를 파싱하는 미들웨어
app.use(express.json());

// 메인 페이지 응답
app.get('/', (req, res) => {
  res.send('게시판 만드는중임'); // 기본 경로로 접근 시 표시되는 메시지
});

// 1. 게시글 등록
app.post('/posts', async (req, res) => {
  // 제목, 내용, 작성자 추출
  const { title, content, author } = req.body;
  try {
    // board_dong 테이블에 새로운 게시글 추가
    const result = await pool.query(
      'INSERT INTO board_dong (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author] // $1, $2, $3은 title, content, author에 매핑
    );
    res.status(201).json(result.rows[0]); // 성공 시 생성된 게시글 반환
  } catch (err) {
    console.error(err); // 에러를 콘솔에 출력
    res.status(500).json({ error: 'Failed to create post' }); // 실패 시 에러 응답
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // 서버가 실행 중인 포트 출력
});
