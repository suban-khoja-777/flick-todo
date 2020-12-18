function app_router(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if(user.emailVerified){
                window.open('../flick-todo/pages/app.html',"_self");
            }else{
                alert('Please verify your email');
                window.open('../flick-todo/pages/auth.html',"_self");
            }
            
        } else {
            window.open('../flick-todo/pages/auth.html',"_self");
        }
      });
}
