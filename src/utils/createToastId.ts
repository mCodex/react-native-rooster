type MaybeCrypto = typeof globalThis & {
  crypto?: {
    randomUUID?: () => string;
  };
};

/** Generate a reasonably unique id for new toast entries. */
const createToastId = (): string => {
  const maybeCrypto = (globalThis as MaybeCrypto).crypto;

  if (maybeCrypto && typeof maybeCrypto.randomUUID === 'function') {
    return maybeCrypto.randomUUID();
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `toast-${Date.now().toString(36)}-${random}`;
};

export default createToastId;
