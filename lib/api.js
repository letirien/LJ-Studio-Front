export async function fetcher(url, option) {
    let response;
    
    if (!option) {
        response = await fetch(url);
    } else {
        response = await fetch(url, option);
    }
    
    // Vérifier si la réponse est OK (status 200-299)
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Fetch error for ${url}:`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Vérifier que data contient bien records
    if (!data || !data.records) {
        console.error(`Invalid data structure from ${url}:`, data);
        return { records: [] };
    }
    
    return data;
}