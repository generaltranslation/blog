import { sortPosts, allCoreContent, coreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Enhance posts with full author details
  const postsWithAuthorDetails = posts.map((post) => {
    const authorList = post.authors || ['default']
    const authorDetails = authorList
      .map((author) => {
        const authorResults = allAuthors.find((p) => p.slug === author)
        return authorResults ? coreContent(authorResults as Authors) : null
      })
      .filter(Boolean)

    return {
      ...post,
      authorDetails,
    }
  })

  return <Main posts={postsWithAuthorDetails} />
}
