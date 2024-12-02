const pool = require('../models/db');

// 게시글 등록
exports.createPost = async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO board_dong (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// 게시글 조회
exports.getPosts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM board_dong ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  const { post_no } = req.params;
  const { title, content, author } = req.body;
  try {
    const result = await pool.query(
      'UPDATE board_dong SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP WHERE post_no = $4 RETURNING *',
      [title, content, author, post_no]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  const { post_no } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM board_dong WHERE post_no = $1 RETURNING *',
      [post_no]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({
      message: 'Post deleted successfully',
      deletedPost: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
