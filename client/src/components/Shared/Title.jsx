import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import favicon from "../../assets/Icons/Logo.png";

const Title = ({
  title = "ChitChat",
  description = "Your chat app is a real-time messaging platform designed to connect users through private chats and group conversations. It features seamless message handling, efficient group management, and a user-friendly interface that makes communication easy and intuitive. With advanced search functionality, notifications, and customizable settings, your app ensures that users can stay connected, manage their chats effortlessly, and engage in meaningful interactions.",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" type="png" href={favicon} sizes="16x16" />
    </Helmet>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Title;
