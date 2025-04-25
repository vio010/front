import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarWithStatusProps {
  src?: string;
  name: string;
  status?: "online" | "offline" | "none";
  size?: "sm" | "md" | "lg";
}

export function AvatarWithStatus({ 
  src, 
  name, 
  status = "none", 
  size = "md" 
}: AvatarWithStatusProps) {
  // Get initials from name
  const initials = name.split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  // Size classes
  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };
  
  const statusSizes = {
    sm: "h-2.5 w-2.5",
    md: "h-2.5 w-2.5", 
    lg: "h-3 w-3"
  };
  
  // Status color
  const statusColor = status === "online" ? "bg-success" : "bg-gray-400";
  
  return (
    <div className="relative">
      <Avatar className={avatarSizes[size]}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {status !== "none" && (
        <span 
          className={`absolute top-0 right-0 block ${statusSizes[size]} rounded-full ${statusColor} ring-2 ring-white`}
          aria-hidden="true"
        ></span>
      )}
    </div>
  );
}
