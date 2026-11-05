# Social Market for GitHub Pages

1. Extract the ZIP. Upload the files and the views folder into the publishing folder of your GitHub repository. Keep index.html at the top of that folder. If you already have a live website, try this in a separate repo first.
2. In GitHub, open Settings → Pages. Choose Deploy from a branch, select main and / (root), then Save. If you uploaded to docs, choose /docs instead.
3. Open the URL shown in Settings → Pages after GitHub finishes publishing.

This static frontend uses HTML, CSS and JavaScript. It requires no install, build, Python or SQL setup. To preview locally, run python -m http.server 8000 from this folder and open http://localhost:8000.

## Demo flows

Explore and filter listings, open a detail page, and save listings. Join as the sample seller, save a profile, simulate verification, and create, preview and publish a listing. Sign out and sign in as the sample buyer to message that listing, then switch to the sample seller and reply from the dashboard. Try these flows in the same browser profile. The demo persists data in that browser and clears when you clear the site's storage.

Use only sample data. Real login, shared listings and messages, identity review, checkout, escrow, payouts and disputes require backend integration. The screens come from the earlier Figma export. Original artwork was unavailable in that export.
