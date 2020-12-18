const SIGNUP_MSG = document.querySelector('div.form .signup-msg');
const SIGNUP_BTN = document.querySelector('div.form .signup-btn');
const LOGIN_BTN = document.querySelector('div.form .login-btn');
const LOGIN_MSG = document.querySelector('div.form .login-msg');



const showSignInPage = () => {
    //show login button
    if(LOGIN_BTN.classList.contains('hide'))
        LOGIN_BTN.classList.remove('hide');

    //show login Msg
    if(!LOGIN_MSG.classList.contains('hide'))
        LOGIN_MSG.classList.add('hide');
        
    //hide signUp button
    if(!SIGNUP_BTN.classList.contains('hide'))
        SIGNUP_BTN.classList.add('hide');
    //hide signup Msg
    if(SIGNUP_MSG.classList.contains('hide'))
        SIGNUP_MSG.classList.remove('hide');
}

const signInUser = (e) => {
    e.preventDefault();
    const userEmailInput = document.querySelector('.user-email');
    const userPasswordInput = document.querySelector('.user-password');

    if(!userEmailInput.value || !userPasswordInput.value){
        //TODO :  Show ERROR on UI.
        window.open('../index.html',"_self");
        return;
    } 
    showSpinner();
    firebase.auth().signInWithEmailAndPassword(userEmailInput.value,userPasswordInput.value).then(res => {
        hideSpinner();
        window.open('../index.html',"_self");
    }).catch(err => {
        hideSpinner();
        alert('Something went wrong.Please try again later')
    });
}