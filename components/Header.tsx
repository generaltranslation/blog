import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import LogoDark from '@/data/logo-dark.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import ThemeToggle from '@/components/ThemeToggle'

const Header = () => {
  let headerClass =
    'flex items-center justify-between w-full mx-auto mt-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur py-2 px-2 md:px-6'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-2 z-50'
  }

  return (
    <header className={headerClass}>
      <div className="flex items-center">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <div className="dark:hidden">
                <Logo width={48} height={48} />
              </div>
              <div className="hidden dark:block">
                <LogoDark width={48} height={48} />
              </div>
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
        <div className="no-scrollbar ml-4 hidden max-w-40 items-center gap-x-4 overflow-x-auto md:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <SearchButton />
        <ThemeToggle />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
