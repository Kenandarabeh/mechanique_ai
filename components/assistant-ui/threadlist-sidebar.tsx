import * as React from "react";
import { MessagesSquare, History } from "lucide-react";
import Link from "next/link";
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
    <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/20 transition-colors">
      <History className="h-4 w-4 text-blue-400" />
      <h3 className="text-sm font-semibold text-blue-400">{t('sidebar.history')}</h3>
    </div>
  );
}

export function ThreadListSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="left" dir="ltr" {...props}>
      <SidebarHeader className="aui-sidebar-header mb-2 border-b py-4">
        <div className="aui-sidebar-header-content flex items-center justify-center px-4">
          {/* Logo will be added here later */}
          <div className="aui-logo-placeholder flex items-center justify-center w-full h-16">
            <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
              <MessagesSquare className="size-6" />
            </div>
          </div>
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
