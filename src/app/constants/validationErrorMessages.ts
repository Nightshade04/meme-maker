export const LOGINFORMERRORS = {
    email: {
        required: 'Email field cannot be empty',
        email: 'Please enter a valid Email ID'
    },
    password: {
        required: 'Password field cannot be empty',
        minlength: 'Password is too small (between 8 to 32 characters)',
        pattern: 'Password must contail atleast one lowercase  letter, one uppercase letter, one digit, and one symbol'
    }
}

export const SIGNUPFORMERRORS = {
    firstName: {
        required: 'First name cannot be empty'
    },
    lastName: {
        required: 'Last name cannot be empty'
    },
    email: {
        required: 'Email field cannot be empty',
        email: 'Please enter a valid Email ID'
    },
    password: {
        required: 'Password field cannot be empty',
        minlength: 'Password is too small (between 8 to 32 characters)',
        pattern: 'Password must contail atleast one lowercase  letter, one uppercase letter, one digit, and one symbol'
    }
}
