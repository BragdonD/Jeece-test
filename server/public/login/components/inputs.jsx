const InputText = ( { placeholder, callback} ) => {
    const [value, setValue] = useState("");

    const handleKeyPress = (e) => {
        setValue(value + e.key);
        callback(value);
    };

    return (
        <div>
            <input type={"text"} placeholder={placeholder} value={value} onKeyPress={handleKeyPress}></input>
        </div>
    )
}