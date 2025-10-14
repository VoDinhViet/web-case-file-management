"use client";

import { Copy, Gift, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { regenerateReferralCode } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReferralCodeCardProps {
  initialCode?: string;
}

export function ReferralCodeCard({ initialCode }: ReferralCodeCardProps) {
  const [referralCode, setReferralCode] = useState(initialCode || "");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Đã sao chép mã mời");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateReferralCode();
      if (result.success && result.data) {
        setReferralCode(result.data);
        toast.success(result.message || "Đã tạo mã mời mới");
      } else {
        toast.error(result.error || "Không thể tạo mã mời mới");
      }
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-500 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Mã mời của bạn</CardTitle>
              <CardDescription>
                Chia sẻ để mời người khác tham gia
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3">
              <code className="text-lg font-bold tracking-wider">
                {referralCode || "Đang tải..."}
              </code>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!referralCode}
              title="Sao chép mã"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo mã mới...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tạo mã mới
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
