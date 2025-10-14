import { getReferralCode } from "@/actions";
import { ReferralCodeCard } from "./referral-code-card";

export async function ReferralCodeSection() {
  const result = await getReferralCode();

  return <ReferralCodeCard initialCode={result.data} />;
}
