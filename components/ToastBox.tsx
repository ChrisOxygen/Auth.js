import clsx from "clsx";

import {
  BiSolidCheckCircle,
  BiSolidError,
  BiSolidErrorCircle,
  BiSolidInfoCircle,
} from "react-icons/bi";

import { FiX } from "react-icons/fi";

type ToastBoxProps = {
  variant: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  handleClose: () => never | void;
};

function ToastBox({ variant, title, message, handleClose }: ToastBoxProps) {
  let variantProp = {
    title: title || "Some Information",
    mainColor: "blue",
    icon: <BiSolidInfoCircle />,
  };
  switch (variant) {
    case "success":
      variantProp = {
        title: title || "Success Message",
        mainColor: "green",
        icon: <BiSolidCheckCircle />,
      };
      break;
    case "error":
      variantProp = {
        title: title || "Error Message",
        mainColor: "red",
        icon: <BiSolidError />,
      };
      break;
    case "warning":
      variantProp = {
        title: title || "Warning Message",
        mainColor: "yellow",
        icon: <BiSolidErrorCircle />,
      };
      break;
    case "info":
      variantProp = {
        title: title || "Information Message",
        mainColor: "blue",
        icon: <BiSolidInfoCircle />,
      };
      break;
    default:
      break;
  }

  return (
    <div className="overflow-hidden relative to-[#2C2638] inset-shadow-sm shadow shadow-[#2C2638] border-[2px] border-[#2C2638]  rounded-xl   ">
      <span
        className={clsx(
          " w-full block h-full  absolute bg-gradient-to-b z-[1] ",
          variantProp.mainColor === "green" && "from-green-500/20 to-slate-950",
          variantProp.mainColor === "yellow" &&
            "from-yellow-500/20 to-slate-950",
          variantProp.mainColor === "blue" && "from-blue-500/20 to-slate-950",
          variantProp.mainColor === "red" && "from-red-500/20 to-slate-950"
        )}
      ></span>
      <div className="p-5 relative z-10 grid grid-cols-[32px_1fr_28px] items-start gap-3">
        <span
          className={clsx(
            "size-8 bg-black/30 rounded-full grid place-items-center shadow-lg justify-center ",
            variantProp.mainColor === "green" &&
              "text-green-500 shadow-green-600/20",
            variantProp.mainColor === "yellow" &&
              "text-yellow-500 shadow-yellow-600/20",
            variantProp.mainColor === "blue" &&
              "text-blue-500 shadow-blue-600/20",
            variantProp.mainColor === "red" && "text-red-500 shadow-red-600/20"
          )}
        >
          {variantProp.icon}
        </span>
        <div className="">
          <h4
            className={clsx(
              "text-lg font-semibold capitalize ",
              variantProp.mainColor === "green" && "text-green-500",
              variantProp.mainColor === "yellow" && "text-yellow-500",
              variantProp.mainColor === "blue" && "text-blue-500",
              variantProp.mainColor === "red" && "text-red-500"
            )}
          >
            {variantProp.title}
          </h4>
          <p className="text-sm text-white/90">{message}</p>
        </div>
        <button className="" onClick={handleClose}>
          <span className="grid place-items-center">
            <FiX />
          </span>
        </button>
      </div>
    </div>
  );
}

export default ToastBox;
