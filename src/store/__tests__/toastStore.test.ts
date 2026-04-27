import toastStore from '../toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    toastStore.__resetForTests();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('add / remove / clear', () => {
    it('adds a toast and exposes it via getMessages and ids subscription', () => {
      const id = toastStore.add({ message: 'Hello', type: 'info' });
      expect(toastStore.getMessages()).toHaveLength(1);
      expect(toastStore.getIds()).toEqual([id]);
      expect(toastStore.getMessage(id)?.message).toBe('Hello');
    });

    it('removes by id', () => {
      const a = toastStore.add({ message: 'a' });
      const b = toastStore.add({ message: 'b' });
      toastStore.remove(a);
      expect(toastStore.getIds()).toEqual([b]);
    });

    it('removes the most recent when no id is provided', () => {
      const a = toastStore.add({ message: 'a' });
      toastStore.add({ message: 'b' });
      toastStore.remove();
      expect(toastStore.getIds()).toEqual([a]);
    });

    it('clear empties messages and queue', () => {
      toastStore.add({ message: 'a' });
      toastStore.add({ message: 'b' });
      toastStore.clear();
      expect(toastStore.getIds()).toEqual([]);
      expect(toastStore.getMessages()).toEqual([]);
    });
  });

  describe('auto dismiss timers', () => {
    it('removes a toast automatically after timeToDismiss', () => {
      toastStore.setConfig({ timeToDismiss: 1000 });
      const id = toastStore.add({ message: 'x' });
      expect(toastStore.getIds()).toEqual([id]);
      jest.advanceTimersByTime(1001);
      expect(toastStore.getIds()).toEqual([]);
    });

    it('respects per-toast duration override', () => {
      toastStore.setConfig({ timeToDismiss: 5000 });
      const id = toastStore.add({ message: 'x', duration: 200 });
      jest.advanceTimersByTime(250);
      expect(toastStore.getIds()).not.toContain(id);
    });

    it('does not auto-dismiss when duration is 0', () => {
      const id = toastStore.add({ message: 'x', duration: 0 });
      jest.advanceTimersByTime(10000);
      expect(toastStore.getIds()).toEqual([id]);
    });

    it('pause and resume preserve remaining time', () => {
      toastStore.setConfig({ timeToDismiss: 1000 });
      const id = toastStore.add({ message: 'x' });
      jest.advanceTimersByTime(400);
      toastStore.pause(id);
      jest.advanceTimersByTime(5000);
      expect(toastStore.getIds()).toContain(id);
      toastStore.resume(id);
      jest.advanceTimersByTime(700);
      expect(toastStore.getIds()).not.toContain(id);
    });
  });

  describe('maxVisible / overflow', () => {
    it("'evict' drops the oldest visible toast (default)", () => {
      toastStore.setConfig({ maxVisible: 2, overflow: 'evict' });
      const a = toastStore.add({ message: 'a' });
      const b = toastStore.add({ message: 'b' });
      toastStore.add({ message: 'c' });
      // Oldest (a) is queued for fast eviction; advance a bit to let it run
      jest.advanceTimersByTime(200);
      const ids = toastStore.getIds();
      expect(ids).not.toContain(a);
      expect(ids).toContain(b);
    });

    it("'queue' holds extras until a slot frees", () => {
      toastStore.setConfig({
        maxVisible: 1,
        overflow: 'queue',
        timeToDismiss: 200,
      });
      const a = toastStore.add({ message: 'a' });
      const b = toastStore.add({ message: 'b' });
      expect(toastStore.getIds()).toEqual([a]);
      jest.advanceTimersByTime(250);
      expect(toastStore.getIds()).toEqual([b]);
    });
  });

  describe('subscriptions', () => {
    it('per-id subscriber notified only for its own id', () => {
      const a = toastStore.add({ message: 'a' });
      const b = toastStore.add({ message: 'b' });
      const aSpy = jest.fn();
      const bSpy = jest.fn();
      const unsubA = toastStore.subscribeMessage(a, aSpy);
      const unsubB = toastStore.subscribeMessage(b, bSpy);

      toastStore.updateMessage(a, { message: 'a-updated' });
      // Microtask flush
      return Promise.resolve().then(() => {
        expect(aSpy).toHaveBeenCalledTimes(1);
        expect(bSpy).not.toHaveBeenCalled();
        unsubA();
        unsubB();
      });
    });

    it('ids subscriber notified when ids array changes', () => {
      const idsSpy = jest.fn();
      toastStore.subscribeIds(idsSpy);
      toastStore.add({ message: 'a' });
      return Promise.resolve().then(() => {
        expect(idsSpy).toHaveBeenCalled();
      });
    });

    it('config subscriber notified on setConfig', () => {
      const cfgSpy = jest.fn();
      toastStore.subscribeConfig(cfgSpy);
      toastStore.setConfig({ timeToDismiss: 1234 });
      return Promise.resolve().then(() => {
        expect(cfgSpy).toHaveBeenCalled();
        expect(toastStore.getConfig().timeToDismiss).toBe(1234);
      });
    });
  });
});
