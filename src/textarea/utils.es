import { emojiCollection, shortnameRegex } from 'emojitsu';

const endsWithEmojiRegex = new RegExp(`\\B${shortnameRegex.slice(0, -2)})$`);

const suggestableEmojis = emojiCollection.filter(({ suggest }) => suggest);

export const getEmojiTerm = (string) => {
  if (typeof string !== 'string') return null;
  const matches = string.match(endsWithEmojiRegex);
  const match = (matches && matches[1]) ? matches[1].slice(1) : null;
  return match;
};

export const getMatchingEmoji = (string) => suggestableEmojis.reduce((acc, { shortname }) => {
  if (shortname.includes(string)) acc.push(shortname);
  return acc;
}, []);
