const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const MINUTES_IN_MS = 60 * 1000;

const BRANDING = {
    name: "Physoxy"
};
const MAX_REFRESH_TOKEN_AGE = {
    jwt: '15d',
    ms: 15 * DAYS_IN_MS
};
const MAX_ACCESS_TOKEN_AGE = {
    jwt: '15m',
    ms: 15 * MINUTES_IN_MS
};
const MAX_MAGIC_LINK_AGE = {
    jwt: '15m',
    ms: 15 * MINUTES_IN_MS
};

const SMALL_COOL_DOWN = 1000 * 60 * 2;
const BIG_COOL_DOWN = 1000 * 60 * 30;



const MAX_REGISTRATION_TRIES = 3;
const REFRESH_TOKEN_OPTIONS = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: MAX_REFRESH_TOKEN_AGE.ms
}

MAX_IMG_UPLOAD_SIEZE = 2 * 1024 * 1024;
MAX_AVT_UPLOAD_SIEZE = 1 * 1024 * 1024;
ALLOWED_IMG_TYPES = ['image/jpeg', 'image/png', 'image/webp'];


module.exports = {
    BRANDING,
    MAX_REFRESH_TOKEN_AGE,
    MAX_ACCESS_TOKEN_AGE,
    MAX_MAGIC_LINK_AGE,
    REFRESH_TOKEN_OPTIONS,
    SMALL_COOL_DOWN,
    BIG_COOL_DOWN,
    MAX_REGISTRATION_TRIES,
    MAX_IMG_UPLOAD_SIEZE,
    MAX_AVT_UPLOAD_SIEZE,
    ALLOWED_IMG_TYPES,
};