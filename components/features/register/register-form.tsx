"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  Loader2Icon,
  LockIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { register } from "@/actions/register";
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
import { type RegisterFormData, registerReqSchema } from "@/schemas/auth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerReqSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  async function onSubmit(values: RegisterFormData) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await register(values);

      if (result.success) {
        setSuccessMessage(result.message || "Đăng ký thành công!");
        form.reset();
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorMessage(result.message || "Đăng ký thất bại");
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
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>Điền thông tin để tạo tài khoản mới</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>{errorMessage}</AlertTitle>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>{successMessage}</AlertTitle>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        Họ và tên <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="Nguyễn Văn A"
                          />
                          <InputGroupAddon>
                            <UserIcon />
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="0912345678"
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
                            placeholder="••••••••"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        Xác nhận mật khẩu{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            type="password"
                            placeholder="••••••••"
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

                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        Mã mời <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="Nhập mã mời"
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading && <Loader2Icon className="animate-spin mr-2" />}
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>

                <div className="text-center text-sm">
                  Bạn đã có tài khoản?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
