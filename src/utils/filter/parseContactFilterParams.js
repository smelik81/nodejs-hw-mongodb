const parseName = (name) => {
  if (typeof name !== 'string') return;

  return name;
};

const parseType = (contactType) => {
  if (typeof contactType !== 'string') return;

  const allContactType = ['personal', 'home', 'work'];

  if (allContactType.includes(contactType)) {
    return contactType;
  }
};

const parseIsFavorite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;

  return isFavourite === 'true'
    ? true
    : isFavourite === 'false'
    ? false
    : undefined;
};

export const parseContactFilterParams = ({
  name,
  contactType,
  isFavourite,
}) => {
  const parsedName = parseName(name);
  const parsedType = parseType(contactType);
  const parsedIsFavorite = parseIsFavorite(isFavourite);

  return {
    name: parsedName,
    contactType: parsedType,
    isFavourite: parsedIsFavorite,
  };
};
