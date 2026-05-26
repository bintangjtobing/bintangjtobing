import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://bintangtobing.com';
const OG_IMAGE = `${SITE_URL}/og-image.jpg?v=2`;

// Years of experience auto-grow from start years (no manual edits needed).
const FS_YEARS = new Date().getFullYear() - 2016; // Full-Stack Developer since 2016

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bintang Cato Jeremia L Tobing',
  alternateName: 'Bintang Tobing',
  url: SITE_URL,
  image: OG_IMAGE,
  jobTitle: ['Product Manager', 'Project Manager', 'Full-Stack Developer', 'Marketing Technology Manager'],
  description: `Product & Project Manager and Full-Stack Developer with ${FS_YEARS}+ years of experience, based in Indonesia and the UAE and working across ASEAN and remotely worldwide. Specializing in MarTech, AI integration, and fintech.`,
  email: 'hello@bintangtobing.com',
  telephone: '+6281262845980',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'AE',
  },
  nationality: { '@type': 'Country', name: 'Indonesia' },
  homeLocation: { '@type': 'Place', name: 'Indonesia' },
  workLocation: [
    { '@type': 'Place', name: 'United Arab Emirates' },
    { '@type': 'Place', name: 'ASEAN' },
    { '@type': 'Place', name: 'Remote, Worldwide' },
  ],
  sameAs: [
    'https://linkedin.com/in/bintangtobing',
    'https://github.com/bintangjtobing',
    'https://instagram.com/bcjlt',
    'https://www.tiktok.com/@tatangkatanyaa',
    'https://press.bintangtobing.com',
    'https://www.upwork.com/freelancers/~01981e16848fe1eecf',
  ],
  knowsAbout: [
    'Product Management',
    'Project Management',
    'Agile',
    'Scrum',
    'Marketing Technology',
    'Full-Stack Development',
    'AI Integration',
    'React.js',
    'Node.js',
    'Laravel',
    'Google Analytics',
    'n8n Automation',
    'Anthropic Claude API',
    'OpenAI GPT',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'SMK Negeri 1 Percut Sei Tuan',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Bitunix Fintech LLC',
    url: 'https://bitunix.com',
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'IBM IT Project Manager Specialization',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: 'IBM' },
      dateCreated: '2025',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Google Project Management Professional Certificate',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: 'Google' },
      dateCreated: '2024',
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Bintang Tobing',
  url: SITE_URL,
  description: 'Personal website of Bintang Tobing, Product & Project Manager and Full-Stack Developer based in Indonesia, UAE, and remote worldwide.',
  author: { '@type': 'Person', name: 'Bintang Tobing' },
  publisher: { '@type': 'Person', name: 'Bintang Tobing', url: SITE_URL },
  inLanguage: ['en', 'id'],
};

export default function SEO({
  title = 'Bintang Tobing | Product & Project Manager · Full-Stack Developer',
  description = 'Bintang Tobing, Product & Project Manager and Full-Stack Developer based in Indonesia & UAE, delivering products across ASEAN and remotely worldwide. MarTech, AI integration & fintech.',
  path = '/',
  type = 'website',
  schemas = [personSchema, websiteSchema],
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content="Bintang Tobing" />
      <meta name="publisher" content="Bintang Tobing" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="keywords" content="Bintang Tobing, Marketing Technology, Full-Stack Developer, AI Integration, Software Engineer, React.js, Node.js, Laravel, n8n, Anthropic Claude, OpenAI, MarTech" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image:alt" content="Bintang Tobing - Marketing Technology & Full-Stack Developer" />
      <meta property="og:site_name" content="Bintang Tobing" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="id_ID" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content="Bintang Tobing - Marketing Technology & Full-Stack Developer" />

      {/* Structured Data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export { personSchema, websiteSchema, SITE_URL };
