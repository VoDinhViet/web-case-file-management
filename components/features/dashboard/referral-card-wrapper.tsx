import { getReferralCode } from "@/actions";
import { ReferralCard } from "./referral-card";

export async function ReferralCardWrapper() {
  const result = await getReferralCode();

  return <ReferralCard initialCode={result.data} />;
}
