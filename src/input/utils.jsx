const startsWithSpaceRegex = /^\s/;
const endsWithSpaceRegex = /\s$/;

export const insertString = (string, text, insertAt) => {
  const start = string.slice(0, insertAt);
  const end = string.slice(insertAt);

  let content = text;
  let position = insertAt + content.length;

  if (start.length && !endsWithSpaceRegex.test(start)) {
    content = ` ${content}`;
    position += 1;
  }

  if (end.length && !startsWithSpaceRegex.test(end)) {
    content += ' ';
    position += 1;
  }

  const result = start + content + end;

  return { result, position };
};

export const replaceString = (string, pattern, replacement, insertAt) => {
  const start = string.slice(0, insertAt);
  const end = string.slice(insertAt);

  let text = start.replace(pattern, '');
  text += replacement;

  if (end.length && !startsWithSpaceRegex.test(end)) text += ' ';

  const result = text + end;
  const position = text.length;

  return { result, position };
};
