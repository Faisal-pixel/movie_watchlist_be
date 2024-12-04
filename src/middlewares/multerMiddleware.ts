import multer from 'multer';

// we configure multer to store the files in memory
const upload = multer({ storage: multer.memoryStorage() });

const fileUploader = upload.single('profile_picture'); // this will be the name in the form data

export default fileUploader;