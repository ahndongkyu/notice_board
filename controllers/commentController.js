const pool = require('../models/db'); // PostgreSQL 연결 객체 가져오기

// 댓글 등록
exports.createComment = async (req, res) => {
  // 요청 본문에서 댓글 정보 추출
  const { post_no, author, content } = req.body;

  try {
    // comments_dong 테이블에 새로운 댓글 추가
    const result = await pool.query(
      'INSERT INTO comments_dong (post_no, author, content) VALUES ($1, $2, $3) RETURNING *',
      [
        post_no, // 댓글이 속한 게시글 ID
        author, // 댓글 작성자
        content, // 댓글 내용
      ]
    );

    // 성공적으로 댓글이 생성되었을 경우 생성된 데이터 반환
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// 댓글 조회
exports.getComments = async (req, res) => {
  const { post_no } = req.params; // URL에서 게시글 ID 추출

  try {
    // comments_dong 테이블에서 특정 게시글에 속한 댓글 조회
    const result = await pool.query(
      'SELECT * FROM comments_dong WHERE post_no = $1 AND is_deleted = FALSE ORDER BY created_at ASC',
      [post_no] // $1: 조회 대상 게시글 ID
    );

    // 성공적으로 조회되었을 경우 댓글 목록 반환
    res.status(200).json(result.rows);
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { comment_no } = req.params; // URL에서 댓글 ID 추출
  const { content } = req.body; // 요청 본문에서 수정할 댓글 내용 추출

  try {
    // 댓글 수정 SQL 쿼리 실행
    const result = await pool.query(
      'UPDATE comments_dong SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE comment_no = $2 AND is_deleted = FALSE RETURNING *',
      [
        content, // 수정할 댓글 내용
        comment_no, // 수정 대상 댓글 ID
      ]
    );

    // 수정 대상 댓글이 없거나 삭제된 경우 404 에러 반환
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found or deleted' });
    }

    // 수정된 댓글 데이터를 반환
    res.status(200).json(result.rows[0]);
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { comment_no } = req.params; // URL에서 댓글 ID 추출

  try {
    // 댓글 소프트 삭제 처리 (is_deleted = TRUE)
    const result = await pool.query(
      'UPDATE comments_dong SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE comment_no = $1 RETURNING *',
      [comment_no] // 삭제 대상 댓글 ID
    );

    // 삭제 대상 댓글이 없거나 이미 삭제된 경우 404 에러 반환
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: 'Comment not found or already deleted' });
    }

    // 성공적으로 삭제되었을 경우 메시지와 삭제된 댓글 데이터 반환
    res.status(200).json({
      message: 'Comment deleted successfully',
      deletedComment: result.rows[0],
    });
  } catch (err) {
    // 에러 발생 시 콘솔에 출력하고, 클라이언트에 에러 메시지 반환
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
