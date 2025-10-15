import { getCurrentUser } from "@/actions/auth";
import { Header } from "./header";

export async function HeaderWrapper() {
  const { data: user } = await getCurrentUser();

  return <Header user={user} />;
}
