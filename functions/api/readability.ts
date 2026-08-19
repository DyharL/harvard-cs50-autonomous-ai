import { computeReadability } from '../_lib/systems/readability.js';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body: any = await context.request.json();
    const result = computeReadability(body?.text || '');
    return new Response(JSON.stringify(result), {
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
