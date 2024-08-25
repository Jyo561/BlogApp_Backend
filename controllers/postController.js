const Post = require('../models/Post');
const sequelize = require('../config/database');
const length = 0;
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const count = await Post.count();
    var cc = count+1;
    const title = req.body.title;
    const content = req.body.content;
    const [result] = await sequelize.query(
      `INSERT INTO "Posts" ("id", "title", "content", "createdAt", "updatedAt") 
       VALUES (:cc, :title, :content, NOW(), NOW())
       RETURNING *`, 
      {
        replacements: { cc, title, content },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    const newPost = result[0]; // Since RETURNING * returns the inserted row

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad request', details: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPost = await Post.findByPk(req.params.id);
      res.json(updatedPost);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

