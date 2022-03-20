export const SubmitForm = async (pseudo, password, fname, lname, email) => {
    try {
        let url = `register?pseudo=${encodeURIComponent(pseudo)}&password=${encodeURIComponent(password)}&fName=${encodeURIComponent(fname)}&lName=${encodeURIComponent(lname)}&email=${encodeURIComponent(email)}`;
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

        return JSON.parse(await res.text().then(x => x)).msg;        
    } catch(error) {
        console.log(error);
    }
}

/**
 * 
 * @param {String} email 
 */
export const CheckEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email);
}

/**
 * 
 * @param {String} password 
 */
export const CheckPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&-])[A-Za-z\d@#$!%*?&-]{8,}$/;
    return regex.test(password);
}