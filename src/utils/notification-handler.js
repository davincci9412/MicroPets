import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const renderNotification = (type, title, message) => {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
      click:false
    }
  });
};

export default renderNotification;
