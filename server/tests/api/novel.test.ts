import { createSigner } from 'fast-jwt';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { GET, POST } from './utils';

test(GET(noCookieClient.novel), async () => {
  const res = await noCookieClient.novel.$get();

  expect(res).toEqual('Hello');
});

test(POST(noCookieClient.novel), async () => {
  const aozoraUrl = createSigner({ key: 'abc' })({ exp: Math.floor(Date.now() / 1000) + 100 });
  const res = await noCookieClient.novel.post({ body: { aozoraUrl } });

  expect(res).toEqual(aozoraUrl);
});
