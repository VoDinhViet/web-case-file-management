"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFCMToken } from "@/hooks/use-fcm-token";

interface NotificationPermissionButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

/**
 * Button to request notification permission
 * Add this to your app header or settings page
 */
export function NotificationPermissionButton({
  variant = "outline",
  size = "icon",
  showLabel = false,
}: NotificationPermissionButtonProps) {
  const { permission, isSupported, isLoading, requestPermissionAndToken } =
    useFCMToken();

  if (!isSupported) {
    return null;
  }

  const handleClick = async () => {
    if (permission === "granted") {
      // Already granted, could show settings or info
      return;
    }
    await requestPermissionAndToken();
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (permission === "granted") {
      return <Bell className="h-4 w-4 fill-current" />;
    }
    return <BellOff className="h-4 w-4" />;
  };

  const getTooltipText = () => {
    if (permission === "granted") {
      return "Thông báo đã được bật";
    }
    if (permission === "denied") {
      return "Thông báo đã bị chặn. Vui lòng bật lại trong cài đặt trình duyệt";
    }
    return "Bật thông báo để nhận cập nhật";
  };

  const getButtonText = () => {
    if (permission === "granted") {
      return "Thông báo đã bật";
    }
    return "Bật thông báo";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            disabled={isLoading || permission === "denied"}
            className={permission === "granted" ? "text-green-600" : ""}
          >
            {getIcon()}
            {showLabel && <span className="ml-2">{getButtonText()}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
