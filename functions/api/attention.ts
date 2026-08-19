import { ScaledDotProductAttention } from '../_lib/intelligence/transformerAttention.js';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body: any = await context.request.json();
    const tokens: string[] = body?.tokens || ['TokenA', 'TokenB', 'TokenC'];
    const n = tokens.length;

    const Q = Array.from({ length: n }, (_, i) => [Math.sin(i + 1), Math.cos(i + 1), Math.sin(2 * (i + 1)), Math.cos(2 * (i + 1))]);
    const K = Array.from({ length: n }, (_, i) => [Math.sin(i + 1), Math.cos(i + 1), Math.sin(2 * (i + 1)), Math.cos(2 * (i + 1))]);
    const V = Array.from({ length: n }, (_, i) => [i * 0.5, (i + 1) * 0.25, 1.0, 0.5]);

    const attention = new ScaledDotProductAttention(4);
    const result = attention.compute(Q, K, V);

    return new Response(JSON.stringify({ tokens, ...result }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
