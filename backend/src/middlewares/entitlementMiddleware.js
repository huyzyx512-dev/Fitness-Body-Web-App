export const requireEntitlement = (requiredTier) => (req, res, next) => {
  const currentTier = req.user?.subscription_tier || "FREE";

  if (currentTier !== requiredTier && currentTier !== "COACH_PRO") {
    return res.status(403).json({
      message: `Tính năng này yêu cầu ${requiredTier}`,
    });
  }

  next();
};
