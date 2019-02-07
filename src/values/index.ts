// common
export const ACCESS_TOKEN = 'accessToken';
export const DEFAULT_ERROR_MESSAGE = '오류가 발생했습니다';
export const DEFAULT_PAGE_NUMBER = 0;
export const DEFAULT_PAGE_SIZE = 12;
export const ITEM_POSITION_UNIT = 2 ** 16;
export const MAX_ITEMS_PER_COLLECTION = 100;
export const MAX_ITEM_POSITION_VALUE = Number.MAX_VALUE - ITEM_POSITION_UNIT;
export const MIN_ITEM_POSITION_INTERVAL = 1e-10;

// constraints
export const MAX_COLLECTION_TITLE_LENGTH = 40;
export const MAX_COLLECTION_DESCRIPTION_LENGTH = 255;
export const MAX_COLLECTION_ITEMS_SIZE = 100;
export const MAX_COLLECTION_TAGS_SIZE = 5;
export const MAX_COMMENT_TEXT_LENGTH = 255;
export const MAX_CUE_TEXT_LENGTH = 40;
export const MAX_CUE_SIZE = 20;
export const MAX_ITEM_TITLE_LENGTH = 100;
export const MAX_ITEM_DESCRIPTION_LENGTH = 255;
export const MAX_ITEM_TAGS_SIZE = 5;
export const MAX_TAG_NAME_LENGTH = 40;
export const MIN_USERNAME_LENGTH = 5;
export const MAX_USERNAME_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;
export const MAX_COMMENT_DEPTH = 1;
