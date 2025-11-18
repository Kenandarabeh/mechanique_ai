import * as React from "react";
import { MessagesSquare, History } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { SavedChatsList } from "@/components/assistant-ui/saved-chats-list";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";

function HistoryHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors">
      <History className="h-4 w-4 text-gray-200 dark:text-gray-300" />
      <h3 className="text-sm font-semibold text-gray-200 dark:text-gray-300">{t('sidebar.history')}</h3>
    </div>
  );
}

function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center justify-center w-full h-16 group"
      aria-label="Home"
    >
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg bg-white ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-300 dark:group-hover:ring-gray-600 transition-all">
          <NextImage
            src="/logo.png"
            alt="MechaMind Logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      </div>
    </Link>
  );
}

export function ThreadListSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="left" dir="ltr" {...props}>
      <SidebarHeader className="aui-sidebar-header mb-2 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="aui-sidebar-header-content flex items-center justify-center px-4">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="aui-sidebar-content px-2">
        <ThreadList />
        <Separator className="my-4" />
        <HistoryHeader />
        <SavedChatsList />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
