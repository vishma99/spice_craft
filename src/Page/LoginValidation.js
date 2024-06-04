function Validation(values){
    let error ={}
    // const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.usename === ""){
        error.usename= "name should be empty";
    }
    else{
        error.usename = "";
    }

    if(values.password === ""){
        error.password = "Password should be empty";
    }
    else if(!password_pattern.test(values.password)){
        error.password = "password didn't match";
    }
    else{
        error.password = "";

    }
    return error;
}
export default Validation;