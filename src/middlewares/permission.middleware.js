module.exports = function permission(moduleName, action) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.permissions) {
        return res.status(403).json({
          success: false,
          message: 'Permissions not found'
        });
      }

      const modulePermissions = user.permissions[moduleName];

      if (!modulePermissions || modulePermissions[action] !== true) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission validation failed'
      });
    }
  };
};
