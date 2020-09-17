import React, { useState, useEffect } from 'react'
import styles from '../Posts/Post.module.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../../Firebase'
import firebase from 'firebase'
function Post({ postId, username, imageUrl, caption , user}) {
    
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
      //  console.log(user.displayName)
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault()
        db.collection('posts').doc(postId).collection("comments").add({
            text : comment,
            usersname: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }
    return (
        <div className={styles.container}>
            <div className={styles.post__header}>
                <Avatar
                    className={styles.post__avatar}
                    alt={username}
                    src="src\Static\Images\Avatar.png"
                />
                <h3>{username}</h3>
            </div>

            <img
                className={styles.post__image}
                src={imageUrl}
                alt=""
            />


            <h4 className={styles.post__text}> <strong>{username}</strong>  {caption} </h4>

            <div className={styles.post__comments}> 
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.usersname}</strong>  {comment.text}
                    </p>
                ))}
            </div>
            {user && (
                <form className="post__commentbox">
                <input
                    className={styles.post__input}
                    placeholder="Add a comment...."
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button 
                    className={styles.post__button}
                    disabled={!comment}
                    type="submit"
                    
                    onClick={postComment}
                >Post</button>

            </form>
            )}
        </div>
    )
}

export default Post
