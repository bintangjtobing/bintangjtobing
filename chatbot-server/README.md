# Bintang Chatbot (server)

Small Node proxy that powers the chat widget on bintangtobing.com. It holds the
OpenAI API key (never exposed to the browser), injects the curated knowledge base
+ guardrails as a system prompt, and streams GPT answers back over SSE.

## Files
- `server.js` — Express proxy, streaming, rate limit, daily cap, origin guard
- `system-prompt.md` — persona + hard guardrails (no phone/NIK/SARA/relationships)
- `knowledge-base.md` — curated, public-safe facts (edit this to update what the bot knows)
- `.env.example` — copy to `.env` and fill in `OPENAI_API_KEY`

## Deploy (server: root@72.60.133.130)
```bash
# 1. Copy this folder to the server (run from the repo root locally)
rsync -av --exclude node_modules --exclude .env chatbot-server/ \
  root@72.60.133.130:/var/www/bintang-chatbot/

# 2. On the server: install deps + set the key
ssh root@72.60.133.130
cd /var/www/bintang-chatbot
npm ci --omit=dev          # or: npm install --omit=dev
cp .env.example .env
nano .env                  # paste real OPENAI_API_KEY, keep PORT=8787

# 3. Start under PM2
pm2 start ecosystem.config.cjs
pm2 save

# 4. Health check
curl -s http://127.0.0.1:8787/api/health
```

## nginx (add inside the bintangtobing.com :443 server block, BEFORE `location = /`)
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # streaming (SSE): disable buffering
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 120s;
}
```
Then `nginx -t && systemctl reload nginx`.

## Updating the knowledge base
Edit `knowledge-base.md` on the server (or redeploy it), then `pm2 restart bintang-chatbot`.
Never put private data (phone, NIK, address, family) in the knowledge base.
