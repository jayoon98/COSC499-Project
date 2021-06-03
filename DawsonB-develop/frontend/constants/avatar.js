const root = 'avatar/';
const ext = '.png';

const enums = {
  Backgrounds: {
    Abstract: 0,
    Gray: 1,
    White: 2,
  },
  Hairs: {
    Long: 0,
    Messy: 1,
    Short: 2,
  },
  Moods: {
    Bored: 0,
    Cool: 1,
    Excited: 2,
    Happy: 3,
    Laughing: 4,
    Protected: 5,
    Shy: 6,
  },
  Skintones: {
    Skin1: 0,
    Skin2: 1,
    Skin3: 2,
  },
  Torsos: {
    Blue: 0,
    Galaxy: 1,
    Green: 2,
    Purple: 3,
    Red: 4,
    Suit: 5,
    Yellow: 6,
  },
};

const backgrounds = [
  `${root}abstract${ext}`,
  `${root}gray${ext}`,
  `${root}white${ext}`,
];

const hairs = [
  `${root}long${ext}`,
  `${root}messy${ext}`,
  `${root}short${ext}`,
];

const moods = [
  `${root}bored${ext}`,
  `${root}cool${ext}`,
  `${root}excited${ext}`,
  `${root}happy${ext}`,
  `${root}laughing${ext}`,
  `${root}protected${ext}`,
  `${root}shy${ext}`,
];

const skintones = [
  `${root}skin1${ext}`,
  `${root}skin2${ext}`,
  `${root}skin3${ext}`,
];

const torsos = [
  `${root}blue_tshirt${ext}`,
  `${root}galaxy_tshirt${ext}`,
  `${root}green_tshirt${ext}`,
  `${root}purple_tshirt${ext}`,
  `${root}red_tshirt${ext}`,
  `${root}suit_tshirt${ext}`,
  `${root}yellow_tshirt${ext}`,
];

module.exports = {
  Backgrounds: backgrounds,
  Hairs: hairs,
  Moods: moods,
  Skintones: skintones,
  Torsos: torsos,
  Enums: enums,
};
