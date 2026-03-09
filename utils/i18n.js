export const T = {
  ja: {
    title:      'ひらがなスロット',
    tagline:    '文字を回して、ことばを生む。',
    spin:       'まわす',
    spinSub:    'spin',
    stopAll:    '全て止める',
    stopSub:    'stop all',
    stop:       '止める',
    result:     'あなたのことば',
    share:      'シェア',
    copy:       'コピー',
    copied:     'コピー済',
    bmc:        'Buy me a coffee',
    langSwitch: 'EN',
    lenLabels:  ['二','三','四','五','六'],
    speedSlow:  '遅',
    speedFast:  '速',
    tweetText:  (w) => `「${w}」\nひらがなスロットで出た言葉 #ひらがなスロット`,
  },
  en: {
    title:      'Hiragana Slot',
    tagline:    'Spin characters. Discover words.',
    spin:       'Spin',
    spinSub:    'まわす',
    stopAll:    'Stop All',
    stopSub:    '全て止める',
    stop:       'Stop',
    result:     'your word',
    share:      'Share',
    copy:       'Copy',
    copied:     'Copied!',
    bmc:        'Buy me a coffee',
    langSwitch: 'JA',
    lenLabels:  ['2','3','4','5','6'],
    speedSlow:  'slow',
    speedFast:  'fast',
    tweetText:  (w) => `"${w}" — from Hiragana Slot ✨ #hiraganaslot`,
  },
};

export function t(lang, key) {
  return T[lang][key];
}
