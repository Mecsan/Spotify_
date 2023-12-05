import { ref, uploadBytesResumable, getStorage, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react"
import app from "../firebase";
const storage = getStorage(app);

const supportedTypes = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    audio: ['audio/mpeg']
}

function useUpload(filetype, file) {

    const [error, seteror] = useState(null);
    const [url, seturl] = useState(null);
    const [progress, setprogress] = useState(0);
    const [loading, setloading] = useState(false);

    const reset = () => {
        seteror(null);
        seturl(null);
        setprogress(0);
        setloading(false);
    }

    const uploadFile = async (file) => {
        try {
            let name = Date.now() + file.name;
            if (supportedTypes[filetype].indexOf(file.type) == -1)
                throw new Error("invalid file type");


            let path = filetype + "s/" + name;
            let storageRef = ref(storage, path);

            let uploadTask = uploadBytesResumable(storageRef, file);
            setloading(true);

            uploadTask.on('state_changed',
                (snapshot) => {
                    let percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
                    setprogress(percentage);
                },
                (error) => {
                    seteror(error)
                },
                async () => {
                    try {
                        let url = await getDownloadURL(storageRef);
                        seturl(url);
                        setloading(false);
                    } catch (error) {
                        seteror(error);
                    }
                }
            )

        } catch (error) {
            seteror(error);
        }
    }

    useEffect(() => {
        if (file) {
            reset();
            uploadFile(file);
        }
    }, [file])

    return { error, url, progress, loading };
}

export default useUpload