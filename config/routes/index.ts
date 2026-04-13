import { HiOutlineUsers } from "react-icons/hi2";
import { CgMenuBoxed } from "react-icons/cg";
import { LuMonitorUp, LuUtensils } from "react-icons/lu";
import {CiApple} from 'react-icons/ci'
import { LuMonitorDown } from "react-icons/lu";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoAnalytics } from "react-icons/io5";import { BsHandbag } from "react-icons/bs";
import { FiMonitor } from "react-icons/fi";
import {
  Apple,
  ChefHat,
  LayoutDashboard,
  Monitor,
} from "lucide-react";
import { FaReceipt } from "react-icons/fa6";
export const NAVBAR_LINKS: navbarLink[] = [
  {
    label: "Home",
    value: "/" as const,
  },
  {
    label: "Pricing",
    value: "pricing" as const,
  },
  {
    label: "Why POS Kitchen?",
    value: "why-pos-kitchen" as const,
  },
];

export const ROUTES_EMPLOYEE = [
  {
    label: "Sides",
    icon: Apple,
    href: "/sides",
    color: "white",
  },
  {
    label: "Products",
    icon: BsHandbag,
    href: "/products",
    color: "white",
  },
  {
    label: "Menus",
    icon: LuUtensils,
    href: "/menus",
    color: "white",
  },
  {
    label: "Orders",
    icon: CgMenuBoxed,
    href: "/orders",
    color: "white",
  },
  {
    label: "Kitchen Mode",
    icon: ChefHat,
    href: "/kitchen",
    color: "white",
  },
  {
    label: "Display Mode",
    icon: FiMonitor,
    href: "/display",
    color: "white",
  },
  {
    label: "Settings",
    icon: HiOutlineCog8Tooth,
    href: "/settings",
    color: "white",
  },
];

export const PROTECTED_ROUTES_OWNER = [
  {
    label: "Overview",
    icon: IoAnalytics,
    href: "",
    color: "white",
  },
  {
    label: "Sides",
    icon: Apple,
    href: "/sides",
    color: "white",
  },
  {
    label: "Products",
    icon: BsHandbag ,
    href: "/products",
    color: "white",
  },
  {
    label: "Menus",
    icon: LuUtensils,
    href: "/menus",
    color: "white",
  },
  {
    label: "Employees",
    icon: HiOutlineUsers,
    href: "/employees",
    color: "white",
  },
  {
    label: "Orders",
    icon: CgMenuBoxed,
    href: "/orders",
    color: "white",
  },
  {
    label: "Kitchen Mode",
    icon: ChefHat,
    href: "/kitchen",
    color: "white",
  },
  {
    label: "Display Mode",
    icon: FiMonitor,
    href: "/display",
    color: "white",
  },
  {
    label: "Settings",
    icon: HiOutlineCog8Tooth,
    href: "/settings/restaurant/",
    color: "white",
  },
];
