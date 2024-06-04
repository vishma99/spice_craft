function ValidationSignup(values){
    let error ={}
     const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

 if(values.user === ""){
    error.user= "name should be empty";
}
else{
    error.user = "";
}
if(values.email === ""){
    error.email = "email should be empty";
}
else if(!email_pattern.test(values.email)){
    error.email = "email didn't match";
}
else{
    error.email = "";

}

if(values.contactNumber === ""){
    error.contactNumber= "contactNumber should be empty";
}
else{
    error.contactNumber = "";
}
if(values.address === ""){
    error.address= "address should be empty";
}
else{
    error.address = "";
}

    if(values.password === ""){
        error.password = "Password should be empty";
    }
    // else if(!password_pattern.test(values.password)){
    //     error.password = "password didn't match";
    // }
    else{
        error.password = "";

    }
    if(values.username === ""){
        error.username= "username should be empty";
    }
    else{
        error.username = "";
    }
    return error;
}
export default ValidationSignup;