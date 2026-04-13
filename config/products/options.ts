import exp from "constants";
import {
  Beef,
  CandyOff,
  Check,
  Coffee,
  Croissant,
  CupSoda,
  Fish,
  IceCream,
  MilkOff,
  Pizza,
  Salad,
  Utensils,
  Vegan,
  WheatOff,
  Wine,
  X,
  XIcon,
} from "lucide-react";
export const CATEGORIES = [
  {
    label: "Main Course",
    icon: Utensils,
    value: "Main Course",
    description: "Some description of main course",
    id: 1,
  },
  {
    label: "Fast Food",
    value: "Fast Food",
    icon: Pizza,
    description: "Fast Food",
    id: 2,
  },
  {
    label: "Appetizer",
    icon: Croissant,
    value: "Appetizer",

    description: "Some description of Appetizer",
    id: 3,
  },
  {
    label: "Side dish",
    value: "Side dish",
    icon: Salad,
    description: "Fast Food",
    id: 4,
  },
  {
    label: "Drink",
    value: "Drink",

    icon: CupSoda,
    description: "Drink",
    id: 5,
  },
  {
    label: "Dessert",
    value: "Dessert",
    icon: IceCream,
    description: "Some description of desert",
    id: 6,
  },
];

export const FAST_FOOD_OPTIONS = [
  {
    label: "No Gluten",
    value: "No Gluten",
    icon: WheatOff,
    description: "This main course doesn't gluten",
    id: 1,
  },
  {
    label: "Vegan",
    value: "Vegan",
    icon: Vegan,
    description: "This main course is vegan",
    id: 4,
  },
  {
    label: "No Lactose",
    value: "No Lactose",
    icon: MilkOff,
    description: "This main course doesn't have lactose",
    id: 5,
  },
];

export const MAIN_COURSE_OPTIONS = [
  {
    label: "No Gluten",
    value: "No Gluten",
    icon: WheatOff,
    description: "This main course doesn't gluten",
    id: 1,
  },
  {
    label: "Fish",

    value: "Fish",
    icon: Fish,
    description: "This main course is based of fish",
    id: 2,
  },
  {
    label: "Meat",
    value: "Meat",
    icon: Beef,
    description: "This main course is based of meat",
    id: 3,
  },
  {
    label: "Vegan",
    value: "Vegan",
    icon: Vegan,
    description: "This main course is vegan",
    id: 4,
  },
  {
    label: "No Lactose",
    value: "No Lactose",
    icon: MilkOff,
    description: "This main course doesn't have lactose",
    id: 5,
  },
];

export const DRIK_OPTIONS = [
  {
    label: "No Lactose",
    icon: MilkOff,
    description: "This drink doesn't have Lactose",
    id: 5,
  },
  {
    label: "No Gluten",
    icon: WheatOff,
    description: "This drink doesn't have Gluten",
    id: 1,
  },
  {
    label: "Alcohol",
    icon: Wine,
    description: "This drink have Gluten alcohol",
    id: 8,
  },
];

export const DESERT_OPTIONS = [
  {
    label: "No Lactose",

    value: "No Lactose",
    icon: MilkOff,
    description: "This desert doesn't have lactose",
    id: 5,
  },
  {
    label: "No Gluten",

    value: "No Gluten",
    icon: WheatOff,
    description: "This desert doesn't have gluten",
    id: 1,
  },
  {
    label: "Sugar Free",
    value: "Sugar Free",
    icon: CandyOff,
    description: "This desert is free sugar",
    id: 6,
  },
  {
    label: "Caffeine",
    value: "Caffeine",
    icon: Coffee,
    description: "This desser is just a Caffeine",
    id: 7,
  },
];

export const APETIZER_OPTIONS = [
  {
    label: "No Gluten",
    icon: WheatOff,
    value : "No Gluten",
    description: "This apetizer doesn't have gluten",
    id: 1,
  },
  {
    label: "Sugar Free",
    value: "Sugar Free",
    icon: CandyOff,
    description: "This apetizer is free sugar",
    id: 6,
  },
  {
    label: "Vegan",
    value: "Vegan",
    icon: Vegan,
    description: "This apetizer is vegan",
    id: 4,
  },
];


export const STATUS = [
  {
    label: "ACTIVE",
    value: "ACTIVE",
    icon: Check,
  },
  {
    label: "INACTIVE",
    value: "INACTIVE",
    icon: XIcon,
  },
]

export const ORDER_STATUS = [
  {
    label: "KITCHEN",
    value: "KITCHEN",
  },
  {
    label: "SERVED",
    value: "SERVED",
  },
  {
    label: "READY",
    value: "READY",
  },
  {
    label: "COMPLETE",
    value: "COMPLETE",
  },
  {
    label: "CANCELED",
    value: "CANCELED",
  },
  {
    label: "DELETED",
    value: "DELETED",
  },
]

export const EMPLOYEE_PERMISSIONS = [
  {
    label: "READ",
    value: "READ",
  },
  {
    label: "WRITE_READ",
    value: "WRITE_READ",
  },
]
