export const getProfile = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully!",
        data: {
            userId: req.user?.userId,
            role: req.user?.role,
        },
    });
};
//# sourceMappingURL=user.controller.js.map