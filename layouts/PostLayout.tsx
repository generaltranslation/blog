import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { List, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'
import ActiveTOC from '@/components/ActiveTOC'
import Bleed from 'pliny/ui/Bleed'
import SocialIcon from '@/components/social-icons'
import CopyLinkButton from '@/components/social-icons/copy-icon'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc, images } = content
  const displayImage = images && images.length > 0 ? images[0] : null

  // Use the site URL without the basePath, as Next.js will automatically add the basePath
  const siteUrlWithoutBasePath = siteMetadata.siteUrl.replace(process.env.BASE_PATH || '', '')
  const shareUrl = `${siteUrlWithoutBasePath}/${path}`
  const encodedShareUrl = encodeURIComponent(shareUrl)

  // Include summary in the share text if available
  const shareText = content.summary ? `${title} - ${content.summary}` : title
  const encodedTitle = encodeURIComponent(shareText)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            {displayImage && (
              <div className="mb-6 w-full">
                <Bleed>
                  <div className="relative aspect-2/1 w-full">
                    <Image src={displayImage} alt={title} fill className="object-cover" />
                  </div>
                </Bleed>
              </div>
            )}
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                    {' • '}
                    <span>
                      {content.readingTime.text ||
                        `${Math.ceil(content.readingTime.minutes)} min read`}
                    </span>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <div className="xl:sticky xl:top-16 xl:col-span-1">
              <dl className="pt-6 pb-4 xl:border-b xl:border-gray-200 xl:pt-11 xl:pb-10 xl:dark:border-gray-700">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                    {authorDetails.map((author) => (
                      <li className="flex items-center space-x-2" key={author.name}>
                        {author.avatar && (
                          <Link href={`/about/${author.slug}`} className="flex-shrink-0">
                            <Image
                              src={author.avatar}
                              width={38}
                              height={38}
                              alt="avatar"
                              className="h-10 w-10 cursor-pointer rounded-full"
                            />
                          </Link>
                        )}
                        <dl className="flex-grow text-sm leading-5 font-medium whitespace-nowrap">
                          <dt className="sr-only">Name</dt>
                          <Link href={`/about/${author.slug}`}>
                            <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                          </Link>
                          <dt className="sr-only">Twitter</dt>
                          <dd className="text-gray-500 dark:text-gray-400">{author.occupation}</dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>

              {/* Reading time - only visible on non-mobile (xl) screens */}
              <div className="hidden py-4 xl:block xl:border-b xl:border-gray-200 xl:py-4 xl:dark:border-gray-700">
                <h2 className="mb-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Reading Time
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {content.readingTime.text || `${Math.ceil(content.readingTime.minutes)} min read`}
                </p>
              </div>

              {/* Social sharing buttons in sidebar */}
              <div className="py-4 xl:border-b xl:border-gray-200 xl:py-4 xl:dark:border-gray-700">
                <h2 className="mb-2 text-center text-xs tracking-wide text-gray-500 uppercase xl:text-left dark:text-gray-400">
                  Share this article
                </h2>
                <div className="flex items-center justify-center space-x-4 xl:justify-start">
                  <SocialIcon
                    kind="twitter"
                    href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`}
                    size={5}
                  />
                  <SocialIcon
                    kind="linkedin"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}&title=${encodedTitle}&summary=${encodeURIComponent(content.summary || '')}&source=${encodeURIComponent(siteMetadata.title)}`}
                    size={5}
                  />
                  <SocialIcon
                    kind="x"
                    href={`https://x.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`}
                    size={5}
                  />
                  <CopyLinkButton url={shareUrl} iconSize={5} />
                </div>
              </div>

              {toc && toc.length > 0 && (
                <div className="py-4 xl:py-8">
                  <h2 className="mb-3 flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    <List className="h-4 w-4" /> On this page
                  </h2>
                  <ActiveTOC
                    toc={toc}
                    asDisclosure={false}
                    fromHeading={2}
                    toHeading={3}
                    ulClassName="space-y-2 [&_ul]:mt-2 [&_ul]:ml-4 [&_ul]:list-none"
                    liClassName="text-gray-600 text-sm hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                  />
                </div>
              )}
            </div>
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
              <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(path)} rel="nofollow">
                  Discuss on Twitter
                </Link>
                {` • `}
                <Link href={editUrl(filePath)}>View on GitHub</Link>
              </div>

              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
              {/* Footer section with tags, prev/next links, and back to blog */}
              <div className="py-6">
                {tags && (
                  <div className="border-t border-gray-200 py-4 dark:border-gray-700">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}

                {(next || prev) && (
                  <div className="flex flex-col gap-4 border-t border-gray-200 py-4 sm:flex-row sm:justify-between dark:border-gray-700">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div className="text-right">
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Link
                    href={`/${siteUrlWithoutBasePath}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Back to the blog"
                  >
                    &larr; Back to the blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
