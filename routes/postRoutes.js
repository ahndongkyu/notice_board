const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/', postController.createPost); // 게시글 등록
router.get('/', postController.getPosts); // 게시글 조회
router.put('/:post_no', postController.updatePost); // 게시글 수정
router.delete('/:post_no', postController.deletePost); // 게시글 삭제

module.exports = router;
