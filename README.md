# Arzy 2.0

A tiny AI buddy with big glasses: chat, wardrobe, a customizable room, a care system, and a Claude-powered brain.

## Deploy to Vercel
1. Push this folder to GitHub (or run `vercel` in it). Framework preset: **Other**. No build command.
2. **Project Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` (required for the smart brain)
   - `ANTHROPIC_MODEL` (optional, default `claude-sonnet-5-5`; use `claude-haiku-5-5` for cheaper, faster replies)
   - `ARZY_WEB_SEARCH=1` (optional, lets him look up recent pop culture; extra cost)
3. Redeploy. Without the key, Arzy still works using his built-in keyword brain.

## Local dev
```
npm i -g vercel
cp .env.example .env     # put your key in .env
vercel dev
```

## Notes
- Anyone with the URL can chat and spend your API credits. Add a spending limit in the Anthropic console, or put the site behind Vercel Password Protection.
- Room, outfit and stats are saved in each visitor's browser (localStorage).
- Edit `api/chat.js` to change his personality. Sprites live in `assets/sprites/` (keep the filenames).

## Memory
Arzy keeps a long-term memory (the 🧠 Mind tab) in each visitor's browser. Claude adds facts with `[mem:...]` tags as you chat, and you can add, delete or clear them. It is sent with every message so he remembers across sessions.
