// JSON-LD builders. Every page emits one @graph containing the publisher
// Organization, the WebSite, a WebPage and a BreadcrumbList, plus the
// page-specific types (Article, FAQPage, ItemList, TouristDestination,
// TravelAgency / Organization). scripts/validate-jsonld.mjs checks the output.

import { site, publisher } from '../../site.config.mjs';
import { countryName } from './feed.mjs';
import { places } from './format.mjs';

export const abs = (p) => new URL(p, site.url).href.replace(/\/$/, p === '/' ? '/' : '');

export const ids = {
  publisher: `${publisher.url}/#organization`,
  website: `${site.url}/#website`,
  destination: `${site.url}/#destination`,
};

export function publisherNode() {
  return {
    '@type': 'Organization',
    '@id': ids.publisher,
    name: publisher.name,
    url: publisher.url,
    email: site.email,
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: site.name,
    url: site.url + '/',
    description: site.positioning,
    inLanguage: site.language,
    publisher: { '@id': ids.publisher },
  };
}

export function webPageNode({ path, title, description, type = 'WebPage', mainEntity }) {
  return {
    '@type': type,
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name: title,
    description,
    inLanguage: site.language,
    isPartOf: { '@id': ids.website },
    breadcrumb: { '@id': `${abs(path)}#breadcrumb` },
    ...(mainEntity ? { mainEntity: { '@id': mainEntity } } : {}),
  };
}

export function breadcrumbNode(path, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

export function articleNode({ path, title, description, published, modified, sources = [] }) {
  return {
    '@type': 'Article',
    '@id': `${abs(path)}#article`,
    headline: title.slice(0, 110),
    description,
    url: abs(path),
    mainEntityOfPage: { '@id': `${abs(path)}#webpage` },
    datePublished: published,
    dateModified: modified,
    inLanguage: site.language,
    author: { '@id': ids.publisher },
    publisher: { '@id': ids.publisher },
    image: abs('/og.png'),
    citation: sources.map((s) => ({ '@type': 'CreativeWork', name: s.label, url: s.url })),
  };
}

export function faqNode({ path, question, answer }) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      },
    ],
  };
}

export function faqListNode({ path, items }) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer, url: abs(q.href) },
    })),
  };
}

export function itemListNode({ path, name, companies }) {
  return {
    '@type': 'ItemList',
    '@id': `${abs(path)}#list`,
    name,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: companies.length,
    itemListElement: companies.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/operators/${c.id}`),
      name: c.name,
    })),
  };
}

export function companyNode(c, path) {
  return {
    '@type': c.kind === 'agency' ? 'TravelAgency' : 'Organization',
    '@id': `${abs(path)}#company`,
    name: c.name,
    description: c.summary,
    url: c.profile_url,
    ...(c.website ? { sameAs: [c.website] } : {}),
    address: { '@type': 'PostalAddress', addressCountry: c.country_base },
    areaServed: c.delivers_in.map((code) => ({ '@type': 'Place', name: countryName(code) })),
    ...(c.memberships?.length ? { memberOf: c.memberships.map((m) => ({ '@type': 'Organization', name: m.name ?? m, ...(m.url ? { url: m.url } : {}) })) } : {}),
    subjectOf: { '@id': `${abs(path)}#webpage` },
  };
}

export function destinationNode() {
  const keys = ['antarctic-peninsula', 'south-shetland-islands', 'weddell-sea', 'ross-sea', 'south-georgia', 'falkland-islands', 'drake-passage'];
  return {
    '@type': ['TouristDestination', 'Place'],
    '@id': ids.destination,
    name: 'Antarctica',
    description:
      'Antarctica as a travel destination: the Antarctic Peninsula, South Shetland Islands, Weddell Sea, Ross Sea and the sub-Antarctic islands of South Georgia and the Falklands.',
    url: abs('/guide'),
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    containsPlace: keys.map((k) => ({
      '@type': 'Place',
      name: places[k].name,
      geo: { '@type': 'GeoCoordinates', latitude: places[k].lat, longitude: places[k].lon },
    })),
  };
}

export function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.flat().filter(Boolean) };
}
