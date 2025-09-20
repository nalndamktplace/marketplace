// NotificationContext.js
import { createContext, useContext } from "react";
import { notification } from "antd";
import { IconType } from "antd/es/notification/interface";

export interface NotificationContextType {
  showNotification: (
    type: IconType,
    message: string,
    description: string
  ) => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: any) => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (
    type: IconType,
    message: string,
    description: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {contextHolder}
    </NotificationContext.Provider>
  );
};
