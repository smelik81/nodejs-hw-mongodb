const parsedIntegerParams = (value, defaultValue) => {
  if (typeof value !== 'string') return defaultValue;
  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

const parsePaginationContact = ({ page, perPage }) => {
  const parsedPage = parsedIntegerParams(page, 1);
  const parsedPerPage = parsedIntegerParams(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};

export default parsePaginationContact;
