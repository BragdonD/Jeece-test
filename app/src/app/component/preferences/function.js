export const updateData = async (name, value) => {
    try {
        const url = `/member/update/${name}`
        console.log(name === "img" ? value : JSON.stringify({
            value: value,
        }));
        if(name === "img") {
            const res = await fetch(url, {
                method: "PUT", 
                body: value,
                withCredentials: true,
            }).then( x => x );

            return JSON.parse(await res.text().then(x => x)).msg; 
        }
        else {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    value: value,
                }),
                withCredentials: true,
            }).then( x => x );

            return JSON.parse(await res.text().then(x => x)).msg; 
        }
    } 
    catch (error) {
        console.log(error);
    }
}

export const checkValidity = (name, value) => {
    if(value === undefined) {
        return false;
    }
    if(name === "password") {
        return CheckPassword(value);
    }
    else if(name !== "img") {
        return value.length !== 0
    }
    return true;
}

/**
 * 
 * @param {String} password 
 */
const CheckPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&-])[A-Za-z\d@#$!%*?&-]{8,}$/;
    return regex.test(password);
}