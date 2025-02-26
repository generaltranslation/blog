import { ReactNode } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Tag from '@/components/Tag'
import TOCInline from 'pliny/ui/TOCInline'
import { List } from 'lucide-react'
import ActiveTOC from '@/components/ActiveTOC'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export default function PostMinimal({ content, next, authorDetails, prev, children }: LayoutProps) {
  const { slug, title, images, date, tags, filePath, path, toc } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            <div className="w-full">
              <Bleed>
                <div className="relative aspect-2/1 w-full">
                  <Image src={displayImage} alt={title} fill className="object-cover" />
                </div>
              </Bleed>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
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

            {/* Author details */}
            <div className="flex justify-center pt-4">
              <ul className="flex flex-wrap justify-center gap-6">
                {authorDetails.map((author) => (
                  <li className="flex flex-col items-center space-y-2" key={author.name}>
                    {author.avatar && (
                      <Link href={`/blog/about/${author.slug}`}>
                        <Image
                          src={author.avatar}
                          width={50}
                          height={50}
                          alt="avatar"
                          className="h-12 w-12 cursor-pointer rounded-full"
                        />
                      </Link>
                    )}
                    <dl className="flex flex-col items-center text-sm font-medium">
                      <dt className="sr-only">Name</dt>
                      <Link href={`/blog/about/${author.slug}`}>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                      </Link>
                      {author.occupation && (
                        <>
                          <dt className="sr-only">Bio</dt>
                          <dd className="text-gray-500 dark:text-gray-400">
                            {author.occupation}
                            {author.company && <span> @ {author.company}</span>}
                          </dd>
                        </>
                      )}
                    </dl>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 pb-8 dark:divide-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-x-6">
                <div className="prose dark:prose-invert max-w-none pt-10 pb-8 xl:col-span-3">
                  {children}
                </div>
                <aside className="hidden xl:block">
                  <div className="sticky top-24">
                    <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
                      <List className="h-4 w-4" /> On this page
                    </h2>
                    {toc && toc.length > 0 && (
                      <ActiveTOC
                        toc={toc}
                        asDisclosure={false}
                        fromHeading={2}
                        toHeading={3}
                        ulClassName="space-y-2 [&_ul]:mt-2 [&_ul]:ml-4 [&_ul]:list-none"
                        liClassName="text-gray-600 text-sm hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                      />
                    )}
                  </div>
                </aside>
              </div>
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-y divide-gray-200 text-sm leading-5 font-medium dark:divide-gray-700">
                {tags && (
                  <div className="py-4">
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
                  <div className="flex justify-between py-4">
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
                      <div>
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
              </div>
              <div className="pt-4">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
