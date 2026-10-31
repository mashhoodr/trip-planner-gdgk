import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addStop, addExpense, removeExpense, sortStops, formatPKR, formatUSD, tripSummary } from '../src/trip.js';
import { hash } from '../src/user.js';

test('addStop ignores empty names', () => {
  assert.deepEqual(addStop([], { name: '  ', date: '2026-10-20' }), []);
});

test('addStop trims and appends', () => {
  assert.deepEqual(addStop([], { name: ' Naran ', date: '2026-10-20' }), [{ name: 'Naran', date: '2026-10-20' }]);
});

test('addExpense rejects zero and negative amounts', () => {
  assert.deepEqual(addExpense([], { label: 'Food', amount: 0 }), []);
  assert.deepEqual(addExpense([], { label: 'Food', amount: -5 }), []);
});

test('sortStops orders by date without changing the input', () => {
  const stops = [{ name: 'B', date: '2026-10-21' }, { name: 'A', date: '2026-10-20' }];
  assert.deepEqual(sortStops(stops).map((s) => s.name), ['A', 'B']);
  assert.equal(stops[0].name, 'B');
});

test('formatPKR groups thousands', () => {
  assert.equal(formatPKR(43500), 'Rs 43,500');
});

test('formatUSD shows cents', () => {
  assert.equal(formatUSD(155.357), '$155.36');
});

test('hash is stable', () => {
  assert.equal(hash('u-4821'), hash('u-4821'));
});

test('removeExpense removes only that item', () => {
  const list = [{ label: 'A', amount: 1 }, { label: 'B', amount: 2 }, { label: 'C', amount: 3 }];
  assert.deepEqual(removeExpense(list, 1).map((e) => e.label), ['A', 'C']);
  assert.equal(list.length, 3);
});

test('tripSummary computes days, stop count, and budget total', () => {
  const trip = {
    start: '2026-12-01',
    end: '2026-12-05',
    stops: [
      { name: 'A', date: '2026-12-01' },
      { name: 'B', date: '2026-12-03' },
    ],
    expenses: [
      { label: 'Hotel', amount: 5000 },
      { label: 'Food', amount: 2000 },
    ],
  };
  const summary = tripSummary(trip);
  assert.equal(summary.days, 4);
  assert.equal(summary.stops, 2);
  assert.equal(typeof summary.total, 'number');
});

test('tripSummary handles empty input gracefully', () => {
  assert.deepEqual(tripSummary(null), { days: 0, stops: 0, total: 0 });
  assert.deepEqual(tripSummary({}), { days: 0, stops: 0, total: 0 });
});
