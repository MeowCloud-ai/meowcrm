<?xml version="1.0" encoding="UTF-8"?>
<audit version="0.0.38">
<site url="https://crm.meowcloud.ai" crawled="4" date="2026-02-26T05:10:04.341Z"/>
<score overall="33" grade="F">
 <cat name="Core SEO" score="61"/>
 <cat name="Performance" score="93"/>
 <cat name="Crawlability" score="63"/>
 <cat name="Accessibility" score="95"/>
 <cat name="Content" score="73"/>
 <cat name="E-E-A-T" score="53"/>
 <cat name="Security" score="80"/>
 <cat name="Links" score="90"/>
 <cat name="Legal Compliance" score="44"/>
 <cat name="Images" score="100"/>
 <cat name="Mobile" score="100"/>
 <cat name="URL Structure" score="100"/>
</score>
<summary passed="284" warnings="66" failed="5"/>
<issues>
 <category name="Crawlability" errors="1" warnings="1">
  <rule id="crawl/sitemap-exists" severity="error" status="fail" docs="https://docs.squirrelscan.com/rules/crawl/sitemap-exists">
   No XML sitemap found
  </rule>
  <rule id="crawl/robots-txt" severity="error" status="warn" docs="https://docs.squirrelscan.com/rules/crawl/robots-txt">
   No robots.txt found
  </rule>
 </category>
 <category name="Core SEO" errors="3" warnings="29">
  <rule id="core/meta-title" severity="error" status="warn" docs="https://docs.squirrelscan.com/rules/core/meta-title">
   Title too short
   Pages (4): /, /forgot-password, /login, /signup
   Items (4):
    - / (MeowCRM — 自動導航 CRM (18 chars))
    - /signup (MeowCRM — 自動導航 CRM (18 chars))
    - /login (MeowCRM — 自動導航 CRM (18 chars))
    - /forgot-password (MeowCRM — 自動導航 CRM (18 chars))
  </rule>
  <rule id="core/h1" severity="error" status="fail" docs="https://docs.squirrelscan.com/rules/core/h1">
   No H1 tag found
   Pages (3): /forgot-password, /login, /signup
   Items (3):
    - /signup (No H1 tag found)
    - /login (No H1 tag found)
    - /forgot-password (No H1 tag found)
  </rule>
  <rule id="core/meta-description" severity="error" status="warn" docs="https://docs.squirrelscan.com/rules/core/meta-description">
   Description too short
   Pages (4): /, /forgot-password, /login, /signup
   Items (4):
    - / (MeowCRM 是一個極簡 CRM 系統，讓會議數據自動流入客戶管理。 (35 chars))
    - /signup (MeowCRM 是一個極簡 CRM 系統，讓會議數據自動流入客戶管理。 (35 chars))
    - /login (MeowCRM 是一個極簡 CRM 系統，讓會議數據自動流入客戶管理。 (35 chars))
    - /forgot-password (MeowCRM 是一個極簡 CRM 系統，讓會議數據自動流入客戶管理。 (35 chars))
  </rule>
  <rule id="core/canonical" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/core/canonical">
   Missing canonical URL
   Pages (4): /, /forgot-password, /login, /signup
  </rule>
  <rule id="core/og-tags" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/core/og-tags">
   Missing og:title; Missing og:description; Missing og:image - social shares will lack imagery
   Pages (4): /, /forgot-password, /login, /signup
  </rule>
  <rule id="core/title-unique" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/core/title-unique">
   1 duplicate title(s) affecting 4 pages
   Items (1):
    - meowcrm — 自動導航 crm (&quot;meowcrm — 自動導航 crm...&quot; (4 pages)) [pageCount: 4] (from: /, /signup, /login, /forgot-password)
  </rule>
  <rule id="core/twitter-cards" severity="info" status="warn" docs="https://docs.squirrelscan.com/rules/core/twitter-cards">
   No Twitter card or Open Graph tags for Twitter sharing
   Pages (4): /, /forgot-password, /login, /signup
  </rule>
 </category>
 <category name="Security" errors="0" warnings="4">
  <rule id="security/csp" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/security/csp">
   No Content-Security-Policy header
  </rule>
  <rule id="security/x-frame-options" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/security/x-frame-options">
   No clickjacking protection
  </rule>
  <rule id="security/form-captcha" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/security/form-captcha">
   1 public form(s) without CAPTCHA
   Pages (1): /forgot-password
   Items (1):
    - form[0]
  </rule>
  <rule id="security/http-to-https" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/security/http-to-https">
   4 HTTP URL(s) redirect to HTTPS
   Items (4):
    - http://crm.meowcloud.ai/ (http://crm.meowcloud.ai/ → https://crm.meowcloud.ai/ (308)) [statusCode: 308, chain: {&quot;sourceUrl&quot;:&quot;http://crm.meowcloud.ai/&quot;,&quot;finalUrl&quot;:&quot;https://crm.meowcloud.ai/&quot;,&quot;hops&quot;:[{&quot;url&quot;:&quot;http://crm.meowcloud.ai/&quot;,&quot;statusCode&quot;:308,&quot;type&quot;:&quot;http&quot;},{&quot;url&quot;:&quot;https://crm.meowcloud.ai/&quot;,&quot;statusCode…]
    - http://crm.meowcloud.ai/signup (http://crm.meowcloud.ai/signup → https://crm.meowcloud.ai/signup (308)) [statusCode: 308, chain: {&quot;sourceUrl&quot;:&quot;http://crm.meowcloud.ai/signup&quot;,&quot;finalUrl&quot;:&quot;https://crm.meowcloud.ai/signup&quot;,&quot;hops&quot;:[{&quot;url&quot;:&quot;http://crm.meowcloud.ai/signup&quot;,&quot;statusCode&quot;:308,&quot;type&quot;:&quot;http&quot;},{&quot;url&quot;:&quot;https://crm.meowclou…]
    - http://crm.meowcloud.ai/login (http://crm.meowcloud.ai/login → https://crm.meowcloud.ai/login (308)) [statusCode: 308, chain: {&quot;sourceUrl&quot;:&quot;http://crm.meowcloud.ai/login&quot;,&quot;finalUrl&quot;:&quot;https://crm.meowcloud.ai/login&quot;,&quot;hops&quot;:[{&quot;url&quot;:&quot;http://crm.meowcloud.ai/login&quot;,&quot;statusCode&quot;:308,&quot;type&quot;:&quot;http&quot;},{&quot;url&quot;:&quot;https://crm.meowcloud.a…]
    - http://crm.meowcloud.ai/forgot-password (http://crm.meowcloud.ai/forgot-password → https://crm.meowcloud.ai/forgot-password (308)) [statusCode: 308, chain: {&quot;sourceUrl&quot;:&quot;http://crm.meowcloud.ai/forgot-password&quot;,&quot;finalUrl&quot;:&quot;https://crm.meowcloud.ai/forgot-password&quot;,&quot;hops&quot;:[{&quot;url&quot;:&quot;http://crm.meowcloud.ai/forgot-password&quot;,&quot;statusCode&quot;:308,&quot;type&quot;:&quot;http&quot;},{…]
  </rule>
 </category>
 <category name="Links" errors="0" warnings="2">
  <rule id="links/orphan-pages" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/links/orphan-pages">
   1 orphan page(s) with &lt;2 incoming links
   Items (1):
    - /forgot-password
  </rule>
  <rule id="links/weak-internal-links" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/links/weak-internal-links">
   1 page(s) have only 1 internal link
   Items (1):
    - /forgot-password
  </rule>
 </category>
 <category name="Content" errors="0" warnings="6">
  <rule id="content/duplicate-title" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/content/duplicate-title">
   1 duplicate title(s) found across 4 pages
   Items (1):
    - meowcrm — 自動導航 crm (&quot;meowcrm — 自動導航 crm...&quot; (4 pages)) [pageCount: 4] (from: /, /signup, /login, /forgot-password)
  </rule>
  <rule id="content/duplicate-description" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/content/duplicate-description">
   1 duplicate description(s) found across 4 pages
   Items (1):
    - meowcrm 是一個極簡 crm 系統，讓會議數據自動流入客戶管理。 (&quot;meowcrm 是一個極簡 crm 系統，讓會議數據自動流入客戶管理。...&quot; (4 pages)) [pageCount: 4] (from: /, /signup, /login, /forgot-password)
  </rule>
  <rule id="content/word-count" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/content/word-count">
   Thin content: N words (min N)
   Pages (4): /, /forgot-password, /login, /signup
   Items (4):
    - / (Thin content: 13 words (min 300))
    - /signup (Thin content: 2 words (min 300))
    - /login (Thin content: 2 words (min 300))
    - /forgot-password (Thin content: 2 words (min 300))
  </rule>
 </category>
 <category name="Performance" errors="1" warnings="5">
  <rule id="perf/ttfb" severity="warning" status="fail" docs="https://docs.squirrelscan.com/rules/perf/ttfb">
   Very slow server response (1050ms); Slow server response (801ms)
   Pages (2): /login, /signup
   Items (2):
    - /signup (Very slow server response (1050ms))
    - /login (Slow server response (801ms))
  </rule>
  <rule id="perf/critical-request-chains" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/perf/critical-request-chains">
   2 critical request chain(s) found
   Pages (4): /, /forgot-password, /login, /signup
   Items (2):
    - CSS: /_next/static/chunks/4db70ee2ee530538.css
    - JS: /_next/static/chunks/a6dad97d9634a72d.js
  </rule>
 </category>
 <category name="Accessibility" errors="0" warnings="13">
  <rule id="a11y/color-contrast" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/a11y/color-contrast">
   N potential color contrast issue(s)
   Pages (4): /, /forgot-password, /login, /signup
   Items (5/9):
    - div with class &quot;mt-8 text-center text-sm text-...&quot; may have low contrast
    - White text (verify background): 1 instance(s)
    - Very light text color: 1 instance(s)
    - div with class &quot;text-muted-foreground text-sm...&quot; may have low contrast
    - input with class &quot;file:text-foreground placehold...&quot; may have low contrast
  </rule>
  <rule id="a11y/landmark-one-main" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/a11y/landmark-one-main">
   Page has no main landmark
   Pages (3): /forgot-password, /login, /signup
  </rule>
  <rule id="a11y/skip-link" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/a11y/skip-link">
   No bypass mechanism for repetitive content
   Pages (3): /forgot-password, /login, /signup
  </rule>
  <rule id="a11y/landmark-regions" severity="info" status="warn" docs="https://docs.squirrelscan.com/rules/a11y/landmark-regions">
   No &lt;main&gt; landmark found
   Pages (3): /forgot-password, /login, /signup
  </rule>
 </category>
 <category name="E-E-A-T" errors="0" warnings="5">
  <rule id="eeat/about-page" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/eeat/about-page">
   No About page found
  </rule>
  <rule id="eeat/author-byline" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/eeat/author-byline">
   No content pages have author attribution
  </rule>
  <rule id="eeat/contact-page" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/eeat/contact-page">
   No Contact page found
  </rule>
  <rule id="eeat/privacy-policy" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/eeat/privacy-policy">
   No Privacy Policy page found
  </rule>
  <rule id="eeat/content-dates" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/eeat/content-dates">
   No content pages have datePublished
  </rule>
 </category>
 <category name="Legal Compliance" errors="0" warnings="1">
  <rule id="legal/privacy-policy" severity="warning" status="warn" docs="https://docs.squirrelscan.com/rules/legal/privacy-policy">
   No privacy policy link found across site
  </rule>
 </category>
</issues>
</audit>