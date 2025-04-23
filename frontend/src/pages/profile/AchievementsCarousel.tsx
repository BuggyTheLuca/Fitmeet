import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Achievement } from "@/types/user";
import achievementIcon from '../../assets/images/achievement-icon.svg'

export function AchievementsCarousel({ achievements }: { achievements: Achievement[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow"
        onClick={() => scroll("left")}
      >
        <ChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth px-8"
      >
        {achievements.map((achievement, index) => (
          <div key={index} className="mx-4 flex flex-col items-center w-24">
            <img src={achievementIcon} alt={`Conquista ${achievement.name}`} className="w-22 h-22 object-cover rounded" />
            <h2>{achievement.name}</h2>
          </div>
        ))}
      </div>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow"
        onClick={() => scroll("right")}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
