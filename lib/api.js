export async function fetcher (url, option) {
    let response; 
    console.log(option)
    if(!option){
        response =  await fetch(url)
    } else{
        response = await fetch(url, option)
    }
    const data = await response.json()
    return data
}