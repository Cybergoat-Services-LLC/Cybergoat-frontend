import { NextResponse } from 'next/server';
import { TRAINING_PROGRAMS, CERTIFICATIONS } from '../components/courses-data';

export async function GET() {
  const siteUrl = 'https://www.cybergoat.ae';

  const allItems = [...CERTIFICATIONS, ...TRAINING_PROGRAMS];

  const rssItemsXml = allItems
    .map((item) => {
      const itemUrl = `${siteUrl}/#courses`;
      const pubDate = new Date().toUTCString();

      return `
    <item>
      <title><![CDATA[${item.title} — CyberGOAT Training]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="false">${siteUrl}/course/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.description} Level: ${item.level || 'Professional'}. Category: ${item.category || 'Cybersecurity'}. Dubai Silicon Oasis Campus & Online Virtual.]]></description>
      <category>${item.category || 'Cybersecurity'}</category>
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CyberGOAT Cybersecurity Academy &amp; Certification Insights</title>
    <link>${siteUrl}</link>
    <description>Official RSS feed for CyberGOAT Services LLC (Dubai Silicon Oasis, UAE). EC-Council Authorized Reseller &amp; Training Partner.</description>
    <language>en-us</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
