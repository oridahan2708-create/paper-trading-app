export interface AnalystProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  focus: string[];
}

// Real, well-known public figures widely associated with investing
// commentary/education. Bios are general, publicly known facts — not
// performance claims or endorsements. We deliberately don't list social
// handles: search for each name and verify the official/verified account
// yourself, since impersonation scams using these names are common,
// especially in crypto. Nothing here is financial advice.
export const CURATED_ANALYSTS: AnalystProfile[] = [
  {
    id: 'buffett',
    name: 'Warren Buffett',
    title: 'Chairman & CEO, Berkshire Hathaway',
    bio: 'Long-time value investor known for buying quality businesses at fair prices and holding for the long term. Widely followed for Berkshire Hathaway’s annual shareholder letters.',
    focus: ['Value Investing', 'Long-Term'],
  },
  {
    id: 'dalio',
    name: 'Ray Dalio',
    title: 'Founder, Bridgewater Associates',
    bio: 'Founder of one of the world’s largest hedge funds. Known for writing extensively on macroeconomics, diversification, and risk parity in his books and public talks.',
    focus: ['Macro', 'Risk Management'],
  },
  {
    id: 'wood',
    name: 'Cathie Wood',
    title: 'Founder & CEO, ARK Invest',
    bio: 'Founder of ARK Invest, known for research and public commentary focused on disruptive innovation, growth equities, and emerging technology sectors.',
    focus: ['Growth', 'Innovation'],
  },
  {
    id: 'lynch',
    name: 'Peter Lynch',
    title: 'Former Manager, Fidelity Magellan Fund',
    bio: 'Ran the Fidelity Magellan Fund and authored several widely-read investing books emphasizing researching companies you understand before buying.',
    focus: ['Stock Picking', 'Fundamentals'],
  },
  {
    id: 'orman',
    name: 'Suze Orman',
    title: 'Personal Finance Educator',
    bio: 'Personal finance author and educator focused on budgeting, saving, and building long-term financial security for everyday investors.',
    focus: ['Personal Finance', 'Beginners'],
  },
];
