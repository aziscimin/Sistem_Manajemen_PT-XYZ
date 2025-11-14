import Notification from "../models/notificationModel.js";

export const listNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user.id, isRead: false }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notifikasi ditandai dibaca" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
