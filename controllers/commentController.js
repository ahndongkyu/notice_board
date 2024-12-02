const pool = require('../models/db');

// 댓글 등록
exports.createComment = async (req, res) => {
  const { post_no, author, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments_dong (post_no, author, content) VALUES ($1, $2, $3) RETURNING *',
      [post_no, author, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// 댓글 조회
exports.getComments = async (req, res) => {
  const { post_no } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM comments_dong WHERE post_no = $1 AND is_deleted = FALSE ORDER BY created_at ASC',
      [post_no]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { comment_no } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      'UPDATE comments_dong SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE comment_no = $2 AND is_deleted = FALSE RETURNING *',
      [content, comment_no]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found or deleted' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { comment_no } = req.params;
  try {
    const result = await pool.query(
      'UPDATE comments_dong SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE comment_no = $1 RETURNING *',
      [comment_no]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: 'Comment not found or already deleted' });
    }
    res
      .status(200)
      .json({
        message: 'Comment deleted successfully',
        deletedComment: result.rows[0],
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
