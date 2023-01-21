// import express from 'express';
import { Router } from 'express'
const { 
  post_signup, 
  post_post,
  put_post_id_views,
  put_publish_id,
  delete_post_id,
  get_user_id_drafts,
  get_post_id,
  get_feed
} = require('./controller')

const router: Router = Router()

router.post('/signup', post_signup)
router.post('/post_post', post_post)
router.put('/post/:id/views', put_post_id_views)
router.put('/publish/:id', put_publish_id)
router.delete('/post/:id', delete_post_id)
router.get('/user/:id/drafts', get_user_id_drafts)
router.get(`/post/:id`, get_post_id)
router.get(`/feed`, get_feed)

module.exports = router;
