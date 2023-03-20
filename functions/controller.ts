// import express from 'express'
import { Request, Response } from 'express'
import { Prisma, PrismaClient, User, Post } from '@prisma/client'
const prisma = new PrismaClient()

interface  IF_datatime_range {
  lte?: string|Date;
  gte?: string|Date;
}
const parse_query = (query: any) => {
  let ret: IF_datatime_range = {};
  if (query.lte !== undefined){
    ret.lte = new Date(query.lte).toISOString()
  }
  if (query.lte !== undefined){
    ret.gte = new Date(query.gte).toISOString()
  }
  return ret
}


exports.post_signup = async (req: Request, res: Response) => {
  const { name, email, posts } = req.body
  
  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content }
  })
  
  const result: User|null = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
    },
  })
  res.json(result)
}

exports.post_post = async (req: Request, res: Response) => {
  const { title, content, authorEmail, datetime } = req.body
  // let _datetime = (datetime === undefined) ? new Date() : new Date(datetime)
  
  const result: Post|null = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { 
        connect: { 
          email: authorEmail 
        } 
      }
    },
  })
  res.json(result)
}

// app.put('/post/:id/views', 
exports.put_post_id_views = async (req: Request, res: Response) => {
    
  const { id } = req.params
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
    res.json(post)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }
}


// app.put('/publish/:id', 
exports.put_publish_id = async (req: Request, res: Response) => {

  const { id } = req.params
  try {
    const postData = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    })
  
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    })
    res.json(updatedPost)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }
}
  
// app.delete(`/post/:id`, 
exports.delete_post_id = async (req: Request, res: Response) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
}
  
// app.get('/users', 
exports.get_users = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
}

// app.get('/user/:id/drafts', 
exports.get_user_id_drafts = async (req: Request, res: Response) => {
  const { id } = req.params
  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: { published: false },
    })
    res.json(drafts)
}
  

// app.get(`/post/:id`, 
exports.get_post_id = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params
  
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })
  res.json(post)
}
  
//   app.get('/feed', 
exports.get_feed = async (req: Request, res: Response) => {
  const { searchString, skip, take, orderBy } = req.query
  
  const or: Prisma.PostWhereInput = searchString
    ? {
      OR: [
        { title: { contains: searchString as string } },
        { content: { contains: searchString as string } },
      ],
    }
    : {}
  
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  })
  res.json(posts)
}