import { SocketConnectionStatus } from "../../hooks";
import styles from "./index.module.scss";
import {
  ConnectedIcon,
  ConnectingIcon,
  DisconnectedIcon
} from "../../components/icons";
import cls from "classnames";

const ConnectionConfig = {
  [SocketConnectionStatus.CONNECTED]: {
    icon: ConnectedIcon,
    label: "Connecté",
    className: styles.connected
  },
  [SocketConnectionStatus.CONNECTING]: {
    icon: ConnectingIcon,
    label: "Connexion...",
    className: styles.connecting
  },
  [SocketConnectionStatus.CLOSED]: {
    icon: DisconnectedIcon,
    label: "Coupé",
    className: styles.closed
  },
  [SocketConnectionStatus.RECONNECTING]: {
    icon: DisconnectedIcon,
    label: "Reconnexion...",
    className: styles.connecting
  }
};

function ConnectionStatusDisplay({ connectionStatus }) {
  const { icon: Icon, label, className } =
    ConnectionConfig[connectionStatus] ?? {};

  return (
    <div className={cls(styles.connectionStatus, className)}>
      {Icon && <Icon />}
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default ConnectionStatusDisplay;
