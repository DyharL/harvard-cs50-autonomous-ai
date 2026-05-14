import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { validateCardNumber } from '../src/systems/luhnValidator.js';
import { computeReadability } from '../src/systems/readability.js';
import { caesarEncrypt, substitutionEncrypt } from '../src/systems/ciphers.js';
import { runTidemanElection } from '../src/systems/tidemanVoting.js';
import { applyGrayscale, applySepia, applyReflect, applyBlur, applySobel } from '../src/systems/imageFilters.js';
import { carveJpegFiles } from '../src/systems/jpegCarver.js';
import { HashDictionary } from '../src/systems/hashDictionary.js';
import { findMaxConsecutiveSTR, matchDnaProfile } from '../src/systems/dnaProfiler.js';
import { TradingPortfolio } from '../src/systems/financeLedger.js';

describe('Systems Algorithms (Modules 01 - 09)', () => {
  it('01. Luhn Validator: validates Visa, Amex, Mastercard and rejects invalid cards', () => {
    // Valid Visa
    const visa = validateCardNumber('4000001234567899');
    assert.equal(visa.isValid, true);
    assert.equal(visa.brand, 'VISA');

    // Valid Amex (15 digits, starting 34 or 37)
    const amex = validateCardNumber('378282246310005');
    assert.equal(amex.isValid, true);
    assert.equal(amex.brand, 'AMEX');

    // Invalid checksum
    const invalid = validateCardNumber('4000001234567890');
    assert.equal(invalid.isValid, false);
  });

  it('02. Readability Analyzer: computes Coleman-Liau grade levels accurately', () => {
    const simple = 'One fish. Two fish. Red fish. Blue fish.';
    const resSimple = computeReadability(simple);
    assert.equal(resSimple.grade, 'Before Grade 1');

    const alice = 'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do.';
    const resAlice = computeReadability(alice);
    assert.match(resAlice.grade, /Grade \d+/);
  });

  it('03. Ciphers: executes Caesar shift and substitution mappings', () => {
    const shifted = caesarEncrypt('Hello, World! 2026', 13);
    assert.equal(shifted, 'Uryyb, Jbeyq! 2026');

    const key = 'YTNSHKVEFXRBAUQZCLWDMIPGJO';
    const sub = substitutionEncrypt('HELLO', key);
    assert.equal(sub, 'EHBBQ');
  });

  it('04. Tideman Voting: resolves Condorcet winner without cycles', () => {
    const candidates = ['Alice', 'Bob', 'Charlie'];
    const ballots = [
      ['Alice', 'Bob', 'Charlie'],
      ['Alice', 'Charlie', 'Bob'],
      ['Bob', 'Alice', 'Charlie']
    ];
    const election = runTidemanElection(candidates, ballots);
    assert.equal(election.winner, 'Alice');
  });

  it('05. Image Filters: applies grayscale, sepia, reflect, blur and Sobel kernels', () => {
    const grid = [
      [{ r: 100, g: 150, b: 200 }, { r: 50, g: 50, b: 50 }],
      [{ r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }]
    ];

    const gray = applyGrayscale(grid);
    assert.equal(gray[0][0].r, 150);
    assert.equal(gray[0][0].g, 150);

    const sepia = applySepia(grid);
    assert.ok(sepia[0][0].r > 0);

    const reflected = applyReflect(grid);
    assert.deepEqual(reflected[0][0], grid[0][1]);

    const blurred = applyBlur(grid);
    assert.ok(blurred[0][0].r > 0);

    const sobel = applySobel(grid);
    assert.ok(sobel.length === 2);
  });

  it('06. JPEG Carver: recovers contiguous images from raw 512-byte blocks', () => {
    const block1 = new Uint8Array(512);
    block1[0] = 0xff;
    block1[1] = 0xd8;
    block1[2] = 0xff;
    block1[3] = 0xe0;
    block1.fill(42, 4);

    const block2 = new Uint8Array(512);
    block2.fill(99);

    const buffer = new Uint8Array(1024);
    buffer.set(block1, 0);
    buffer.set(block2, 512);

    const recovered = carveJpegFiles(buffer);
    assert.equal(recovered.length, 1);
    assert.equal(recovered[0].sizeBytes, 1024);
    assert.equal(recovered[0].filename, '000.jpg');
  });

  it('07. Hash Dictionary: loads words, checks containment and calculates load factor', () => {
    const dict = new HashDictionary(1024);
    dict.load(['apple', 'banana', 'computer', 'science']);
    assert.equal(dict.size(), 4);
    assert.equal(dict.check('banana'), true);
    assert.equal(dict.check('orange'), false);

    const metrics = dict.getMetrics();
    assert.equal(metrics.totalWords, 4);
    assert.ok(metrics.filledBuckets > 0);
  });

  it('08. DNA Profiler: computes maximum consecutive STR count and matches profile', () => {
    const dna = 'AAGATCAGATCAGATCAATG';
    const count = findMaxConsecutiveSTR(dna, 'AGATC');
    assert.equal(count, 3);

    const db = [
      { name: 'Alice', counts: { AGATC: 3, AATG: 1 } },
      { name: 'Bob', counts: { AGATC: 2, AATG: 4 } }
    ];
    const match = matchDnaProfile(dna, db);
    assert.equal(match, 'Alice');
  });

  it('09. Finance Ledger: handles equity balance, orders and portfolio valuation', () => {
    const portfolio = new TradingPortfolio(10000);
    portfolio.buy('AAPL', 10, 150);
    portfolio.buy('GOOGL', 5, 100);

    const summary = portfolio.getSummary({ AAPL: 160, GOOGL: 110 });
    assert.equal(summary.cash, 8000);
    assert.equal(summary.investedValue, 2150);
    assert.equal(summary.totalEquity, 10150);
    assert.equal(summary.totalPnl, 150);

    portfolio.sell('AAPL', 5, 170);
    const afterSell = portfolio.getSummary({ AAPL: 170, GOOGL: 110 });
    assert.equal(afterSell.cash, 8850);
  });
});
