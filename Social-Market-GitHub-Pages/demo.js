const key = 'social-market-pages-demo-v1';
const sampleListings = [
  { id: -1, platform: 'YouTube', title: 'Tech tutorial channel', niche: 'Technology', followers: 42000, price: 95000 },
  { id: -2, platform: 'TikTok', title: 'Food and recipe account', niche: 'Food', followers: 28000, price: 35000 },
  { id: -3, platform: 'Facebook', title: 'Home and garden page', niche: 'Lifestyle', followers: 18000, price: 26000 },
  { id: -4, platform: 'Instagram', title: 'Travel photography account', niche: 'Travel', followers: 12000, price: 18000 }
].map(item => ({ ...item, sample: true, description: 'Example listing for exploring the marketplace.' }));

function load() {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : { users: {}, listings: [], messages: [] };
}

function activeUser(db) {
  return db.users[sessionStorage.getItem(key)] || null;
}

export function readState() {
  const db = load();
  const me = activeUser(db);
  const messages = me ? db.messages.filter(message => message.buyer === me.id ||
    db.listings.some(listing => listing.id === message.listing && listing.owner === me.id)) : [];
  return { me, messages, saved: me?.saved || [], listings: [...db.listings, ...sampleListings] };
}

export async function post(action, data = {}) {
  const db = load();
  if (action === 'signin') {
    const { role } = data;
    if (!['buyer', 'seller'].includes(role)) throw Error('Choose a demo profile.');
    db.users[role] ??= {
      id: role === 'seller' ? 1 : 2, email: 'Demo ' + role, profile: {}, draft: {}, kyc: 'unverified', saved: []
    };
    localStorage.setItem(key, JSON.stringify(db));
    sessionStorage.setItem(key, role);
    return {};
  }
  if (action === 'logout') {
    sessionStorage.removeItem(key);
    return {};
  }
  const me = activeUser(db);
  if (!me) throw Error('Choose a demo profile first.');
  let result = {};
  switch (action) {
    case 'profile':
      me.profile = data;
      break;
    case 'verify':
      me.kyc = 'verified';
      break;
    case 'draft':
      me.draft = data;
      break;
    case 'publish': {
      if (me.kyc !== 'verified') throw Error('Complete the demo identity check first.');
      const draft = me.draft;
      if (!data.consent || !draft.title?.trim() || !draft.niche?.trim() ||
          !draft.description?.trim() || !draft.transfer?.trim() ||
          !Number.isFinite(Number(draft.price)) || Number(draft.price) <= 0) {
        throw Error('Complete the required details and confirm the listing.');
      }
      const existing = db.listings.find(item => item.owner === me.id && item.nonce === draft.nonce);
      const id = existing?.id ?? (db.listings[0]?.id || 0) + 1;
      if (!existing) db.listings.unshift({ ...draft, id, owner: me.id });
      me.draft = {};
      result = { id };
      break;
    }
    case 'save':
      me.saved = me.saved.filter(id => id !== data.listing);
      if (data.on) me.saved.push(data.listing);
      break;
    case 'message': {
      const listing = db.listings.find(item => item.id === data.listing);
      const body = data.body.trim();
      if (!listing || !body || body.length > 2000) throw Error('Enter a message of 1–2,000 characters.');
      if (listing.owner === data.buyer || ![listing.owner, data.buyer].includes(me.id)) {
        throw Error('This conversation is unavailable.');
      }
      db.messages.push({ listing: listing.id, buyer: data.buyer, sender: me.id, body });
      break;
    }
    default:
      throw Error('This action is unavailable in the demo.');
  }
  localStorage.setItem(key, JSON.stringify(db));
  return result;
}
