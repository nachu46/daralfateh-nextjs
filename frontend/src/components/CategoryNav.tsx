import Link from 'next/link';
import { 
  Utensils, 
  Apple, 
  Carrot, 
  Fish, 
  Drumstick, 
  Croissant, 
  Milk, 
  Package, 
  GlassWater, 
  Snowflake, 
  Home, 
  Baby, 
  PawPrint, 
  Sparkles, 
  Gift, 
  Flower2 
} from 'lucide-react';

const categories = [
  { name: 'QUICK MEALS', icon: Utensils, bgColor: 'bg-[#a32230]', textColor: 'text-white' },
  { name: 'FRUITS', icon: Apple, bgColor: 'bg-[#73b54d]', textColor: 'text-white' },
  { name: 'VEGETABLES', icon: Carrot, bgColor: 'bg-[#009c52]', textColor: 'text-white' },
  { name: 'SEAFOOD', icon: Fish, bgColor: 'bg-[#0d347d]', textColor: 'text-white' },
  { name: 'MEAT', icon: Drumstick, bgColor: 'bg-[#b61f26]', textColor: 'text-white' },
  { name: 'BAKERY', icon: Croissant, bgColor: 'bg-[#897368]', textColor: 'text-white' },
  { name: 'DAIRY', icon: Milk, bgColor: 'bg-[#e2dac6]', textColor: 'text-white' },
  { name: 'PANTRY', icon: Package, bgColor: 'bg-[#7fc243]', textColor: 'text-white' },
  { name: 'DRINKS', icon: GlassWater, bgColor: 'bg-[#00b979]', textColor: 'text-white' },
  { name: 'FROZEN', icon: Snowflake, bgColor: 'bg-[#40aae9]', textColor: 'text-white' },
  { name: 'HOME', icon: Home, bgColor: 'bg-[#183984]', textColor: 'text-white' },
  { name: 'KIDS', icon: Baby, bgColor: 'bg-[#c52c3c]', textColor: 'text-white' },
  { name: 'PETS', icon: PawPrint, bgColor: 'bg-[#83766b]', textColor: 'text-white' },
  { name: 'SELF-CARE', icon: Sparkles, bgColor: 'bg-[#e7e1d5]', textColor: 'text-white' },
  { name: 'GIFTS', icon: Gift, bgColor: 'bg-[#dcb954]', textColor: 'text-white' },
  { name: 'FLOWERS', icon: Flower2, bgColor: 'bg-[#8dc63f]', textColor: 'text-white' },
];

export default function CategoryNav() {
  return (
    <div className="w-full bg-white hidden md:block border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* We use a grid or flex. Given 16 items, we can use flex with justify-between or grid with 16 cols. */}
        <div className="flex w-full justify-between gap-1 py-4">
          {categories.map((cat, idx) => (
            <Link href={`/category/${cat.name.toLowerCase()}`} key={idx} className="group flex-1">
              <div className={`flex flex-col items-center justify-center rounded-lg p-2 h-20 w-full ${cat.bgColor} hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer shadow-sm`}>
                <cat.icon className={`h-7 w-7 mb-1.5 ${cat.textColor}`} strokeWidth={1.5} />
                <span className={`text-[9px] font-bold tracking-wider uppercase text-center leading-tight ${cat.textColor}`}>
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Mobile view - horizontal scroll */}
      <div className="md:hidden overflow-x-auto snap-x flex gap-2 px-4 py-3 hide-scrollbar border-b border-gray-100">
        {categories.map((cat, idx) => (
          <Link href={`/category/${cat.name.toLowerCase()}`} key={idx} className="snap-start shrink-0 group">
            <div className={`flex flex-col items-center justify-center rounded-lg p-2 h-16 w-16 ${cat.bgColor} shadow-sm group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300`}>
              <cat.icon className={`h-5 w-5 mb-1 ${cat.textColor}`} strokeWidth={1.5} />
              <span className={`text-[8px] font-bold tracking-widest uppercase text-center ${cat.textColor}`}>
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
