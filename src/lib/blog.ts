import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  readingTime: string
  content: string
  published: boolean
  metaDescription?: string
  featuredImage?: string
}

export function getAllPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPosts = fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(name => {
        const slug = name.replace(/\.mdx$/, '')
        return getPostBySlug(slug)
      })
      .filter(post => post.published)
      .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))

    return allPosts
  } catch (error) {
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const readingTimeStats = readingTime(content)

  return {
    slug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    date: data.date || '',
    author: data.author || 'admitme Team',
    tags: data.tags || [],
    readingTime: readingTimeStats.text,
    content,
    published: data.published ?? true,
    metaDescription: data.metaDescription,
    featuredImage: data.featuredImage,
  }
}

export function getPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(name => name.replace(/\.mdx$/, ''))
  } catch (error) {
    return []
  }
}

export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  )
} 