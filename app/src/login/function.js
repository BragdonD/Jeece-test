export const SubmitForm = async (pseudo, password) => {
    try {
        let url = `login?pseudo=${encodeURIComponent(pseudo)}&password=${encodeURIComponent(password)}`;

        console.log(url)
        const res = await fetch(url, {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            withCredentials: true,
        }).then( x => x );

        return JSON.parse(await res.text().then(x => x)).msg;        
    } catch(error) {
        console.log(error);
    }
}