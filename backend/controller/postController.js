const Comments = require("../models/commentsModel");
const Likes = require("../models/likesModel");
const Posts = require("../models/postModel");
const OpenAI = require("openai");
const AWS = require("aws-sdk");
const ActivityModel = require('../models/ActivityModel');


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

var postController = {};


const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.Access_Key_ID,
  secretAccessKey: process.env.Secret_Access_Key,
  region: 'us-east-2',
});

// Function to moderate image/video using AWS Rekognition
const moderateMedia = async (mediaUrl) => {
  try {
    // Fetch image/video buffer from URL
    const response = await fetch(mediaUrl);
    const buffer = await response.arrayBuffer();

    // Rekognition API call for moderation
    const params = {
      Image: {
        Bytes: Buffer.from(buffer),
      },
    };

    const moderationResult = await rekognition.detectModerationLabels(params).promise();

    // If any inappropriate content is detected, return true
    return moderationResult.ModerationLabels.length > 0;
  } catch (error) {
    console.log(`AWS Rekognition Error: ${error.message}`);
    return false;
  }
};

postController.addPost = async function (req, res) {
  const { caption, image_url, video_url } = req.body;

  try {
    // 📝 Step 1: AI Moderation Check (Text)
    const moderationResponse = await openai.moderations.create({
      input: caption,
    });

    if (moderationResponse.results[0].flagged) {
      return res.status(400).json({ msg: "Text contains inappropriate content", success: false });
    }

    // 📸 Step 2: Check Image/Video URLs (If Exist)
    if (image_url && image_url.length > 0) {
      for (let url of image_url) {
        const isExplicit = await moderateMedia(url);
        if (isExplicit) {
          return res.status(400).json({ msg: "Image contains inappropriate content", success: false });
        }
      }
    }

    if (video_url && video_url.length > 0) {
      for (let url of video_url) {
        const isExplicit = await moderateMedia(url);
        if (isExplicit) {
          return res.status(400).json({ msg: "Video contains inappropriate content", success: false });
        }
      }
    }

    // ✅ Step 3: Save the Post If Everything Is Clean
    const newPost = new Posts(req.body);
    const savedPost = await newPost.save();

    res.status(200).json({ msg: "Post created successfully", savedPost, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


postController.updateImage = async function (req, res) {
  const { image_url, postId, delete: isDelete } = req.body;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found", success: false });
    }

    if (isDelete) {
      // Remove the specified image URLs
      post.image_url = post.image_url.filter(url => !image_url.includes(url));
    } else if (image_url && image_url.length > 0) {
      // Moderate images before adding
      for (let url of image_url) {
        const isExplicit = await moderateMedia(url);
        if (isExplicit) {
          return res.status(400).json({ msg: "Image contains inappropriate content", success: false });
        }
      }
      post.image_url.push(...image_url);
    }

    await post.save();

    res.status(200).json({ msg: "Post updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



postController.updateVideo = async function (req, res) {
  const { video_url, postId, delete: isDelete } = req.body;


  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found", success: false });
    }

    if (isDelete) {
      // Remove the specified video URLs
      post.video_url = post.video_url.filter(url => !video_url.includes(url));
    } else if (video_url && video_url.length > 0) {
      // Moderate videos before adding
      for (let url of video_url) {
        const isExplicit = await moderateMedia(url);
        if (isExplicit) {
          return res.status(400).json({ msg: "Video contains inappropriate content", success: false });
        }
      }
      post.video_url.push(...video_url);
    }

    await post.save();

    res.status(200).json({ msg: "Post updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



postController.updatePost = async function (req, res) {
  try {


    // 📝 Step 1: AI Moderation Check (Text)
    const moderationResponse = await openai.moderations.create({
      input: req.body.caption,
    });

    if (moderationResponse.results[0].flagged) {
      return res.status(400).json({ msg: "Text contains inappropriate content", success: false });
    }

    const updatedPost = await Posts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedPost) {
      res.status(200).json({ msg: "Post updated successfully", updatedPost, success: true });
    } else {
      res.status(404).json({ message: "Interest Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

postController.reportPost = async function (req, res) {
  try {

    const findpost = await Posts.findById(req.body.id);

    findpost.isReported = true;

    await findpost.save();

    res.status(200).json({ msg: "Post Reported successfully", success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


postController.getPostById = async function (req, res) {
  try {
    const post = await Posts.findById(req.params.id);
    const postIdArray = post._id

    const likes = await Likes.find({ post_id: { $in: postIdArray } })
      .sort({ created: -1 })
      .populate("user_id") // Populate user_id field with data from user model
      .lean();


    const comments = await Comments.find({ post_id: { $in: postIdArray } })
      .sort({ created: -1 })
      .populate("user_id") // Populate user_id field with data from user model
      .lean();

    res.status(200).json({ post, likes, comments });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

postController.getPostByUserId = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit;

    const post = await Posts.find({ user_id: req.params.user_id })
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const postIdArray = post.map((val) => val._id)

    const likes = await Likes.find({ post_id: { $in: postIdArray } })
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id") // Populate user_id field with data from user model
      .lean();

    const groupedLikes = {};

    likes.forEach((like) => {
      const postId = like.post_id;

      // If the post_id is not in the result object, add it with an array containing the like
      if (!groupedLikes[postId]) {
        groupedLikes[postId] = [like];
      } else {
        // Push the like to the existing array for the post_id
        groupedLikes[postId].push(like);
      }
    });

    const comments = await Comments.find({ post_id: { $in: postIdArray } })
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id") // Populate user_id field with data from user model
      .lean();

    const groupedComments = {};

    comments.forEach((comment) => {
      const postId = comment.post_id;
      // If the post_id is not in the result object, add it with an array containing the comment
      if (!groupedComments[postId]) {
        groupedComments[postId] = [comment];
      } else {
        // Push the comment to the existing array for the post_id
        groupedComments[postId].push(comment);
      }
    });

    post.map((val) => {
      val.likes = groupedLikes[val._id]
      val.comments = groupedComments[val._id]
    })

    res.status(200).json(post);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};


postController.getAllPost = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user_id = req.query.user_id;

    let postsQuery = {}; // Default: fetch all posts
    const { isReported } = req.query;

    if (isReported === "true") {
      postsQuery.isReported = true; // Only fetch reported posts
    } else if (user_id) {
      postsQuery.user_id = user_id; // Fetch posts for the given user_id
    }

    // Fetch posts with pagination and filtering
    const posts = await Posts.find(postsQuery)
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id")
      .lean();

    const postIdArray = posts.map((val) => val._id);

    // Fetch likes
    const likes = await Likes.find({ post_id: { $in: postIdArray } })
      .sort({ created: -1 })
      .populate("user_id")
      .lean();

    // Group likes by post_id
    const groupedLikes = likes.reduce((acc, like) => {
      const postId = like.post_id.toString();
      if (!acc[postId]) acc[postId] = [];
      acc[postId].push(like);
      return acc;
    }, {});

    // Fetch comments
    const comments = await Comments.find({ post_id: { $in: postIdArray } })
      .sort({ created: -1 })
      .populate("user_id")
      .lean();

    // Group comments by post_id
    const groupedComments = comments.reduce((acc, comment) => {
      const postId = comment.post_id.toString();
      if (!acc[postId]) acc[postId] = [];
      acc[postId].push(comment);
      return acc;
    }, {});

    // Merge likes and comments with posts
    posts.forEach((post) => {
      post.likes = groupedLikes[post._id.toString()] || [];
      post.comments = groupedComments[post._id.toString()] || [];
    });

    // Determine if there are more posts to load
    const hasMore = posts.length === limit;

    res.status(200).json({ posts, hasMore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







postController.deletePost = async function (req, res) {
  try {
    const deletedPost = await Posts.findByIdAndDelete(req.params.id);

    await ActivityModel.create({
      action: 'Deletes Post',
      user: req.user._id
    });

    if (deletedPost) {
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


postController.addCommentInPost = async function (req, res) {
  try {
    const { post_id } = req.body;

    const comments = new Comments(req.body);

    const savedPost = await comments.save();

    const updatedPost = await Posts.findByIdAndUpdate(
      post_id,
      { $inc: { comments_count: 1 } },
      { new: true }
    );
    res.status(200).json({ msg: "Comments created successfully", savedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
postController.deleteCommentInPost = async function (req, res) {
  try {
    console.log(req.params.comment_id)
    const deletedComment = await Comments.findByIdAndDelete(req.params.comment_id);


    if (deletedComment) {
      const updatedPost = await Posts.findByIdAndUpdate(
        req.params.post_id,
        { $inc: { comments_count: -1 } },
        { new: true }
      );

      res.json({ message: "Comments deleted successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

postController.addLikesInPost = async function (req, res) {
  try {
    const { post_id } = req.body;

    const likes = new Likes(req.body);
    const savedLikes = await likes.save();
    const updatedPost = await Posts.findByIdAndUpdate(
      post_id,
      { $inc: { likes_count: 1 } },
      { new: true }
    );
    res.status(200).json({ msg: "Likes created successfully", savedLikes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
postController.getAllCommentsByPostId = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit;

    const comments = await Comments.find({ post_id: req.params.post_id })
      .sort({ created_date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id") // Populate user_id field with data from user model
      .lean();

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
postController.deleteLikeInPost = async function (req, res) {
  try {
    const deletedLike = await Likes.findByIdAndDelete(req.params.like_id);


    if (deletedLike) {
      const updatedPost = await Posts.findByIdAndUpdate(
        req.params.post_id,
        { $inc: { likes_count: -1 } },
        { new: true }
      );

      res.json({ message: "Likes deleted successfully" });
    } else {
      res.status(404).json({ message: "Like not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = postController