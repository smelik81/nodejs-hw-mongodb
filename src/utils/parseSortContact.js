import { SORT_ORDER } from '../constans/sortIndex.js';

const parseSortContact = ({ sortBy, sortOrder }) => {
  const keySortByParams = ['name', '_id'];
  const parsedSortBy = keySortByParams.includes(sortBy) ? sortBy : '_id';

  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

export default parseSortContact;
