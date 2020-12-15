function app_router(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            window.open('../flick-todo/pages/app.html',"_self");
        } else {
            window.open('../flick-todo/pages/auth.html',"_self");
        }
      });
}
