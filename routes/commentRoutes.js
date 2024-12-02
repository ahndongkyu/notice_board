const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.createComment); // 댓글 등록
router.get('/:post_no', commentController.getComments); // 댓글 조회
router.put('/:comment_no', commentController.updateComment); // 댓글 수정
router.delete('/:comment_no', commentController.deleteComment); // 댓글 삭제

module.exports = router;
