import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  image: string;
  name: string;
  description?: string;
  price: string;
  imageAlt?: string;
  badge?: string;
}

export default function CookieCardShadcn({
  image,
  name,
  description,
  price,
  imageAlt,
  badge,
}: Props) {
  return (
    <Card className="group overflow-hidden border-0 bg-card shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1C3A2A]/8">
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-[#EDE5CC]">
        <img
          src={image}
          alt={imageAlt ?? name}
          width={800}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="px-4 pt-4 pb-5">
        {badge && (
          <Badge
            variant="secondary"
            className="mb-2 rounded-none bg-[#1C3A2A] px-2 py-0.5 text-[9px] font-normal uppercase tracking-[0.18em] text-[#F5EFE0] hover:bg-[#2E5040]"
          >
            {badge}
          </Badge>
        )}

        <p className="font-display italic text-[15px] leading-snug text-[#1C3A2A]">
          {name}
        </p>

        {description && (
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[#7A6A54]">
            {description}
          </p>
        )}

        <p className="mt-2 text-[11px] tracking-[0.05em] text-[#C8A97E]">
          {price}
        </p>
      </CardContent>
    </Card>
  );
}
