const isEmpty = (string) => {
    if (string.trim() === '') {
        return true;
    }
    else {
        return false
    }
};

const isEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (email.match(regex)) {
        return true;
    }
    else { return false; }
};



exports.validateSignUp = (newUser) => {
    let errors = {};

    //validate email
    if (isEmpty(newUser.email)) {
        errors.email = "Email must not be empty";
    }
    else if (!isEmail(newUser.email)) {
        errors.email = "Email must be valid";
    }

    //validate password
    if (isEmpty(newUser.password)) {
        errors.password = " Password must not be empty";
    }
    if (newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = " Password must be match";
    }
    //validate handle
    if (isEmpty(newUser.handle)) {
        errors.handle = " Handle must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLogin = (user) => {
    //validate email
    let errors = {};
    if (isEmpty(user.email)) {
        errors.email = "Email must not be empty";
    }
    else if (!isEmail(user.email)) {
        errors.email = "Email must be valid";
    }

    //validate password
    if (isEmpty(user.password)) {
        errors.password = " Password must not be empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.reduceUserDetails = (data) => {
    let userDetails = {};
    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if (!isEmpty(data.website.trim())) {
        if (data.website.trim().substring(0, 4) !== 'http') {
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }
    if (!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
}