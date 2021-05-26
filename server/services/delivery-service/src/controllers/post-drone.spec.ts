import makeFakeDrone from '@test/fixtures/drone';
import makePostDrone from './post-drone';

describe('post-drone controller', () => {
  it('must pass on a valid drone', async () => {
    const postDrone = makePostDrone({connectDrone: (c: any) => c});
    const drone = makeFakeDrone();
    const request = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': drone.source.referrer,
        'User-Agent': drone.source.browser,
      },
      body: drone,
      ip: drone.source.ip,
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 201,
      body: {drone: request.body},
    };
    const actual = await postDrone(request);
    expect(actual).toEqual(expected);
  });

  it('must report user errors', async () => {
    const postDrone = makePostDrone({
      connectDrone: () => {
        throw Error('DRUN! And the window is gone!');
      },
    });
    const fakeDrone = makeFakeDrone();
    const request = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': fakeDrone.source.referrer,
        'User-Agent': fakeDrone.source.browser,
      },
      body: fakeDrone,
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: {error: 'DRUN! And the window is gone!'},
    };
    const actual = await postDrone(request);
    expect(actual).toEqual(expected);
  });
});
