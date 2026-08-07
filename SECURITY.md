# Security Policy

## Reporting a vulnerability

Email **shortlistready@gmail.com** with:

- Description and impact
- Steps to reproduce
- Affected URL / endpoint if known

Please allow reasonable time for remediation before public disclosure.

See also: `/.well-known/security.txt`

## Supported versions

The `main` branch and production deployment at launchlens.ai are supported.

## Security controls (summary)

- Authentication via Supabase Auth; protected product routes gated in middleware
- AI endpoints require session + rate limits + daily quotas
- Credit grants only via verified payment webhooks
- Service role key never exposed to the client
- Security headers (CSP, HSTS, frame deny)
- Production-safe structured logging (no secrets / tokens in logs)
