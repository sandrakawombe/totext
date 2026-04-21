import Link from "next/link";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-cream/65
                    border-b border-lavender-600/10">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4
                      flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5
                                  font-display text-[22px] font-medium text-plum">
          <span className="w-2.5 h-2.5 rounded-full
                           bg-gradient-to-br from-magenta to-lavender-600" />
          ToText<em className="not-italic italic text-blush-500">.</em>
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-plum-soft">
          <a href="https://github.com/sandrakawombe/totext" target="_blank" rel="noopener"
             className="hover:text-magenta transition-colors">
            GitHub ↗
          </a>
          <a href="https://github.com/sandrakawombe" target="_blank" rel="noopener"
             className="hidden sm:inline hover:text-magenta transition-colors">
            By Sandra
          </a>
        </div>
      </div>
    </nav>
  );
}
