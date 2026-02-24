exports.handler = async function(event) {
  const path = event.queryStringParameters?.path || '';
  const query = event.queryStringParameters?.query || '';
  const imageUrl = event.queryStringParameters?.imageUrl || '';

  // Proxy images (covers)
  if (imageUrl) {
    try {
      const response = await fetch(decodeURIComponent(imageUrl), {
        headers: { 'User-Agent': 'MangaVerse/1.0' }
      });
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      return {
        statusCode: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400',
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true,
      };
    } catch (err) {
      return { statusCode: 500, body: 'Image error' };
    }
  }

  // Proxy API calls
  const url = `https://api.mangadex.org${path}${query ? '?' + query : ''}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MangaVerse/1.0',
        'Accept': 'application/json',
      }
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

