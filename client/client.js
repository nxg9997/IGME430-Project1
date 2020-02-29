// create vue instance for databinding
var app = new Vue({
    el: '#app',
    data: {
        test: 'hi from vue :) x2',
        title: 'BF Compiler',
        bfCode: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
        result: 'Result:\n',
        scripts: [{
            code: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            name: 'HelloWorld'
        }],
        currScript: 'HelloWorld',
        newCount: 0,
        rename: '',
        user: {
          username: '',
          password: ''
        },
        loggedIn: false
    },
    methods: {
        compile: () => {
            // send bf code to the server to be compiled
            fetchRequest('/compile',{method:'post',headers:{'Content-Type':'application/json'},body:`{"code":"${app.bfCode.replace(/(\r\n|\n|\r)/gm,"")}"}`},(data)=>{
              app.result = 'Result:\n' + data.result;
            });
        },
        setCurrent: (name) => {
           // set the current script to be edited
           if(app !== undefined){
            
                for(let s of app.scripts){
                   if(s.name === app.currScript){
                       s.code = app.bfCode;
                       break;
                   }
                }

               app.currScript = name;
               for(let s of app.scripts){
                   if(s.name === name){
                       app.bfCode = s.code;
                       break;
                   }
               }
           }
           //console.log(name);
        },
        checkScript: (name) => {
            // set the active tab based on the current script
            return {
                'is-active': app !== undefined?(name === app.currScript):false
            };
            
        },
        addScriptLocal: () => {
            // create a new script locally (don't send to server)
            app.scripts.push({
                code: '',
                name: 'new-script' + app.newCount
            });
            app.setCurrent('new-script' +app.newCount);
            app.newCount++;
        },
        setName: () => {
            // Change the name of the current script
            for(let s of app.scripts){
                if(s.name === app.currScript){
                    s.name = app.rename;
                    app.currScript = s.name;
                    break;
                }
            }
            app.rename = 'Name...'
        },
        logIn: () => {
            // login to an account, and get the user's scripts from the server
            fetchRequest('/logIn',{method:'post',body:`{"user":"${app.user.username}","password":"${app.user.password}"}`},(data)=>{
                if(data.auth){
                app.loggedIn = true;
                getScripts(app.user.username,app.user.password);
                }
            });
          
        
        },
        saveScripts: () => {
            // save all local scripts to the server
            fetch('/saveScripts',{method:'post',body:`{"user":"${app.user.username}","password":"${app.user.password}","scripts":${JSON.stringify(app.scripts)}}`});
        },
        createUser: () => {
            // ask server to create a new user if the user doesn't exist
            checkUserExists(app.user.username,
            () => {
                addUser(app.user.username, app.user.password);
            });
        }
    },
    watch: {
        bfCode: () => {
            for(let s of app.scripts){
                if(s.name === app.currScript){
                    s.code = app.bfCode;
                    break;
                }
            }
        }
    }
});

// hello world (for testing server response)
function hw(){
  fetch('/helloworld',{method:'get'}).then(res=>{
      res.json().then(data=>{
          console.log(data);
      });
  });
}

// request server to add a new user, display a toast if successful
function addUser(user,pass){
  fetch('/addUser',{method:'post',body:`{"user":"${user}","password":"${pass}"}`}).then(res=>{
      res.json().then(data=>{
          console.log(data);
      });
      if(res.status === 201){
        toast("New User Created");
      }
  });
}

// get all scripts for the currently logged in user
function getScripts(user,pass){
  fetchRequest('/getScripts',{method:'post',body:`{"user":"${user}","password":"${pass}"}`},(data)=>{
    app.scripts = data.scripts;
    app.$forceUpdate();
  });
}

// add a test script to the current user (for testing)
function addScriptTest(user,pass,script){
  app.scripts.push({'code': script, 'name': 'Test'});
  fetchRequest('/addScript',{method:'post',body:`{"user":"${user}","password":"${pass}","scripts":${JSON.stringify(app.scripts)}}`});
}

// use query string to check if a user already exists
function checkUserExists(user, callback){
  fetch('/username?username=' + user,{method:'GET'}).then(res=>{
    res.json().then(data=>{
      console.log(data);
    });
    if(res.status === 200){
      callback();
    }
    else{
      // user exists
      toast("User already exists");
    }
  });
}

// display a toast at the bottom of the screen with a message
function toast(msg){
  let snackbarContainer = document.querySelector('#toastbar');
  let data = {message: msg};
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// use fetch to request something from the server, automatically adds accept header for json
function fetchRequest(path,req,callback=null){
  req.headers = {'Accept':'application/json'};
  fetch(path,req).then(res=>{
    res.json().then(data=>{
      if(callback !== null)
        callback(data);
    });
  });
}