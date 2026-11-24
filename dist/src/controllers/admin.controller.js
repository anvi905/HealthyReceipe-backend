export const getAdminDashboard = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Admin Dashboard!",
        data: {
            userId: req.user?.userId,
            role: req.user?.role,
        },
    });
};
//# sourceMappingURL=admin.controller.js.map