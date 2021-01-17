# 0.3

Bug fix

- Second domain request failed due to certbot lock file

Features

- Use DRY_RUN environment to apply certbot `--dry-run` flag
- Use ISOLATED environment to run without real certbot requests
- Provide script to create self signed Let's Encrypt certs for isoleted test

Enhancement

- Use syncron child processes only to stop using async await decorators
- Add more tests to `certbot` lib

# 0.2

Bug fix

- Renewal failed for single domain request

Other

- Add optional environment variables to readme

# 0.1

- Major rewrite to Node and TypeScript