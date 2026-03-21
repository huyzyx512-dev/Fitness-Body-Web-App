export const isAdmin = (req) =>
    req.user.role?.name === 'ADMIN';

export const isOwnerOrAdmin = (resourceUserId, req) =>
    isAdmin(req) || resourceUserId === req.user.id;