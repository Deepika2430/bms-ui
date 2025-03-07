import React, { useState } from "react";
import { formatRelativeTime } from "../../services/notificationService";

const NotificationItem = ({ notification, onRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (isExpanded) {
      onRead(notification.id);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`p-4 cursor-pointer ${
        notification.read ? "bg-gray-100" : "bg-white"
      }`}
      onClick={handleClick}
    >
      <h3 className="text-sm font-semibold">{notification.title}</h3>
      <p className="text-sm">
        {isExpanded ? notification.message : `${notification.message.substring(0, 100)}...`}
      </p>
      <p className="text-xs text-gray-500">
        {formatRelativeTime(notification?.createdAt)}
      </p>
    </div>
  );
};

export default NotificationItem;
