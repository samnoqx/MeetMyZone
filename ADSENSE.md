# AdSense preparation

The current website has five complete scheduling guides, interactive timezone tools, a site-wide footer with About, Contact, Privacy and Terms links, and a crawlable production sitemap. The existing support email, support@meetmyzone.com, was confirmed by the owner as configured through Cloudflare.

Removed the fake AdSense publisher ID and misleading claim that a Google-certified consent platform was already installed. No ad script currently runs. Optional Analytics requires a visitor's explicit opt-in; tracking is disabled when no Analytics ID is configured. Incomplete articles return 404 and are excluded from the generated blog slugs instead of displaying a preparation placeholder.

Before submitting the live domain:

- Deploy the reviewed build to the actual domain and check navigation, mobile layout, tool interaction and HTTPS there.
- Use the verification method and real publisher ID supplied by your AdSense account. The current ads.txt intentionally contains no fake seller entry; replace it only with your account's actual required entry.
- Configure the appropriate consent platform before enabling advertising. This site's optional Analytics choice is not a certified advertising CMP.
- Keep the privacy page synchronized with the advertising and third-party services actually enabled.

Google reviews site content and usability as well as account eligibility; repository cleanup alone does not grant approval.

Official guidance: https://support.google.com/adsense/answer/7299563 and https://support.google.com/adsense/answer/48182.
