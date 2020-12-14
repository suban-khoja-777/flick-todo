function app_router(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            window.open('/pages/app.html',"_self");
        } else {
            window.open('/pages/auth.html',"_self");
        }
      });
}