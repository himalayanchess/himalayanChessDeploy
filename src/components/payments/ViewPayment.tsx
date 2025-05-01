import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import {
  Home,
  Info,
  User,
  Wallet,
  Banknote,
  Clock,
  CheckCircle,
  CircleDollarSign,
  FileText,
  Edit,
} from "lucide-react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BasicPaymentInfo from "./viewpaymentdetails/BasicPaymentInfo";
import PaymentInstallments from "./viewpaymentdetails/PaymentInstallments";
import PaymentFiles from "./viewpaymentdetails/PaymentFiles";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewPayment = ({ paymentRecord }: any) => {
  const { data: session } = useSession();
  const isSuperOrGlobalAdmin =
    session?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.user?.role?.toLowerCase() === "admin" &&
      session?.user?.isGlobalAdmin);

  // State variables
  const [loaded, setLoaded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue);
  };

  const menuItems = [
    { label: "Overview", value: "basic", icon: <InfoOutlinedIcon /> },
    {
      label: "Installments",
      value: "installments",
      icon: <PaymentOutlinedIcon />,
    },
    {
      label: "Payment Files",
      value: "paymentfiles",
      icon: <FileText size={20} />,
    },
  ];

  const showComponent = () => {
    if (paymentRecord) {
      switch (selectedMenu) {
        case "basic":
          return <BasicPaymentInfo paymentRecord={paymentRecord} />;
        case "installments":
          return <PaymentInstallments paymentRecord={paymentRecord} />;
        case "paymentfiles":
          return <PaymentFiles paymentRecord={paymentRecord} />;
        default:
          return <BasicPaymentInfo paymentRecord={paymentRecord} />;
      }
    }
  };

  useEffect(() => {
    if (paymentRecord) {
      setLoaded(true);
    }
  }, [paymentRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      <div className="header flex flex-col">
        <div className="title-home flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold flex items-center">
              <CircleDollarSign />
              <span className="ml-2 mr-3">Payment Details</span>

              {isSuperOrGlobalAdmin && (
                <Link
                  href={`/${session?.user?.role?.toLowerCase()}/payments/updatepayment/${
                    paymentRecord?._id
                  }`}
                >
                  <Button variant="text" size="small">
                    <Edit size={18} />
                    <span className="ml-1">Edit</span>
                  </Button>
                </Link>
              )}
            </h1>
            <span className="text-sm text-gray-500">
              <b>{paymentRecord?.paymentType}</b>-{" "}
              {paymentRecord?.prePaymentTitle}
            </span>
          </div>

          {/* home button */}
          <Link href={`/${session?.user?.role?.toLowerCase()}/payments`}>
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>
        </div>

        {/* menu buttons */}
        <div className="w-full menuButtons mt-2 flex gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant={selectedMenu === item.value ? "contained" : "outlined"}
              size="medium"
              onClick={() => handleMenuClick(item.value)}
              sx={{ padding: "0.3rem 0.7rem" }}
            >
              {item.icon}
              <span className="ml-1.5">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="flex-1 h-full flex overflow-y-auto">
        {showComponent()}
      </div>
    </div>
  );
};

export default ViewPayment;
