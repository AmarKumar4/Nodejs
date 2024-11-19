import express from 'express';
import { getUserProfileController, loginController, registerController, logoutController, updatedProfile, updatePassword, updateProfilePic } from '../controllers/userController.js';
import { isAuth } from '../middleware/authMiddlewares.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

// routes
router.post("/register", registerController);
// login
router.post("/login", loginController)

// profile
router.get("/profile", isAuth, getUserProfileController)

router.put("/profile-updated", isAuth, updatedProfile)


router.put("/updated-password", isAuth, updatePassword)

router.put("/update-picture", isAuth, singleUpload, updateProfilePic)


router.get("/logout", isAuth, logoutController)
export default router;
