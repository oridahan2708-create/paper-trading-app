export interface EducationArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string[];
}

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'evaluate-volume',
    title: 'Reading Volume: Is Anyone Actually Trading This?',
    category: 'Fundamentals',
    summary: 'What trading volume tells you about conviction and liquidity.',
    body: [
      'Volume is the number of shares or coins traded in a given period. It tells you how much conviction is behind a price move.',
      'A price jump on huge volume usually means real buying or selling interest — lots of participants agree on the new price. The same jump on tiny volume can reverse quickly since it took very few trades to move it.',
      'Low-volume assets are also harder to exit. If you buy something nobody else is trading, you may struggle to sell at a fair price later. This is especially true for very small meme coins and thinly-traded micro-cap stocks.',
      'A simple habit: before buying anything unfamiliar, check its 24h volume relative to its market cap. Extremely low volume relative to market cap is a liquidity red flag.',
    ],
  },
  {
    id: 'evaluate-market-cap',
    title: 'Market Cap: Size Matters',
    category: 'Fundamentals',
    summary: 'Why the size of an asset changes how it behaves.',
    body: [
      'Market cap (price × total supply/shares) approximates the total value the market assigns to an asset. It is a rough proxy for size and stability.',
      'Large-cap stocks (hundreds of billions in value) and top cryptocurrencies tend to move less dramatically day-to-day than small-caps or long-tail meme coins, simply because it takes more money to move their price meaningfully.',
      'Small market cap assets can produce bigger percentage gains — and bigger percentage losses — because relatively small amounts of buying or selling can swing the price a lot.',
      'Comparing market cap to trading volume and to real-world fundamentals (revenue for stocks, active usage for crypto) helps you judge whether a price looks reasonable or inflated by hype.',
    ],
  },
  {
    id: 'evaluate-volatility',
    title: 'Volatility: How Much Does It Swing?',
    category: 'Fundamentals',
    summary: 'Understanding price swings and what they mean for risk.',
    body: [
      'Volatility measures how much an asset’s price moves over time, in either direction. Higher volatility means bigger, faster swings — both up and down.',
      'You can get a feel for volatility by comparing 24h, 7d, and 30d percent changes: an asset bouncing +15%/-12%/+20% across those windows is far more volatile than one moving +1%/-2%/+3%.',
      'High volatility isn’t automatically bad — it creates opportunity — but it also means position sizing matters more. A small allocation to a volatile meme coin affects your portfolio very differently than the same dollar amount in a large, stable index fund.',
      'A common approach: size volatile positions smaller, and use paper trading to get a feel for how a volatile asset behaves before ever risking real money.',
    ],
  },
  {
    id: 'what-is-copy-trading',
    title: 'What Is Copy Trading?',
    category: 'Social Trading',
    summary: 'Mirroring another trader’s moves — and its real risks.',
    body: [
      'Copy trading lets you automatically or manually mirror another trader’s buys and sells in your own account, in proportion to your own balance.',
      'The appeal is simple: if you find a trader with a track record you trust, you can follow their strategy without researching every trade yourself.',
      'The risks are just as real. Past performance does not predict future results, a trader’s risk tolerance may not match yours, and by the time a trade is copied the price may have already moved. Fees and slippage (in real trading, not this demo) can also erode returns.',
      'This app’s copy trading is entirely simulated with virtual money so you can learn the mechanics — following traders, mirroring positions, tracking how a copied trade performs — without any financial risk.',
    ],
  },
  {
    id: 'investing-basics-diversification',
    title: 'Diversification: Don’t Put It All in One Place',
    category: 'Investing Basics',
    summary: 'Spreading risk across assets, sectors, and asset classes.',
    body: [
      'Diversification means spreading money across different assets so that one bad outcome doesn’t sink your whole portfolio.',
      'This can mean holding multiple stocks across different sectors, mixing stocks with crypto, or mixing large stable assets with smaller speculative ones.',
      'It doesn’t eliminate risk — a market-wide downturn still affects a diversified portfolio — but it reduces the damage any single bad pick can do.',
      'Use this demo to practice: try building a portfolio spread across several assets and compare how it behaves versus going all-in on one volatile coin.',
    ],
  },
  {
    id: 'investing-basics-risk',
    title: 'Position Sizing and Risk Management',
    category: 'Investing Basics',
    summary: 'How much to put into any single trade.',
    body: [
      'Position sizing is deciding how much of your portfolio to put into a single trade. It matters as much as picking the right asset.',
      'A common guideline is to avoid risking a large share of your total portfolio on any one speculative position — especially in highly volatile assets like meme coins.',
      'Setting a mental (or actual) stop-loss level before you buy — a price at which you’ll cut your losses — helps remove emotion from the decision in the moment.',
      'Paper trading is a good place to practice sizing decisions: try setting a virtual balance, and treat your simulated positions with the same discipline you’d want to use with real money.',
    ],
  },
  {
    id: 'investing-basics-dca',
    title: 'Dollar-Cost Averaging',
    category: 'Investing Basics',
    summary: 'Buying in increments instead of all at once.',
    body: [
      'Dollar-cost averaging (DCA) means investing a fixed amount at regular intervals, regardless of price, rather than trying to time a single perfect entry.',
      'Over time this averages out your purchase price and reduces the risk of putting everything in right before a downturn.',
      'DCA won’t maximize returns in every scenario — a lump sum right before a rally would do better — but it reduces regret and stress for most long-term investors.',
      'Try simulating this in the demo: instead of buying a full position at once, split a purchase into a few smaller buys over time and compare your average cost.',
    ],
  },
];
