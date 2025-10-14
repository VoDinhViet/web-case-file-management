"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  Loader2Icon,
  LockIcon,
  PhoneIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/actions/auth";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authReqSchema, type LoginFormData } from "@/schemas/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(authReqSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(values);
      console.log("result", result);

      if (result.success) {
        // Redirect to callback URL or dashboard
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
      } else {
        console.log("result", result);
        setErrorMessage(result.message || "Đăng nhập thất bại");
      }
    } catch {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Đăng nhập</CardTitle>
          <CardDescription>
            Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert
                  variant="destructive"
                  className={`bg-destructive/5 border-none`}
                >
                  <AlertCircleIcon />
                  <AlertTitle>{errorMessage}</AlertTitle>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder={"Nhập số điện thoại của bạn"}
                        />
                        <InputGroupAddon>
                          <PhoneIcon />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder={"••••••••"}
                        />
                        <InputGroupAddon>
                          <LockIcon />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit" className={"w-full"}>
                {isLoading && <Loader2Icon className="animate-spin mr-2" />}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <div className="text-center text-sm">
                Bạn chưa có tài khoản?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Đăng ký
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
