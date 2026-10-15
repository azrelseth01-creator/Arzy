# Arzy

A tiny AI buddy with big glasses. Pure static site: no build step, no dependencies.

## Deploy to Vercel

**Drag and drop:** go to https://vercel.com/new, choose "Other / Static", and drop this folder.

**CLI:**
```
npm i -g vercel
cd arzy-vercel
vercel --prod
```

**GitHub:** push this folder to a repo, import it on Vercel, leave Framework Preset as "Other", and leave Build Command and Output Directory empty.

## Run locally
```
npx serve .
```
(Sprites load by path, so open it through a server rather than double-clicking index.html.)

## Edit Arzy
- Dialogue and personality: the `BR` rules in `index.html`
- Faces: replace the files in `assets/sprites/` (keep the names)
- Backgrounds: the `DEC` object and the `#stage[data-bg=...]` CSS
