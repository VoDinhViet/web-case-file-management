"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { regenerateReferralCode } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ReferralCardProps {
  initialCode?: string;
}

export function ReferralCard({ initialCode = "" }: ReferralCardProps) {
  const [referralCode, setReferralCode] = useState(initialCode);
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const result = await regenerateReferralCode();
    if (result.success && result.data) {
      setReferralCode(result.data);
    }
    setIsRegenerating(false);
  };

  return (
    <Card className="rounded-lg border-0 border-l-4 border-l-primary shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Copy className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base">Mã mời</CardTitle>
            <CardDescription className="text-sm">
              Chia sẻ để mời người khác tham gia
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={referralCode || "Chưa có mã"}
            readOnly
            className="flex-1 rounded-lg border bg-muted/50 px-4 py-3"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!referralCode}
            title={isCopied ? "Đã sao chép" : "Sao chép mã"}
          >
            {isCopied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full"
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Đang tạo mã mới...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-5 w-5" />
              Tạo mã mới
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
