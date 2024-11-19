import multer from 'multer';
const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");


// his code lets you upload a single file and keeps it in memory temporarily.

// storage stores the file in memory (not saved on disk).
// singleUpload handles one file with the key "file".
// It’s ready for quick access without permanent storage.