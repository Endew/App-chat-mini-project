import userController from "../controller/user.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const userRouter = (router) => {
    router.post('/login', userController.login);
    router.get('/showChat', verifyToken, userController.showChat);
    router.post('/sendChat', verifyToken, userController.sendChat);
}

export default userRouter;