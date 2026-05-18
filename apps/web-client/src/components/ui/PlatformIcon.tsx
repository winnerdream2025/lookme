import React from "react";
import { 
  Instagram, 
  Music2, 
  Youtube, 
  Star, 
  Users, 
  Twitter,
  Globe,
  MapPin,
  Scissors,
  Calendar,
  TrendingUp,
  Heart,
  Eye,
  Award,
  Radio,
  BarChart3
} from "lucide-react";

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export function PlatformIcon({ platform, className = "w-6 h-6" }: PlatformIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    Instagram: <Instagram className={className} />,
    TikTok: <Music2 className={className} />,
    YouTube: <Youtube className={className} />,
    "Google Business": <Star className={className} />,
    Facebook: <Users className={className} />,
    "X (Twitter)": <Twitter className={className} />,
    Spotify: <Radio className={className} />,
    Website: <Globe className={className} />,
    Yelp: <MapPin className={className} />,
    Styleseat: <Scissors className={className} />,
    Booksy: <Calendar className={className} />,
    Trustpilot: <Award className={className} />,
  };

  return <>{iconMap[platform] || <Globe className={className} />}</>;
}

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = "w-5 h-5" }: CategoryIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    "all": <BarChart3 className={className} />,
    "social-growth": <TrendingUp className={className} />,
    "engagement": <Heart className={className} />,
    "visibility": <Eye className={className} />,
    "reputation": <Star className={className} />,
    "music-promotion": <Music2 className={className} />,
    "web-traffic": <Globe className={className} />,
  };

  return <>{iconMap[category] || <Globe className={className} />}</>;
}
