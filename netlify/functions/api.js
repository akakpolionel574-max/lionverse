exports.handler = async function(event) {
  const path = event.queryStringParameters?.path || '';
  const query = event.queryStringParameters?.query || '';
  
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
