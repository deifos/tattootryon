export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'TattooTraceAI',
  description:
    'Upload your body part photo and tattoo design. Our AI shows you exactly how it\'ll look in real life.',
  navItems: [
    {
      label: 'Features',
      href: '/#features',
    },
    {
      label: 'How It Works',
      href: '/#how-it-works',
    },
    {
      label: 'Examples',
      href: '/#examples',
    },
  ],
  navMenuItems: [
    {
      label: 'Features',
      href: '/#features',
    },
    {
      label: 'How It Works',
      href: '/#how-it-works',
    },
    {
      label: 'Examples',
      href: '/#examples',
    },
    {
      label: 'Try Now',
      href: '/dashboard',
    },
  ],
  links: {
    github: 'https://github.com/deifos/tattootraceai',
    twitter: 'https://x.com/deifosv',
    docs: '/docs',
    discord: '#',
    sponsor: '#',
  },
};
