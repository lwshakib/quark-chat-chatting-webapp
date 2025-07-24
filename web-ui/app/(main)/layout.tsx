import { SocketProvider } from "@/context/SocketProvider";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await getOrCreateUser();
    return <div>
        <SocketProvider>{children}</SocketProvider></div>;
}