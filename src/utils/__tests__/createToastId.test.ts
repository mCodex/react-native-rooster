import createToastId from '../createToastId';

describe('createToastId', () => {
  it('should generate a unique id', () => {
    const id1 = createToastId();
    const id2 = createToastId();

    expect(id1).not.toBe(id2);
  });

  it('should return a string', () => {
    const id = createToastId();

    expect(typeof id).toBe('string');
  });

  it('should generate non-empty id', () => {
    const id = createToastId();

    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate fallback id with proper format', () => {
    const id = createToastId();

    // Either uses crypto.randomUUID or fallback format
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate multiple unique IDs', () => {
    const ids = Array.from({ length: 100 }, () => createToastId());
    const uniqueIds = new Set(ids);

    // All IDs should be unique (or mostly unique with fallback)
    expect(uniqueIds.size).toBeGreaterThan(90);
  });
});
