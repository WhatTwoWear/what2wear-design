import HomeClient from "./home-client"

export default function HomePage() {
  return <HomeClient />
}
import { useSession } from '@supabase/auth-helpers-react';

const session = useSession();
const userId = session?.user?.id;
