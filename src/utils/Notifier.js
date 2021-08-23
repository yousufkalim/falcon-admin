import toast from "react-hot-toast";

const Notifier = (message, status) =>
  toast[status](message, {
    duration: 3000,
    position: "bottom-right",
    // Styling
    style: { width: "50rem", border: "0.2px solid #c3c4c4" },
    className: "",
    // Custom Icon
    // icon: "👏",
    // Change colors of success/error/loading icon
    iconTheme: {
      primary: status === "success" ? "green" : "red",
      secondary: "#fff",
    },
    // Aria
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });
export default Notifier;
