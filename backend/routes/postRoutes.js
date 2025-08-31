const express = require("express")
const router = express.Router();
const postController = require('../controller/postController');
const { protect, authorizeRole } = require("../middleware/authMiddleware");

router.post('/professional-post',protect,postController.addPost);
router.get('/get-all-professional-post/:user_id',protect,postController.getPostByUserId);
router.get('/professional-post/:id',protect,postController.getPostById);
router.put('/professional-post/:id',protect,postController.updatePost);
router.delete('/professional-post/:id',protect,postController.deletePost);
router.post('/add-comment',protect,postController.addCommentInPost);
router.delete('/delete-comment/:post_id/:comment_id',protect,postController.deleteCommentInPost);

router.post('/add-likes',protect,postController.addLikesInPost);
router.put('/report',protect,postController.reportPost);
router.put('/image',protect,postController.updateImage);
router.put('/video',protect,postController.updateVideo);
router.delete('/delete-likes/:post_id/:like_id',protect,postController.deleteLikeInPost);

router.get('/get-all-professional-post',protect,postController.getAllPost);
router.get('/get-all-comments/:post_id',protect,postController.getAllCommentsByPostId);

router.delete('/admin/professional-post/:id',authorizeRole('admin'),postController.deletePost);


module.exports = router