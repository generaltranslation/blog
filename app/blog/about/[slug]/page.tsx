import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const author = allAuthors.find((p) => p.slug === params.slug)
  if (!author) {
    return genPageMetadata({ title: 'Person Not Found' })
  }
  return genPageMetadata({ title: `About - ${author.name}` })
}

export const generateStaticParams = async () => {
  return allAuthors.map((author) => ({
    slug: author.slug,
  }))
}

export default function Page({ params }: { params: { slug: string } }) {
  const author = allAuthors.find((p) => p.slug === params.slug) as Authors

  if (!author) {
    notFound()
  }

  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
