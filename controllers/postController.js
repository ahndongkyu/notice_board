const pool = require('../models/db'); // PostgreSQL 연결 객체 가져오기

// 게시글 등록
exports.createPost = async (req, res) => {
  // 요청 본문에서 게시글 정보 추출
  const { title, content, author } = req.body;

  try {
    // board_dong 테이블에 새로운 게시글 추가
    const result = await pool.query(
      'INSERT INTO board_dong (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [
        title, // 게시글 제목
        content, // 게시글 내용
        author, // 작성자 이름
      ]
    );

    // 성공적으로 게시글이 생성되었을 경우 생성된 데이터를 반환
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// 게시글 조회
exports.getPosts = async (req, res) => {
  try {
    // board_dong 테이블에서 모든 게시글을 작성 날짜 기준 내림차순으로 가져오기
    const result = await pool.query(
      'SELECT * FROM board_dong ORDER BY created_at DESC'
    );

    // 성공적으로 조회되었을 경우 게시글 목록을 반환
    res.status(200).json(result.rows);
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  const { post_no } = req.params; // URL에서 게시글 ID 추출
  const { title, content, author } = req.body; // 요청 본문에서 수정할 데이터 추출

  try {
    // 게시글 수정 SQL 쿼리 실행
    const result = await pool.query(
      'UPDATE board_dong SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP WHERE post_no = $4 RETURNING *',
      [
        title, // 수정할 게시글 제목
        content, // 수정할 게시글 내용
        author, // 수정할 작성자 이름
        post_no, //  수정 대상 게시글 ID
      ]
    );

    // 수정 대상 게시글이 없으면 404 에러 반환
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 수정된 게시글 데이터를 반환
    res.status(200).json(result.rows[0]);
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  const { post_no } = req.params; // URL에서 게시글 ID 추출

  try {
    // 게시글 삭제 SQL 쿼리 실행
    const result = await pool.query(
      'DELETE FROM board_dong WHERE post_no = $1 RETURNING *',
      [post_no] // 삭제 대상 게시글 ID
    );

    // 삭제 대상 게시글이 없으면 404 에러 반환
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 성공적으로 삭제되었을 경우 메시지와 삭제된 게시글 데이터를 반환
    res.status(200).json({
      message: 'Post deleted successfully',
      deletedPost: result.rows[0],
    });
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
