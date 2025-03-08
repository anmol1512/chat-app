const signup = (request,response) =>{
    response.send("SIGNUP SUCCESSFULL");
};

const login = (request,response) =>{
    response.send("LOGIN SUCCESSFULL");
};

const logout = (request,response) =>{
    response.send("LOGOUT SUCCESSFULL");
};

export {signup, login, logout};