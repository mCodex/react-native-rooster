import createToastId from '../createToastId';

describe('createToastId advanced', () => {
  // Store original crypto
  const originalCrypto = globalThis.crypto;

  afterEach(() => {
    // Restore original crypto
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      writable: true,
    });
  });

  it('should use crypto.randomUUID when available', () => {
    const mockUUID = 'mock-uuid-1234-5678';

    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: jest.fn(() => mockUUID),
      },
      writable: true,
    });

    const id = createToastId();
    expect(id).toBe(mockUUID);
    expect(globalThis.crypto.randomUUID).toHaveBeenCalled();
  });

  it('should fall back to random string when crypto.randomUUID is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: undefined,
      },
      writable: true,
    });

    const id = createToastId();
    expect(id).toMatch(/^toast-/);
    expect(id).toContain('-');
  });

  it('should handle missing crypto object', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      writable: true,
    });

    const id = createToastId();
    expect(id).toMatch(/^toast-/);
    expect(id).toContain('-');
  });

  it('should generate unique IDs when randomUUID unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      writable: true,
    });

    const id1 = createToastId();
    const id2 = createToastId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^toast-/);
    expect(id2).toMatch(/^toast-/);
  });

  it('should handle crypto error gracefully', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: jest.fn(() => {
          throw new Error('Crypto not available');
        }),
      },
      writable: true,
    });

    expect(() => {
      createToastId();
    }).toThrow();
  });
});
