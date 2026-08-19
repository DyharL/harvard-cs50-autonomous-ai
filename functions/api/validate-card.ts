import { validateCardNumber } from '../_lib/systems/luhnValidator.js';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body: any = await context.request.json();
    const result = validateCardNumber(body?.number || '');
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
