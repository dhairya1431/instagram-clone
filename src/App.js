import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import ImageUpload from './Components/ImageUpload/ImageUpload'
import Post from './Components/Posts/Post';
import { db, auth } from './Firebase'
import { Button, Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [opensignin, setOpensignin] = useState(false)

  const signup = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false)
  }

  const signin = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpensignin(false)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User Is Signed In
        setUser(authUser)
      } else {
        //user has Signed Out
        setUser(null)
      }
    })

    return () => {
      //perform  Some cleanup operations
      unsubscribe()
    }
  }, [user, username])

  //Code runs based upon dependancy in []
  useEffect(() => {
    //Update Title
    document.title = "Instagram-clone"
    //Everytime updates when there is a any change in 'posts' document
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);

  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">

            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            <Button type="submit" onClick={signup}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={opensignin}
        onClose={() => setOpensignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">

            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            <Button type="submit" onClick={signin}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpensignin(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>
      <div className="app__posts">
        <div className="app__leftposts">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} username={post.username} imageUrl={post.imageurl} caption={post.caption} user={user}/>
            ))
          }
        </div>

        <div className="app__rightposts">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>



      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3> Sorry!! You need to Login to upload</h3>
        )}

    </div>
  );
}

export default App;
