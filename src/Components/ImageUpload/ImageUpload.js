import { Button } from '@material-ui/core'
import React , {useState } from 'react'
import { db , storage } from '../../Firebase'
import firebase from 'firebase'

import style from '../ImageUpload/image.module.css'

function ImageUpload({username}) {

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)
    

    const handleChange = (event) => {
        if(event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadtask = storage.ref(`images/${image.name}`).put(image)

        //As state chnages it takes "snapshot" for progress
        uploadtask.on(
            "state_changed" , 
            (snapshot) => {
                //Progress Function
                const process = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                console.log(process)
                setProgress(process)
            },
            (error) => {
                alert(error.message)
            },
            () => {
                //Complete Function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            username : username,
                            imageurl : url,
                            caption : caption

                        })
                    })
                    setProgress(0)
                    setCaption('')
                    setImage(null)
            }
        )
    }
    return (
        <div className={style.imageupload}>
            <progress className={style.imageupload__process} value={progress} max="100"/>
            <input
                type="text"
                placeholder="Enter a caption...."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <input
                type="file"
                onChange={handleChange}
            />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
