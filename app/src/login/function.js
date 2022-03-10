export const SubmitForm = async (pseudo, password) => {
    try {
        let url = `login?pseudo=${pseudo}&password=${password}`;

        console.log(url)
        const res = await fetch(url, {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            data: {
                pseudo: pseudo,
            },
            withCredentials: true,
        }).then( x => x );

        const msg = JSON.parse(await res.text().then(x => x)).msg;

        if(msg === "redirect") {
            window.location = "/";
        }
        else if (msg === "no match") {
            document.getElementById("error-p").classList.remove("unvisible");
        }
        
    } catch(error) {
        console.log(error);
    }
}