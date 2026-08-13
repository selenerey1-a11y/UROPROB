const TICKER_ITEMS = [
  'Envíos nacionales',
  'Ofertas de Verano',
  'Envíos 24-48 h',
];

// How many times the item list repeats inside a single group. The scroll
// loop works by sliding one group's width and snapping back, so each group
// must on its own be wider than the widest screen it'll render on —
// otherwise the strip runs out of items before it loops and shows a blank
// gap. Repeating enough copies here keeps text filling the bar edge-to-edge
// on any screen, however short the source item list is.
const REPEAT = 8;

// Keeps scroll speed constant regardless of REPEAT or how many items a
// given ticker has — duration scales with the total item count so more
// repeated/longer content just takes proportionally longer to loop instead
// of flying past.
const SECONDS_PER_ITEM = 4;

export function TickerSection({items = TICKER_ITEMS}) {
  const loopItems = Array.from({length: REPEAT}, () => items).flat();
  const duration = `${loopItems.length * SECONDS_PER_ITEM}s`;

  return (
    <div className="ticker-section">
      <div className="ticker-track" style={{animationDuration: duration}}>
        <TickerGroup items={loopItems} />
        <TickerGroup items={loopItems} hidden />
      </div>
    </div>
  );
}

function TickerGroup({items, hidden}) {
  return (
    <div className="ticker-group" aria-hidden={hidden ? 'true' : undefined}>
      {items.map((item, i) => (
        <span className="ticker-item" key={`${item}-${i}`}>
          {item}
          <span className="ticker-sep" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  );
}
