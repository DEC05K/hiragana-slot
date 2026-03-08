import Reel from './Reel';

// モバイル（〜767px）：2段組み
// 2→[2], 3→[3], 4→[2,2], 5→[3,2], 6→[3,3]
// PC（768px〜）：横一列
function getMobileLayout(reelCount) {
  switch (reelCount) {
    case 2: return [2];
    case 3: return [3];
    case 4: return [2, 2];
    case 5: return [3, 2];
    case 6: return [3, 3];
    default: return [reelCount];
  }
}

export default function ReelsWrapper({ reelCount, reelStates, reelsRef, setTrackRef, stopReel, isSpinning, lang, isPC }) {
  const layout = isPC ? [reelCount] : getMobileLayout(reelCount);

  let idx = 0;
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center items-center">
      {layout.map((rowLen, rowIdx) => (
        <div key={rowIdx} className="flex gap-3 md:gap-2">
          {Array.from({ length: rowLen }).map((_, colIdx) => {
            const i = idx++;
            const state = reelStates[i];
            const chars = reelsRef.current?.[i]?.chars ?? [];
            return (
              <Reel
                key={i}
                chars={chars}
                trackRef={(el) => setTrackRef(i, el)}
                stopped={state?.stopped ?? false}
                stopping={state?.stopping ?? false}
                onStop={() => stopReel(i)}
                disabled={isSpinning}
                index={i}
                lang={lang}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
