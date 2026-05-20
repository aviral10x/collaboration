export const contactEmail = 'aviral10x@gmail.com';

// ─── Mux Integration ─────────────────────────────────────────────────────────
// muxAssetId  → from Mux Dashboard > Video > Asset ID column
// muxPlaybackId → from Mux Dashboard > click asset > "Playback IDs" tab
//                 REQUIRED for stream.mux.com and image.mux.com URLs
//                 Fill these in once you have them just replace null
// ─────────────────────────────────────────────────────────────────────────────

export const projects = [
  {
    id: 'showreel',
    title: 'Showreel',
    category: 'Agency Reel',
    year: '2026',
    description: 'A cinematic expression of transformation into visual experience.',
    image: '/previews/showreel.jpg',
    previewVideo: '/previews/showreel.mp4',
    video: '/videos/showreel.mp4',
    accent: '#D4A03C',
    muxAssetId: '02lA00LhGxt4z2kUwANJrWZgjwGuinMMp8uQ5xB003EGJ4',
    muxPlaybackId: 'qOhgYpGnu62W6sRma83VBfMUoeFuBPhd4O7fOdzOYuk',
  },
  {
    id: 'aza-fashion',
    title: 'Aza Fashion',
    category: 'Fashion Campaign',
    year: '2026',
    description: 'Concept film for India\'s leading luxury multi-designer retailer. Ethereal, high-fashion imagery blending traditional craft with a futuristic visual language.',
    image: '/previews/aza-fashion.jpg',
    previewVideo: '/previews/aza-fashion.mp4',
    video: '/videos/aza-fashion.mp4',
    accent: '#E6D7C3',
    muxAssetId: null, // TODO: upload to Mux (still pending)
    muxPlaybackId: null,
  },
  {
    id: 'swiss-beauty',
    title: 'Swiss Beauty',
    category: 'Beauty Film',
    year: '2026',
    description: 'High-glam commercial focused on texture, pigment, and luminous skin.',
    image: '/previews/swiss-beauty.jpg',
    previewVideo: '/previews/swiss-beauty.mp4',
    video: '/videos/swiss-beauty.mp4',
    orientation: 'portrait',
    accent: '#F0A7B7',
    muxAssetId: 'douLx5Yy3EQ900n010297hJ2aWZ8MxehhyptbD3zMdrCxs',
    muxPlaybackId: 'rrTveS82i5us8wBA02mddzP1YFqyikuCR01CEfC8plaoc',
  },
  {
    id: 'caneza',
    title: 'Caneza',
    category: 'Launch Film',
    year: '2026',
    description: 'International luxury perfume film shaped around masculinity, power, and refined desire.',
    image: '/previews/caneza.jpg',
    previewVideo: '/previews/caneza.mp4',
    video: '/videos/caneza.mp4',
    accent: '#8AB7B4',
    muxAssetId: 'yVwFTmx2c016wIf42zOMkjt1KEIn9NQ8K6CKY6subEyE',
    muxPlaybackId: 's7JHfFPmI2iUZPtD9L8800bDV2cCLl5hyBDt1PbgmZmE',
  },
  {
    id: 'beyond-the-glass',
    title: 'Beyond The Glass',
    category: 'Concept Piece',
    year: '2026',
    description: 'High-concept visual study on luxury architecture and light.',
    image: '/previews/beyond-the-glass.jpg',
    previewVideo: '/previews/beyond-the-glass.mp4',
    video: '/videos/beyond-the-glass.mp4',
    accent: '#8CA6D9',
    muxAssetId: 'bG27akTIyG246qL28RfM7gnmqGZfh6XkNbvu71IvfCc',
    muxPlaybackId: '02zDFJ301zV00y2dUc35LzTH7t96eidwUy021lSW02hZPGto',
  },
  {
    id: 'melting-clock',
    title: 'Melting Clock',
    category: 'Surreal Film',
    year: '2026',
    description: 'Surrealist mood film exploring time and liquid physics.',
    image: '/previews/melting-clock.jpg',
    previewVideo: '/previews/melting-clock.mp4',
    video: '/videos/melting-clock.mp4',
    accent: '#CDA6F7',
    muxAssetId: 'hqVY41OKrhXLkapZSFCxMX9LT2100u2FjQV81tvdLQUw',
    muxPlaybackId: 'VNZ2mATLbWmSNfIs901XCzdtqTtLqqk3ZsOmIbdN01Ny00',
  },
  {
    id: 'ferrari-concept',
    title: 'Ferrari',
    category: 'Automotive Spot',
    year: '2026',
    description: 'Unofficial concept spot for Ferrari. Speed, precision, and custom sound design in a high-voltage frame.',
    image: '/previews/ferrari-concept.jpg',
    previewVideo: '/previews/ferrari-concept.mp4',
    video: '/videos/ferrari-concept.mp4',
    accent: '#D62F2F',
    muxAssetId: 'easS017BQR6Ax00fLFsCgtXZgr5mEovMwBEGzi5evKH3U',
    muxPlaybackId: 'dIG2jRPMQRYvt9hd3A6VKon9YFeWXKJTC01OkjQ9Gg9A',
  },
  {
    id: 'theft',
    title: 'Theft',
    category: 'Narrative Action',
    year: '2026',
    description: 'Noir-inspired short film built around character continuity and atmospheric lighting.',
    image: '/previews/theft.jpg',
    previewVideo: '/previews/theft.mp4',
    video: '/videos/theft.mp4',
    accent: '#5A8A8A',
    muxAssetId: 'DsbvW6BXernzdH0001I14DzZhV3o6Lf00Vx6guLGfErO9M',
    muxPlaybackId: 'yTP5GtZp2LrFnF2hSDS81a9PhwQPNV101skIdki02cyXE',
  },
];

export const journalEntries = [
  {
    id: 'j1',
    title: 'How cinematic video is changing fashion campaign production',
    readTime: '4 min read',
    date: 'May 12, 2026',
    image: '/previews/aza-fashion.jpg'
  },
  {
    id: 'j2',
    title: 'Building cinematic direction with fast creative workflows',
    readTime: '6 min read',
    date: 'Apr 28, 2026',
    image: '/previews/beyond-the-glass.jpg'
  },
  {
    id: 'j3',
    title: 'Scaling a social content system to 112M views',
    readTime: '5 min read',
    date: 'Apr 15, 2026',
    image: '/previews/swiss-beauty.jpg'
  },
  {
    id: 'j4',
    title: 'Why concept films matter before full production',
    readTime: '3 min read',
    date: 'Mar 30, 2026',
    image: '/previews/ferrari-concept.jpg'
  }
];

export const explorations = [
  { id: 'e1', image: '/previews/showreel.jpg' },
  { id: 'e2', image: '/previews/melting-clock.jpg' },
  { id: 'e3', image: '/previews/beyond-the-glass.jpg' },
  { id: 'e4', image: '/previews/theft.jpg' },
  { id: 'e5', image: '/previews/caneza.jpg' },
  { id: 'e6', image: '/previews/aza-fashion.jpg' }
];

export const stats = [
  { label: 'Total Views', value: '112M+' },
  { label: 'Films Delivered', value: '62+' },
  { label: 'Follower Growth', value: '+24%' }
];

export const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/aurakidzzz/' },
  { name: 'Email', url: 'mailto:aviral10x@gmail.com' },
];

export const servicePillars = [
  {
    num: '01',
    title: 'Product Commercials',
    label: 'Launch Engine',
    desc: 'Campaign-ready product films with cinematic lighting, controlled art direction, and quick creative iteration.',
    outcome: 'For launches that need premium product visuals without waiting on a full production calendar.',
    deliverables: ['Concept routes', 'Hero product shots', 'Cinematic sequences', 'Compositing', 'Web and social cutdowns'],
    accent: '#89AACC',
  },
  {
    num: '02',
    title: 'Social Content Systems',
    label: 'Growth Engine',
    desc: 'Repeatable video pipelines for Instagram-first pages, creators, character-led IP, and always-on cultural output.',
    outcome: 'For teams that need a repeatable stream of polished short-form assets, not one-off content experiments.',
    deliverables: ['Short-form batches', 'Visual rules', 'Posting-ready edits', 'Format testing', 'Ongoing creative consistency'],
    accent: '#D4A03C',
  },
];
