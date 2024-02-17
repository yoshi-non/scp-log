'use strict';

import { data } from './data';

export async function GET(request: Request) {
  try {
    if (request.method !== 'GET') {
      return new Response('Only GET allowed', {
        status: 405,
      });
    }
    const mockData = data;

    return new Response(JSON.stringify(mockData), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('failed.', {
      status: 400,
    });
  }
}
